#!/usr/bin/env python3
"""
KirovAds site build — run after every text change:

    python3 build.py                     # uses PUBLISH_DATE below
    python3 build.py --date 2026-11-03   # set the blog publish/update date

What it does
  1. Bulgarian pages: every EN page in TRANSLATED_PAGES is copied to /bg/ with the
     text swapped for its data-bg attributes (the same rules the JS language switch
     uses), so the BG text is in the HTML for search engines and AI crawlers.
  2. Blog: each content/blog/*.md file (EN + BG sections) becomes two static post
     pages, /blog/<slug>.html and /bg/blog/<slug>.html, plus blog/posts.json.
  3. sitemap.xml with hreflang alternates for every page.
  4. QA: reports broken relative links/assets and EN text missing a BG translation.

Edit the EN pages and the .md files — never edit files under /bg/ by hand,
they are overwritten on every build. Python 3.8+, standard library only.
"""
import argparse
import datetime as dt
import html
import json
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = 'https://kirovads.com'

# Date shown as "Published" / "Last updated" on the blog posts. Set it to the deploy date.
PUBLISH_DATE = '2026-10-26'

# EN source pages that get a generated /bg/ copy
TRANSLATED_PAGES = ['index.html', 'services.html', 'about.html', 'contact.html',
                    'thank-you.html', 'blog/index.html']
# Pages that exist only in English — BG pages link to the EN version
EN_ONLY_PAGES = {'privacy.html', 'terms.html'}

# Author box. Set AUTHOR_PHOTO to e.g. 'assets/images/geno-kirov.jpg' once the photo exists.
AUTHOR_PHOTO = None
AUTHOR = {
    'en': {'name': 'Geno Kirov', 'role': 'Performance marketing consultant',
           'bio': 'Performance marketing consultant with 10+ years in Google Ads, Meta Ads and tracking, $20M+ in ad spend managed.'},
    'bg': {'name': 'Гено Киров', 'role': 'Консултант по performance маркетинг',
           'bio': 'Консултант по performance маркетинг с 10+ години опит в Google Ads, Meta реклами и проследяване, над $20M управляван рекламен бюджет.'},
}
CATEGORY_BG = {'Tracking': 'Проследяване', 'Google Ads': 'Google Ads', 'Tracking · EU': 'Проследяване · ЕС'}

# Phrases in a post that become a link to another post: (lang, phrase, post id)
CROSS_LINKS = [
    ('en', 'our Consent Mode v2 guide', 'consent-mode-v2'),
    ('bg', 'ръководството ни за Consent Mode v2', 'consent-mode-v2'),
]

UI = {
    'en': {'home': 'Home', 'blog': 'Blog', 'by': 'By', 'published': 'Published', 'updated': 'Last updated',
           'read': 'read', 'faq': 'Frequently asked questions', 'more': 'More articles',
           'img': '[Featured image placeholder]', 'linkedin': 'LinkedIn ↗',
           'cta_btn': 'Book a free 30-min call', 'audit_btn': 'Request an audit',
           'cta_h2': 'Want someone to check this for you?',
           'cta_p': 'Reading a checklist is a good start. Having your accounts reviewed by someone who does this every day is faster.'},
    'bg': {'home': 'Начало', 'blog': 'Блог', 'by': 'Автор:', 'published': 'Публикувано', 'updated': 'Последна актуализация',
           'read': 'четене', 'faq': 'Често задавани въпроси', 'more': 'Още статии',
           'img': '[Основна снимка — очаква се]', 'linkedin': 'LinkedIn ↗',
           'cta_btn': 'Запазете безплатен разговор', 'audit_btn': 'Поискайте одит',
           'cta_h2': 'Искате някой да провери това вместо вас?',
           'cta_p': 'Чек-листът е добро начало. Преглед от човек, който прави това всеки ден, е по-бързият път.'},
}
MONTHS_BG = ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август',
             'септември', 'октомври', 'ноември', 'декември']

GTM_HEAD = '''    <script>/* Google Consent Mode v2 — defaults before GTM loads; saved choice from the cookie banner applied immediately */window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied",functionality_storage:"granted",personalization_storage:"denied",security_storage:"granted",wait_for_update:500});gtag("set","ads_data_redaction",true);(function(){try{var c=JSON.parse(localStorage.getItem("kirovads_consent")||"null"),o=localStorage.getItem("kirovads_cookie_consent");if(!c&&o)c={analytics:o==="granted",marketing:o==="granted"};if(c){var a=c.analytics?"granted":"denied",m=c.marketing?"granted":"denied";gtag("consent","update",{analytics_storage:a,ad_storage:m,ad_user_data:m,ad_personalization:m});}}catch(e){}})();</script>
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TP88RP2F');</script>'''
GTM_BODY = '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TP88RP2F" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>'

warnings = []


def warn(msg):
    warnings.append(msg)


def esc(s):
    return html.escape(s, quote=False)


def esc_attr(s):
    return html.escape(s, quote=True)


def write(rel_path, text):
    path = os.path.join(ROOT, rel_path)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)


def read(rel_path):
    with open(os.path.join(ROOT, rel_path), encoding='utf-8') as f:
        return f.read()


# ---------------------------------------------------------------------------
# Minimal HTML tree that serialises back byte-for-byte unless a node is changed
# ---------------------------------------------------------------------------
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
        'param', 'source', 'track', 'wbr'}


class Raw:
    __slots__ = ('text', 'is_text', 'parent')

    def __init__(self, text, is_text=True):
        self.text, self.is_text, self.parent = text, is_text, None


class El:
    __slots__ = ('tag', 'attrs', 'children', 'start_raw', 'closed', 'self_closing', 'dirty', 'parent')

    def __init__(self, tag, attrs, start_raw, self_closing=False):
        self.tag, self.attrs, self.start_raw = tag, list(attrs), start_raw
        self.children, self.closed, self.self_closing = [], False, self_closing
        self.dirty, self.parent = False, None

    def get(self, key):
        for k, v in self.attrs:
            if k == key:
                return v
        return None

    def has(self, key):
        return any(k == key for k, _ in self.attrs)

    def set(self, key, value):
        for i, (k, _) in enumerate(self.attrs):
            if k == key:
                self.attrs[i] = (k, value)
                break
        else:
            self.attrs.append((key, value))
        self.dirty = True

    def append(self, node):
        node.parent = self
        self.children.append(node)


class TreeBuilder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.root = El('#root', [], '')
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        el = El(tag, attrs, self.get_starttag_text())
        self.stack[-1].append(el)
        if tag not in VOID:
            self.stack.append(el)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].append(El(tag, attrs, self.get_starttag_text(), self_closing=True))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack[i].closed = True
                del self.stack[i:]
                return
        self.stack[-1].append(Raw('</%s>' % tag, is_text=False))

    def handle_data(self, data):
        self.stack[-1].append(Raw(data))

    def handle_entityref(self, name):
        self.stack[-1].append(Raw('&%s;' % name))

    def handle_charref(self, name):
        self.stack[-1].append(Raw('&#%s;' % name))

    def handle_comment(self, data):
        self.stack[-1].append(Raw('<!--%s-->' % data, is_text=False))

    def handle_decl(self, decl):
        self.stack[-1].append(Raw('<!%s>' % decl, is_text=False))

    def unknown_decl(self, data):
        self.stack[-1].append(Raw('<![%s]>' % data, is_text=False))

    def handle_pi(self, data):
        self.stack[-1].append(Raw('<?%s>' % data, is_text=False))


def parse(text):
    tb = TreeBuilder()
    tb.feed(text)
    tb.close()
    return tb.root


def serialize(node):
    if isinstance(node, Raw):
        return node.text
    inner = ''.join(serialize(c) for c in node.children)
    if node.tag == '#root':
        return inner
    if node.dirty:
        parts = [node.tag] + [k if v is None else '%s="%s"' % (k, esc_attr(v)) for k, v in node.attrs]
        start = '<%s%s>' % (' '.join(parts), ' /' if node.self_closing else '')
    else:
        start = node.start_raw
    if node.self_closing or node.tag in VOID:
        return start
    return start + inner + ('</%s>' % node.tag if node.closed else '')


def walk(node):
    """Yield every element, document order. Safe while children are replaced."""
    for child in list(node.children):
        if isinstance(child, El):
            yield child
            yield from walk(child)


def text_content(node):
    if isinstance(node, Raw):
        return html.unescape(node.text) if node.is_text else ''
    if node.tag in ('script', 'style'):
        return ''
    return ''.join(text_content(c) for c in node.children)


def norm(s):
    return ' '.join(s.split())


# ---------------------------------------------------------------------------
# 1. Bulgarian versions of the main pages
# ---------------------------------------------------------------------------
def is_local_ref(value):
    return value is not None and not re.match(r'^(?:[a-z][a-z0-9+.-]*:|//|/|#)', value, re.I)


def rewrite_ref_for_bg(value):
    """Refs in a /bg/ page: assets and EN-only pages climb one level; translated pages stay inside /bg/."""
    path = re.split(r'[?#]', value, 1)[0]
    base = path.rsplit('/', 1)[-1]
    is_page = path == '' or path.endswith('/') or path.endswith('.html')
    if is_page and base not in EN_ONLY_PAGES:
        return value
    return '../' + value


def translate_element(el):
    """Same rules as applyLanguage() in main.js, applied to the static HTML."""
    bg = el.get('data-bg')
    if bg is not None and (el.has('data-en') or el.tag == 'title'):
        el_children = [c for c in el.children if isinstance(c, El)]
        if el.tag == 'title' or '<' not in bg and not el_children:
            el.children = []
            el.append(Raw(esc(bg)))
        elif '<' in bg:
            el.children = []
            el.append(Raw(bg))
        else:
            # Element has child elements (icon + text): replace the first text run
            kids, i = el.children, 0
            while i < len(kids):
                if isinstance(kids[i], Raw) and kids[i].is_text:
                    j = i
                    while j < len(kids) and isinstance(kids[j], Raw) and kids[j].is_text:
                        j += 1
                    run = ''.join(k.text for k in kids[i:j])
                    if run.strip():
                        lead = run[:len(run) - len(run.lstrip())]
                        new = Raw(lead + esc(bg) + ' ')
                        new.parent = el
                        kids[i:j] = [new]
                        break
                    i = j
                else:
                    i += 1
    for attr, target in (('data-bg-content', 'content'), ('data-bg-alt', 'alt'),
                         ('data-bg-placeholder', 'placeholder')):
        value = el.get(attr)
        if value is not None:
            el.set(target, value)


def check_translations(tree, page):
    for el in walk(tree):
        en = el.get('data-en')
        if en is not None and el.get('data-bg') is None:
            warn('%s: <%s> "%s" has data-en but no data-bg' % (page, el.tag, en[:60]))
        if en is not None and '<' not in en and not any(isinstance(c, El) for c in el.children):
            if norm(text_content(el)) != norm(en):
                warn('%s: visible EN text differs from data-en: "%s" vs "%s"'
                     % (page, norm(text_content(el))[:50], en[:50]))


def build_bg_page(page):
    src = read(page)
    tree = parse(src)
    check_translations(tree, page)

    bg_url = None
    for el in walk(tree):
        if el.tag == 'link' and el.get('rel') == 'alternate' and el.get('hreflang') == 'bg':
            bg_url = el.get('href')
    if not bg_url:
        sys.exit('%s has no <link rel="alternate" hreflang="bg"> — add one before building' % page)

    for el in walk(tree):
        translate_element(el)
        tag, rel, prop = el.tag, el.get('rel'), el.get('property')
        if tag == 'html':
            el.set('lang', 'bg')
        elif tag == 'link' and rel == 'canonical':
            el.set('href', bg_url)
        elif tag == 'meta' and prop == 'og:url':
            el.set('content', bg_url)
        elif tag == 'meta' and prop == 'og:locale':
            el.set('content', 'bg_BG')
        elif tag == 'meta' and prop == 'og:locale:alternate':
            el.set('content', 'en_US')
        elif tag == 'script' and el.get('type') == 'application/ld+json' and el.get('data-lang') == 'en':
            el.parent.children.remove(el)
            continue
        elif tag == 'script' and el.get('type') == 'text/x-bg-jsonld':
            el.set('type', 'application/ld+json')
        for attr in ('href', 'src'):
            value = el.get(attr)
            if is_local_ref(value):
                new = rewrite_ref_for_bg(value)
                if new != value:
                    el.set(attr, new)

    out = 'bg/' + page
    banner = '<!-- GENERATED by build.py from /%s — edit that file, not this one. -->\n' % page
    write(out, banner + serialize(tree))
    return out


# ---------------------------------------------------------------------------
# 2. Blog posts from content/blog/*.md
# ---------------------------------------------------------------------------
def slugify(text):
    text = re.sub(r'[^\w\s-]', '', text.lower(), flags=re.U)
    return re.sub(r'[\s_]+', '-', text).strip('-')


def md_inline(s):
    s = esc(s)
    codes = []

    def keep_code(m):
        codes.append(m.group(1))
        return '\x00%d\x00' % (len(codes) - 1)
    s = re.sub(r'`([^`]+)`', keep_code, s)
    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', r'<a href="\2">\1</a>', s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<![\s*])\*(?![\w*])', r'<em>\1</em>', s)
    return re.sub('\x00(\\d+)\x00', lambda m: '<code>%s</code>' % codes[int(m.group(1))], s)


def md_blocks(lines):
    """Paragraphs, headings, lists, blockquotes → list of (kind, payload)."""
    blocks, para, items, list_kind, quote = [], [], [], None, []

    def flush():
        nonlocal para, items, list_kind, quote
        if para:
            blocks.append(('p', para))
        if items:
            blocks.append((list_kind, items))
        if quote:
            blocks.append(('quote', quote))
        para, items, list_kind, quote = [], [], None, []

    for line in lines:
        s = line.rstrip()
        if not s.strip():
            flush()
            continue
        if s.startswith('>'):
            if not quote:
                flush()
            quote.append(s.lstrip('>').strip())
            continue
        m = re.match(r'^(#{1,6})\s+(.*)$', s)
        if m:
            flush()
            blocks.append(('h%d' % len(m.group(1)), m.group(2).strip()))
            continue
        m = re.match(r'^(?:[-*]|(\d+)\.)\s+(.*)$', s)
        if m:
            kind = 'ol' if m.group(1) else 'ul'
            if para or (items and list_kind != kind):
                flush()
            list_kind = kind
            items.append(m.group(2))
            continue
        if items:
            flush()
        para.append(s.strip())
    flush()
    return blocks


def parse_post_file(path):
    with open(path, encoding='utf-8') as f:
        lines = f.read().split('\n')

    def field(block_lines, name):
        for ln in block_lines:
            m = re.match(r'^- \*\*%s:\*\*\s*(.+)$' % re.escape(name), ln.strip())
            if m:
                return m.group(1).strip()
        return None

    try:
        i_en = lines.index('## ENGLISH')
        i_bg = lines.index('## БЪЛГАРСКИ')
    except ValueError:
        sys.exit('%s: needs "## ENGLISH" and "## БЪЛГАРСКИ" headings' % path)
    head = lines[:i_en]
    post_id = re.sub(r'^\d+-blog-', '', os.path.splitext(os.path.basename(path))[0])
    category = field(head, 'Category')
    minutes = re.sub(r'\D', '', field(head, 'Reading time') or '') or '5'
    image = field(head, 'Image')
    if image and not os.path.exists(os.path.join(ROOT, image)):
        warn('%s: image not found: %s' % (os.path.basename(path), image))
    post = {'id': post_id, 'image': image, 'image_brief': field(head, 'Image brief'), 'langs': {}}

    for lang, sec, url_field in (('en', lines[i_en + 1:i_bg], 'EN URL'), ('bg', lines[i_bg + 1:], 'BG URL')):
        while sec and sec[-1].strip() in ('', '---'):
            sec = sec[:-1]
        body_start = next(i for i, ln in enumerate(sec) if ln.startswith('# '))
        meta, body = sec[:body_start], sec[body_start:]
        h1 = body[0][2:].strip()
        body = [ln for ln in body[1:] if not re.match(r'^\*(By |Автор:)', ln.strip())]
        post['langs'][lang] = {
            'url': field(head, url_field),
            'title_tag': field(meta, 'Title tag'),
            'description': field(meta, 'Meta description'),
            'h1': h1,
            'category': category if lang == 'en' else CATEGORY_BG.get(category, category),
            'read_time': '%s min %s' % (minutes, UI['en']['read']) if lang == 'en' else '%s мин %s' % (minutes, UI['bg']['read']),
            'blocks': md_blocks(body),
        }
        missing = [k for k in ('url', 'title_tag', 'description') if not post['langs'][lang][k]]
        if missing:
            sys.exit('%s (%s): missing %s' % (path, lang, ', '.join(missing)))
    return post


def render_post_body(blocks, lang):
    """Blocks → HTML. Returns (html, faq [(q, a)], cta_text)."""
    out, faq, cta = [], [], None
    in_faq = False
    faq_heading = UI[lang]['faq'].lower()
    i = 0
    while i < len(blocks):
        kind, payload = blocks[i]
        if kind == 'h2':
            in_faq = payload.strip().lower() == faq_heading
            if in_faq:
                out.append('<h2 id="faq">%s</h2>' % md_inline(payload))
                out.append('<div class="faq-list">')
            else:
                out.append('<h2 id="%s">%s</h2>' % (slugify(payload), md_inline(payload)))
        elif kind == 'h3' and i + 1 < len(blocks) and blocks[i + 1][0] in ('ul', 'ol') \
                and payload.lower() in ('key takeaways', 'основни изводи'):
            items = ''.join('<li>%s</li>' % md_inline(x) for x in blocks[i + 1][1])
            out.append('<div class="post-takeaways"><h2>%s</h2><ul>%s</ul></div>' % (md_inline(payload), items))
            i += 1
        elif kind in ('h3', 'h4'):
            out.append('<%s>%s</%s>' % (kind, md_inline(payload), kind))
        elif kind == 'p' and in_faq and re.match(r'^\*\*.+\*\*$', payload[0]):
            q = payload[0].strip('*').strip()
            a = ' '.join(payload[1:])
            faq.append((q, a))
            out.append('<div class="faq-item"><button class="faq-question" type="button"><span>%s</span>'
                       '<span class="faq-question__icon">+</span></button><div class="faq-answer">'
                       '<div class="faq-answer__inner">%s</div></div></div>' % (md_inline(q), md_inline(a)))
        elif kind == 'p':
            text = ' '.join(payload)
            if re.match(r'^\*\*(Short answer|Кратък отговор):\*\*', text):
                out.append('<div class="post-answer"><p>%s</p></div>' % md_inline(text))
            else:
                out.append('<p>%s</p>' % md_inline(text))
        elif kind in ('ul', 'ol'):
            out.append('<%s>%s</%s>' % (kind, ''.join('<li>%s</li>' % md_inline(x) for x in payload), kind))
        elif kind == 'quote':
            for ln in payload:
                m = re.match(r'^\*\*CTA:\*\*\s*(.+)$', ln)
                if m:
                    cta = m.group(1)
            # Author box line is replaced by the generated author card
        i += 1
    if in_faq:
        out.append('</div>')
    return '\n      '.join(out), faq, cta


def format_date(iso, lang):
    d = dt.date.fromisoformat(iso)
    if lang == 'bg':
        return '%d %s %d г.' % (d.day, MONTHS_BG[d.month - 1], d.year)
    return d.strftime('%-d %B %Y') if os.name != 'nt' else d.strftime('%d %B %Y').lstrip('0')


def json_ld(data):
    return json.dumps(data, ensure_ascii=False, indent=2).replace('</', '<\\/')


def render_post(post, lang, date, posts_by_id):
    p = post['langs'][lang]
    other = 'bg' if lang == 'en' else 'en'
    ui = UI[lang]
    url = SITE + p['url']
    alt_url = SITE + post['langs'][other]['url']
    en_url = SITE + post['langs']['en']['url']
    depth = p['url'].count('/') - 1
    site = '../' * depth
    root = site + ('bg/' if lang == 'bg' else '')

    body, faq, cta = render_post_body(p['blocks'], lang)
    for link_lang, phrase, target in CROSS_LINKS:
        if link_lang == lang and target in posts_by_id and target != post['id']:
            href = site + posts_by_id[target]['langs'][lang]['url'].lstrip('/')
            body = body.replace(phrase, '<a href="%s">%s</a>' % (href, phrase), 1)

    graph = [{
        '@type': 'BlogPosting',
        '@id': url + '#article',
        'headline': p['h1'],
        'name': p['title_tag'],
        'description': p['description'],
        'url': url,
        'mainEntityOfPage': url,
        'datePublished': date,
        'dateModified': date,
        'inLanguage': lang,
        'articleSection': p['category'],
        **({'image': SITE + '/' + post['image']} if post['image'] else {}),
        'author': {'@type': 'Person', '@id': SITE + '/#geno', 'name': 'Geno Kirov',
                   'url': SITE + '/about.html', 'sameAs': ['https://www.linkedin.com/in/geno-kirov/']},
        'publisher': {'@type': 'ProfessionalService', '@id': SITE + '/#business', 'name': 'KirovAds', 'url': SITE + '/'},
    }]
    if faq:
        graph.append({'@type': 'FAQPage', 'inLanguage': lang, 'mainEntity': [
            {'@type': 'Question', 'name': q,
             'acceptedAnswer': {'@type': 'Answer', 'text': re.sub(r'[`*]', '', a)}} for q, a in faq]})

    if cta:
        first, _, rest = cta.partition('? ')
        cta_h, cta_p = (first + '?', rest) if rest else (ui['cta_h2'], cta)
    else:
        cta_h, cta_p = ui['cta_h2'], ui['cta_p']

    author = AUTHOR[lang]
    photo = ('<img src="%s%s" alt="%s" width="72" height="72">' % (site, AUTHOR_PHOTO, esc_attr(author['name']))
             if AUTHOR_PHOTO else 'GK')
    pub = format_date(date, lang)
    if post['image']:
        featured = ('<img class="post-featured-img" src="%s%s" alt="%s" width="1600" height="900" loading="eager">'
                    % (site, post['image'], esc_attr(p['h1'])))
        og_image = ('\n  <meta property="og:image" content="%s/%s">\n  <meta name="twitter:card" content="summary_large_image">'
                    % (SITE, post['image']))
    else:
        featured = ('<!-- Image brief: %s -->\n      <div class="img-placeholder" style="min-height:320px;border-radius:var(--radius-md);margin-bottom:2.5rem">'
                    '<span>%s</span></div>' % (esc(post['image_brief'] or ''), ui['img']))
        og_image = ''

    return '''<!DOCTYPE html>
<!-- GENERATED by build.py from content/blog/ — edit the .md file, not this one. -->
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | KirovAds</title>
  <meta name="description" content="{desc}">
  <meta name="author" content="Geno Kirov">
  <link rel="canonical" href="{url}">
  <link rel="alternate" hreflang="{lang}" href="{url}">
  <link rel="alternate" hreflang="{other}" href="{alt_url}">
  <link rel="alternate" hreflang="x-default" href="{en_url}">

  <meta property="og:type" content="article">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:locale" content="{locale}">
  <meta property="article:author" content="Geno Kirov">
  <meta property="article:published_time" content="{date}">
  <meta property="article:modified_time" content="{date}">{og_image}

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{site}assets/css/style.css">

{gtm_head}

  <script type="application/ld+json">
{ld}
  </script>
</head>
<body>
{gtm_body}

<div id="nav-placeholder"></div>

<section class="post-hero" aria-label="Article header">
  <div class="container">
    <div class="page-hero__breadcrumb">
      <a href="{root}index.html">{home}</a>
      <span>›</span>
      <a href="{root}blog/index.html">{blog}</a>
      <span>›</span>
      <span>{category}</span>
    </div>
    <div class="badge badge-white mb-3">{category}</div>
    <h1 class="text-white" style="max-width:820px">{h1}</h1>
    <div class="post-byline">
      <div class="post-byline__author">
        <div class="post-byline__avatar">{photo}</div>
        <div>
          <div class="post-byline__name">{by} {author_name}</div>
          <div class="post-byline__role">{author_role}</div>
        </div>
      </div>
      <div>{published}: <time datetime="{date}">{pub}</time></div>
      <div>{updated}: <time datetime="{date}">{pub}</time></div>
      <div>{read_time}</div>
    </div>
  </div>
</section>

<div class="container">
  <div class="post-content">
    <article class="post-body">
      {featured}

      {body}

      <div class="post-author-card">
        <div class="post-author-card__photo">{photo}</div>
        <div>
          <div class="post-author-card__name">{author_name}</div>
          <p class="post-author-card__bio">{author_bio}</p>
          <a href="https://www.linkedin.com/in/geno-kirov/" target="_blank" rel="noopener noreferrer" class="btn btn-outline-dark btn-sm">{linkedin}</a>
        </div>
      </div>
    </article>

    <aside class="post-sidebar">
      <div class="post-cta-box">
        <h4>{cta_h}</h4>
        <p>{cta_p}</p>
        <a href="{root}contact.html?interest=call" class="btn btn-primary" style="width:100%;justify-content:center;margin-bottom:.6rem"
           onclick="gtmEvent('cta_click',{{location:'blog_sidebar',label:'Book free call',post:'{id}'}})">{cta_btn}</a>
        <a href="{root}contact.html?interest=audit" class="btn btn-outline" style="width:100%;justify-content:center"
           onclick="gtmEvent('cta_click',{{location:'blog_sidebar',label:'Request audit',post:'{id}'}})">{audit_btn}</a>
      </div>
    </aside>
  </div>
</div>

<section class="cta-section" aria-label="Call to action">
  <div class="container">
    <h2>{cta_h2}</h2>
    <p>{cta_p2}</p>
    <div class="flex-gap">
      <a href="{root}contact.html?interest=call" class="btn btn-white btn-lg"
         onclick="gtmEvent('cta_click',{{location:'post_cta',label:'Book free call',post:'{id}'}})">{cta_btn}</a>
      <a href="{root}blog/index.html" class="btn btn-outline btn-lg">{more}</a>
    </div>
  </div>
</section>

<div id="footer-placeholder"></div>
<script src="{site}assets/js/components.js"></script>
<script src="{site}assets/js/main.js"></script>
<script>initComponents('blog');</script>
</body>
</html>
'''.format(
        lang=lang, other=other, url=url, alt_url=alt_url, en_url=en_url,
        title=esc_attr(p['title_tag']), desc=esc_attr(p['description']),
        locale='bg_BG' if lang == 'bg' else 'en_US', date=date, site=site, root=root,
        gtm_head=GTM_HEAD, gtm_body=GTM_BODY,
        ld='  ' + json_ld({'@context': 'https://schema.org', '@graph': graph}).replace('\n', '\n  '),
        home=ui['home'], blog=ui['blog'], category=esc(p['category']), h1=md_inline(p['h1']),
        photo=photo, by=ui['by'], author_name=esc(author['name']), author_role=esc(author['role']),
        author_bio=esc(author['bio']), published=ui['published'], updated=ui['updated'], pub=pub,
        read_time=esc(p['read_time']), featured=featured, og_image=og_image, body=body, linkedin=ui['linkedin'],
        cta_h=md_inline(cta_h), cta_p=md_inline(cta_p), cta_btn=ui['cta_btn'], audit_btn=ui['audit_btn'],
        cta_h2=ui['cta_h2'], cta_p2=ui['cta_p'], more=ui['more'], id=post['id'])


def build_blog(date):
    folder = os.path.join(ROOT, 'content', 'blog')
    files = sorted(f for f in os.listdir(folder) if f.endswith('.md'))
    posts = [parse_post_file(os.path.join(folder, f)) for f in files]
    by_id = {p['id']: p for p in posts}
    outputs, index = [], []
    for post in posts:
        for lang in ('en', 'bg'):
            rel = post['langs'][lang]['url'].lstrip('/')
            write(rel, render_post(post, lang, date, by_id))
            outputs.append(rel)
        index.append({
            'id': post['id'],
            'published': True,
            'datePublished': date,
            'dateModified': date,
            'image': post['image'],
            **{lang: {'title': post['langs'][lang]['h1'],
                      'excerpt': post['langs'][lang]['description'],
                      'category': post['langs'][lang]['category'],
                      'readTime': post['langs'][lang]['read_time'],
                      'url': post['langs'][lang]['url']} for lang in ('en', 'bg')},
        })
    write('blog/posts.json', json.dumps(index, ensure_ascii=False, indent=2) + '\n')
    return posts, outputs


# ---------------------------------------------------------------------------
# 3. Sitemap
# ---------------------------------------------------------------------------
def page_url(rel):
    rel = re.sub(r'(^|/)index\.html$', r'\1', rel)
    return SITE + '/' + rel


def build_sitemap(posts, date):
    entries = []
    for page in TRANSLATED_PAGES:
        if page == 'thank-you.html':
            continue
        entries.append(({'en': page_url(page), 'bg': page_url('bg/' + page)}, date))
    for post in posts:
        entries.append(({lang: SITE + post['langs'][lang]['url'] for lang in ('en', 'bg')}, date))
    for page in sorted(EN_ONLY_PAGES):
        mtime = dt.date.fromtimestamp(os.path.getmtime(os.path.join(ROOT, page))).isoformat()
        entries.append(({'en': page_url(page)}, mtime))

    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
           '        xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for urls, lastmod in entries:
        for lang, loc in urls.items():
            out.append('  <url>')
            out.append('    <loc>%s</loc>' % loc)
            out.append('    <lastmod>%s</lastmod>' % lastmod)
            if len(urls) > 1:
                for alt_lang, alt in urls.items():
                    out.append('    <xhtml:link rel="alternate" hreflang="%s" href="%s"/>' % (alt_lang, alt))
                out.append('    <xhtml:link rel="alternate" hreflang="x-default" href="%s"/>' % urls['en'])
            out.append('  </url>')
    out.append('</urlset>')
    write('sitemap.xml', '\n'.join(out) + '\n')
    return sum(len(u) for u, _ in entries)


# ---------------------------------------------------------------------------
# 4. Link check
# ---------------------------------------------------------------------------
def check_links():
    checked = 0
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if not d.startswith('.') and d != 'content']
        for name in filenames:
            if not name.endswith('.html'):
                continue
            path = os.path.join(dirpath, name)
            rel = os.path.relpath(path, ROOT)
            with open(path, encoding='utf-8') as f:
                tree = parse(f.read())
            for el in walk(tree):
                for attr in ('href', 'src'):
                    value = el.get(attr)
                    if not is_local_ref(value) or '${' in value:
                        continue
                    target = re.split(r'[?#]', value, 1)[0]
                    if not target:
                        continue
                    full = os.path.normpath(os.path.join(dirpath, target))
                    if target.endswith('/') or os.path.isdir(full):
                        full = os.path.join(full, 'index.html')
                    checked += 1
                    if not os.path.exists(full):
                        warn('%s: broken link %s="%s"' % (rel, attr, value))
    return checked


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--date', default=PUBLISH_DATE, help='blog publish / last-updated date, YYYY-MM-DD')
    args = ap.parse_args()
    dt.date.fromisoformat(args.date)

    bg_pages = [build_bg_page(p) for p in TRANSLATED_PAGES]
    posts, post_pages = build_blog(args.date)
    n_urls = build_sitemap(posts, args.date)
    n_links = check_links()

    print('BG pages:   %s' % ', '.join(bg_pages))
    print('Blog posts: %s' % ', '.join(post_pages))
    print('Also wrote: blog/posts.json, sitemap.xml (%d URLs)' % n_urls)
    print('Checked %d local links/assets.' % n_links)
    if warnings:
        print('\n%d warning(s):' % len(warnings))
        for w in warnings:
            print('  - ' + w)
        sys.exit(1)
    print('No warnings.')


if __name__ == '__main__':
    main()

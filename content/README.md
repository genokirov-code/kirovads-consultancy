# Editing the KirovAds site

## Pages
Edit the English pages in the site root (`index.html`, `services.html`, `about.html`,
`contact.html`, `thank-you.html`, `blog/index.html`). Every translatable element
carries both languages:

```html
<p data-en="English text" data-bg="Български текст">English text</p>
```

Keep the visible text and `data-en` identical. Meta tags use `data-bg-content`,
images `data-bg-alt`, inputs `data-bg-placeholder`, `<title>` uses `data-bg`.

**Never edit files in `/bg/`** — they are generated.

## Blog posts
One Markdown file per post in `content/blog/`, with an `## ENGLISH` and a
`## БЪЛГАРСКИ` section (same format as the three existing posts). The header
lines `EN URL`, `BG URL`, `Category` and `Reading time` are required.

## Build
After any change run:

```
python3 build.py --date YYYY-MM-DD
```

`--date` sets the "Published / Last updated" date on the blog posts (defaults to
`PUBLISH_DATE` in build.py). The script regenerates `/bg/`, the blog post pages,
`blog/posts.json` and `sitemap.xml`, then checks every link. It exits with a list
of warnings if a link is broken or an element has `data-en` without `data-bg`.

## Deploy
Upload the whole folder (Netlify / Cloudflare Pages). `_redirects` sends the old
2025 blog URLs to the new posts with 301s. `content/` and `build.py` can be
uploaded too — robots.txt keeps them out of search.

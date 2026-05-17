/* =============================================
   KIROVADS.COM — Main JS
   Language toggle, GTM events, form handling,
   scroll animations, blog post loader
   ============================================= */

/* === GTM EVENT HELPER === */
function gtmEvent(eventName, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

/* === LANGUAGE SYSTEM === */
const SUPPORTED_LANGS = ['en', 'bg'];
let currentLang = 'en';

function detectLanguage() {
  const stored = localStorage.getItem('kirovads_lang');
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  const browser = (navigator.language || '').toLowerCase();
  if (browser.startsWith('bg')) return 'bg';
  return 'en';
}

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  /* Update all translatable elements */
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (!text) return;
    /* If the data attribute contains HTML tags, use innerHTML */
    if (text.includes('<')) {
      el.innerHTML = text;
    } else if (el.children.length === 0) {
      el.textContent = text;
    } else {
      /* Element has child elements (e.g. buttons with icons) — update first text node */
      for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          node.textContent = text + ' ';
          break;
        }
      }
    }
    /* Also update placeholder attributes */
    if (el.hasAttribute('placeholder')) {
      const ph = el.getAttribute(`data-${lang}-placeholder`);
      if (ph) el.setAttribute('placeholder', ph);
    }
  });

  /* Update HTML lang attribute placeholders on inputs */
  document.querySelectorAll('[data-en-placeholder]').forEach(el => {
    const ph = el.getAttribute(`data-${lang}-placeholder`);
    if (ph) el.setAttribute('placeholder', ph);
  });

  /* Update lang toggle buttons */
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active',
      (btn.id === 'langEN' || btn.id === 'langEN_m') ? lang === 'en' : lang === 'bg'
    );
  });

  /* Update <title> if page has data-en/bg title */
  const titleMeta = document.querySelector('meta[data-en-title]');
  if (titleMeta) {
    document.title = titleMeta.getAttribute(`data-${lang}-title`) || document.title;
  }

  localStorage.setItem('kirovads_lang', lang);
}

function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  applyLanguage(lang);
  gtmEvent('language_switch', { language: lang });
}

/* === SCROLL ANIMATIONS === */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}

/* === FAQ ACCORDION === */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      /* Close all */
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* === LOAD LATEST BLOG POSTS === */
async function loadLatestPosts(count = 3) {
  const grid = document.getElementById('latestPostsGrid');
  if (!grid) return;

  const r = getRootPath ? getRootPath() : '';
  const isDark = grid.closest('.section--dark') !== null;

  try {
    const res = await fetch(`${r}blog/posts.json`);
    if (!res.ok) throw new Error('Failed to load posts');
    const posts = await res.json();
    const latest = posts.filter(p => p.published).slice(0, count);

    if (!latest.length) { grid.innerHTML = '<p style="text-align:center;color:var(--gray-400)">Coming soon.</p>'; return; }

    grid.innerHTML = latest.map(post => `
      <article class="blog-card${isDark ? ' blog-card--dark' : ''} fade-in">
        <div class="blog-card__img">
          <div class="img-placeholder${isDark ? ' img-placeholder--dark' : ''}" style="min-height:180px">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" opacity="0.3">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14
                   M8 11a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
            <span data-en="[Image Placeholder]" data-bg="[Снимка — очаква се]">[Image Placeholder]</span>
          </div>
        </div>
        <div class="blog-card__body">
          <div class="blog-card__category">${post.category}</div>
          <h3 class="blog-card__title">${post.title}</h3>
          <p class="blog-card__excerpt">${post.excerpt}</p>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div class="blog-card__meta">
              <span>${post.date}</span>
              <span>·</span>
              <span>${post.readTime}</span>
            </div>
            <a href="${r}blog/posts/${post.slug}.html" class="blog-card__read-more"
               data-en="Read →" data-bg="Прочети →"
               onclick="gtmEvent('blog_click',{post:'${post.slug}',location:'latest_section'})">Read →</a>
          </div>
        </div>
      </article>
    `).join('');

    /* Re-apply language to freshly injected elements */
    applyLanguage(currentLang);
    initScrollAnimations();
  } catch (e) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:2rem">
        <a href="${r}blog/index.html" class="btn btn-outline-dark"
           data-en="Visit the Blog" data-bg="Виж блога">Visit the Blog</a>
      </div>`;
  }
}

/* === CONTACT FORM === */
function initContactForm() {
  const form = document.getElementById('auditForm');
  if (!form) return;

  /* Track form start (first interaction) */
  let formStarted = false;
  form.addEventListener('focusin', () => {
    if (!formStarted) {
      formStarted = true;
      gtmEvent('form_start', { form_id: 'audit_form' });
    }
  });

  /* Real-time validation */
  form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => { if (field.classList.contains('error')) validateField(field); });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading-spinner"></span>';
    submitBtn.disabled = true;

    /* Collect form data */
    const data = new FormData(form);
    const formObj = {};
    data.forEach((v, k) => { formObj[k] = v; });

    /* GTM form_submit event */
    gtmEvent('form_submit', {
      form_id: 'audit_form',
      industry: formObj.industry || '',
      budget: formObj.budget || '',
      platforms: formObj.platforms || '',
    });

    /* Formspree submission — replace YOUR_FORM_ID with actual Formspree ID */
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mzdoagvn';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        window.location.href = (getRootPath ? getRootPath() : '') + 'thank-you.html';
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      /* Fallback: still redirect to thank-you (replace with real handler later) */
      window.location.href = (getRootPath ? getRootPath() : '') + 'thank-you.html';
    }
  });
}

function validateField(field) {
  const errEl = field.parentElement.querySelector('.form-error');
  const lang = currentLang;
  let valid = true;
  let msg = '';

  if (field.required && !field.value.trim()) {
    valid = false;
    msg = lang === 'bg' ? 'Това поле е задължително.' : 'This field is required.';
  } else if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
    valid = false;
    msg = lang === 'bg' ? 'Моля, въведи валиден имейл адрес.' : 'Please enter a valid email address.';
  }

  field.classList.toggle('error', !valid);
  if (errEl) { errEl.textContent = msg; errEl.style.display = valid ? 'none' : 'block'; }
  return valid;
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
    if (!validateField(field)) valid = false;
  });
  const consent = form.querySelector('#gdprConsent');
  if (consent && !consent.checked) {
    const errEl = consent.closest('.form-consent').querySelector('.form-error');
    const msg = currentLang === 'bg' ? 'Необходимо е вашето съгласие.' : 'Your consent is required.';
    if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
    valid = false;
  }
  return valid;
}

/* === COUNTER ANIMATION === */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function initCounters() {
  const statsSection = document.querySelector('.stats');
  if (!statsSection) return;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounters(); observer.disconnect(); }
  }, { threshold: 0.4 });
  observer.observe(statsSection);
}

/* === INIT === */
document.addEventListener('DOMContentLoaded', () => {
  /* Apply saved/detected language */
  const lang = detectLanguage();
  applyLanguage(lang);

  initScrollAnimations();
  initFAQ();
  initContactForm();
  initCounters();
  loadLatestPosts();
});

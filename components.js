/* =============================================
   KIROVADS.COM — Shared Components
   Nav, Footer, Latest Blog Posts
   ============================================= */

/* Language of the page itself, taken from its URL: /bg/... is Bulgarian */
function getPageLang() {
  return /^\/bg(\/|$)/.test(window.location.pathname) ? 'bg' : 'en';
}

/* Relative path from the current page to the site root — for shared assets
   and for pages that exist only in English (privacy, terms) */
function getSiteRoot() {
  const path = window.location.pathname.replace(/^\/bg(?=\/|$)/, '') || '/';
  const depth = path.split('/').length - 2;
  return '../'.repeat(Math.max(depth, 0)) + (getPageLang() === 'bg' ? '../' : '');
}

/* Relative path to the root of the language being shown (/ or /bg/) */
function getRootPath() {
  const lang = typeof currentLang !== 'undefined' ? currentLang : getPageLang();
  return getSiteRoot() + (lang === 'bg' ? 'bg/' : '');
}

function getNavHTML(activePage) {
  const r = getRootPath();
  const pages = [
    { id: 'home',     en: 'Home',     bg: 'Начало',   href: `${r}index.html` },
    { id: 'services', en: 'Services', bg: 'Услуги',   href: `${r}services.html` },
    { id: 'about',    en: 'About',    bg: 'За мен',   href: `${r}about.html` },
    { id: 'blog',     en: 'Blog',     bg: 'Блог',     href: `${r}blog/index.html` },
    { id: 'contact',  en: 'Contact',  bg: 'Контакт',  href: `${r}contact.html` },
  ];

  const links = pages.map(p => `
    <a href="${p.href}" class="nav__link${activePage === p.id ? ' active' : ''}" data-page="${p.id}"
       data-en="${p.en}" data-bg="${p.bg}">${p.en}</a>
  `).join('');

  const mobileLinks = pages.map(p => `
    <a href="${p.href}" class="nav__mobile-link"
       data-en="${p.en}" data-bg="${p.bg}">${p.en}</a>
  `).join('');

  return `
    <nav class="nav" id="mainNav" aria-label="Main navigation">
      <div class="container">
        <div class="nav__inner">
          <a href="${r}index.html" class="nav__logo">KIROV<span>ADS</span></a>
          <div class="nav__links">${links}</div>
          <div class="nav__right">
            <div class="lang-toggle" role="group" aria-label="Language selector">
              <button class="lang-btn" id="langEN" onclick="setLanguage('en')" aria-label="Switch to English">EN</button>
              <button class="lang-btn" id="langBG" onclick="setLanguage('bg')" aria-label="Смяна на езика">BG</button>
            </div>
            <a href="${r}contact.html" class="btn btn-primary btn-sm"
               data-en="Book a free call" data-bg="Безплатен разговор"
               onclick="gtmEvent('cta_click',{location:'nav',label:'Book free call'})">Book a free call</a>
          </div>
          <div class="nav__hamburger" id="navHamburger" onclick="openMobileNav()" aria-label="Open menu">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </nav>

    <div class="nav__mobile" id="mobileNav" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <button class="nav__mobile-close" onclick="closeMobileNav()" aria-label="Close menu">✕</button>
      ${mobileLinks}
      <div class="lang-toggle" style="margin-top:1rem">
        <button class="lang-btn" id="langEN_m" onclick="setLanguage('en')" aria-label="English">EN</button>
        <button class="lang-btn" id="langBG_m" onclick="setLanguage('bg')" aria-label="Български">BG</button>
      </div>
      <a href="${r}contact.html" class="btn btn-primary" style="margin-top:1rem"
         data-en="Book a free call" data-bg="Безплатен разговор">Book a free call</a>
    </div>
  `;
}

function getFooterHTML() {
  const r = getRootPath();
  const site = getSiteRoot();
  return `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <a href="${r}index.html" class="footer__logo">KIROV<span>ADS</span></a>
            <p class="footer__tagline"
               data-en="Google Ads, Meta Ads and tracking for businesses in Bulgaria and the EU. AI-assisted analysis, every finding checked by a human."
               data-bg="Google Ads, Meta реклами и проследяване за бизнеси в България и ЕС. Анализ с помощта на AI, всеки извод — проверен от човек.">
              Google Ads, Meta Ads and tracking for businesses in Bulgaria and the EU. AI-assisted analysis, every finding checked by a human.
            </p>
            <div class="footer__social">
              <a href="https://www.linkedin.com/in/geno-kirov/" target="_blank" rel="noopener noreferrer"
                 class="footer__social-link" aria-label="LinkedIn" title="LinkedIn">in</a>
            </div>
          </div>

          <div>
            <h4 class="footer__heading" data-en="Services" data-bg="Услуги">Services</h4>
            <ul class="footer__links">
              <li><a href="${r}services.html#audit" class="footer__link" data-en="Ads &amp; Tracking Audit" data-bg="Одит на реклами и проследяване">Ads &amp; Tracking Audit</a></li>
              <li><a href="${r}services.html#google-ads" class="footer__link" data-en="Google Ads Management" data-bg="Управление на Google Ads">Google Ads Management</a></li>
              <li><a href="${r}services.html#meta-ads" class="footer__link" data-en="Meta Ads Management" data-bg="Управление на Meta реклами">Meta Ads Management</a></li>
              <li><a href="${r}services.html#tracking" class="footer__link" data-en="Tracking Setup &amp; Repair" data-bg="Настройка на проследяването">Tracking Setup &amp; Repair</a></li>
              <li><a href="${r}services.html#strategy" class="footer__link" data-en="Strategy &amp; Consultancy" data-bg="Стратегия и консултации">Strategy &amp; Consultancy</a></li>
              <li><a href="${r}services.html#pricing" class="footer__link" data-en="Pricing" data-bg="Цени">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer__heading" data-en="Company" data-bg="Компания">Company</h4>
            <ul class="footer__links">
              <li><a href="${r}about.html" class="footer__link" data-en="About Geno" data-bg="За Гено">About Geno</a></li>
              <li><a href="${r}blog/index.html" class="footer__link" data-en="Blog" data-bg="Блог">Blog</a></li>
              <li><a href="${r}contact.html" class="footer__link" data-en="Contact" data-bg="Контакт">Contact</a></li>
              <li><a href="${r}contact.html?interest=call" class="footer__link" data-en="Free 30-min call" data-bg="Безплатен 30-мин разговор">Free 30-min call</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer__heading" data-en="Contact" data-bg="Контакти">Contact</h4>
            <div class="footer__contact-item">
              <span>📧</span>
              <a href="mailto:geno@kirovads.com">geno@kirovads.com</a>
            </div>
            <div class="footer__contact-item">
              <span>📞</span>
              <a href="tel:+359878647478">+359 878 647 478</a>
            </div>
            <div class="footer__contact-item" style="margin-top:1rem">
              <a href="${r}contact.html" class="btn btn-primary btn-sm" style="width:100%;justify-content:center"
                 data-en="Book a free call" data-bg="Безплатен разговор"
                 onclick="gtmEvent('cta_click',{location:'footer',label:'Book free call'})">Book a free call</a>
            </div>
          </div>
        </div>

        <div class="footer__bottom">
          <p class="footer__copy">
            © <span id="footerYear"></span> KirovAds.
            <span data-en="All rights reserved." data-bg="Всички права запазени.">All rights reserved.</span>
          </p>
          <div class="footer__legal">
            <a href="${site}privacy.html" class="footer__legal-link" data-en="Privacy Policy" data-bg="Политика за поверителност">Privacy Policy</a>
            <a href="${site}terms.html" class="footer__legal-link" data-en="Terms of Service" data-bg="Общи условия">Terms of Service</a>
            <button type="button" class="footer__legal-link footer__cookie-link" onclick="openCookieSettings()" data-en="Cookie settings" data-bg="Настройки на бисквитките">Cookie settings</button>
          </div>
        </div>
      </div>
    </footer>
  `;
}

/* Latest blog posts section — used on homepage, about, services */
function getLatestPostsSection(darkMode = false, rootPath = '') {
  const r = rootPath || getRootPath();
  return `
    <section class="section${darkMode ? ' section--dark' : ''}" id="latest-blog">
      <div class="container">
        <div class="section-header${darkMode ? ' section-header--dark' : ''}">
          <div class="badge${darkMode ? ' badge-navy' : ' badge-blue'}"
               data-en="Guides &amp; insights" data-bg="Ръководства и анализи">Guides &amp; insights</div>
          <h2 data-en="From the blog" data-bg="От блога">From the blog</h2>
          <p data-en="Practical guides on Google Ads, Meta Ads and tracking. Written from real accounts, not theory."
             data-bg="Практични ръководства за Google Ads, Meta реклами и проследяване. Написани от реални акаунти, не от теория.">
            Practical guides on Google Ads, Meta Ads and tracking. Written from real accounts, not theory.
          </p>
        </div>
        <div class="blog-section__grid" id="latestPostsGrid">
          <!-- Loaded by loadLatestPosts() in main.js -->
          <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray-400);">
            <div class="loading-spinner" style="margin:0 auto 1rem;border-color:var(--gray-200);border-top-color:var(--blue-500)"></div>
          </div>
        </div>
        <div class="text-center mt-4">
          <a href="${r}blog/index.html" class="btn${darkMode ? ' btn-outline' : ' btn-outline-dark'}"
             data-en="View all articles →" data-bg="Всички статии →"
             onclick="gtmEvent('cta_click',{location:'blog_section',label:'View all articles'})">
            View all articles →
          </a>
        </div>
      </div>
    </section>
  `;
}

/* === COOKIE CONSENT (Google Consent Mode v2) ===
   The <head> of every page sets all consent signals to "denied" and then applies
   the stored choice before GTM loads. This banner records the visitor's choice:
     analytics → analytics_storage
     marketing → ad_storage, ad_user_data, ad_personalization
   Choice is stored in localStorage "kirovads_consent" as {analytics, marketing, ts}.
   Each choice also pushes dataLayer event "cookie_consent" with
   consent_analytics / consent_marketing = "granted" | "denied" for GTM triggers.
   Continuing to browse (click outside the banner or scroll) counts as "accept all". */
const CONSENT_KEY = 'kirovads_consent';

function getStoredConsent() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
    if (saved && typeof saved.analytics === 'boolean') return saved;
    const legacy = localStorage.getItem('kirovads_cookie_consent');
    if (legacy) return { analytics: legacy === 'granted', marketing: legacy === 'granted' };
  } catch (e) { /* storage blocked */ }
  return null;
}

function getCookieBannerHTML() {
  const r = getSiteRoot();
  return `
    <div class="cookie-banner" id="cookieBanner" role="dialog" aria-label="Cookie consent" aria-live="polite">
      <div class="cookie-banner__inner">
        <div class="cookie-banner__main">
          <p class="cookie-banner__text"
             data-en="We use cookies to measure how the site is used (analytics) and to show relevant ads (marketing). Continuing to browse counts as accepting all cookies. You can change this any time under Cookie settings. <a href='${r}privacy.html'>Privacy Policy</a>"
             data-bg="Използваме бисквитки, за да измерваме как се използва сайтът (анализ) и да показваме подходящи реклами (маркетинг). Ако продължите да разглеждате, приемаме, че сте съгласни с всички бисквитки. Можете да промените избора си по всяко време от „Настройки на бисквитките“. <a href='${r}privacy.html'>Политика за поверителност</a>">
            We use cookies to measure how the site is used (analytics) and to show relevant ads (marketing). Continuing to browse counts as accepting all cookies. You can change this any time under Cookie settings. <a href="${r}privacy.html">Privacy Policy</a>
          </p>
          <div class="cookie-banner__settings" id="cookieSettings" hidden>
            <label class="cookie-toggle cookie-toggle--locked">
              <input type="checkbox" checked disabled>
              <span class="cookie-toggle__switch" aria-hidden="true"></span>
              <span class="cookie-toggle__text">
                <strong data-en="Necessary" data-bg="Необходими">Necessary</strong>
                <span data-en="Required for the site to work, e.g. remembering this choice. Always on."
                      data-bg="Нужни за работата на сайта, напр. за запомняне на този избор. Винаги включени.">Required for the site to work, e.g. remembering this choice. Always on.</span>
              </span>
            </label>
            <label class="cookie-toggle">
              <input type="checkbox" id="consentAnalytics">
              <span class="cookie-toggle__switch" aria-hidden="true"></span>
              <span class="cookie-toggle__text">
                <strong data-en="Analytics" data-bg="Анализ">Analytics</strong>
                <span data-en="Google Analytics — anonymous statistics on how visitors use the site."
                      data-bg="Google Analytics — анонимна статистика как посетителите използват сайта.">Google Analytics — anonymous statistics on how visitors use the site.</span>
              </span>
            </label>
            <label class="cookie-toggle">
              <input type="checkbox" id="consentMarketing">
              <span class="cookie-toggle__switch" aria-hidden="true"></span>
              <span class="cookie-toggle__text">
                <strong data-en="Marketing" data-bg="Маркетинг">Marketing</strong>
                <span data-en="Google Ads and Meta (Facebook/Instagram) — measuring ads and showing relevant ones."
                      data-bg="Google Ads и Meta (Facebook/Instagram) — измерване на рекламите и показване на подходящи реклами.">Google Ads and Meta (Facebook/Instagram) — measuring ads and showing relevant ones.</span>
              </span>
            </label>
          </div>
        </div>
        <div class="cookie-banner__actions">
          <button type="button" class="cookie-banner__btn cookie-banner__btn--decline" id="cookieSettingsBtn"
                  data-en="Settings" data-bg="Настройки">Settings</button>
          <button type="button" class="cookie-banner__btn cookie-banner__btn--decline cookie-banner__btn--save" id="cookieSave" hidden
                  data-en="Save choices" data-bg="Запази избора">Save choices</button>
          <button type="button" class="cookie-banner__btn cookie-banner__btn--reject" id="cookieDecline"
                  data-en="Reject all" data-bg="Откажи всички">Reject all</button>
          <button type="button" class="cookie-banner__btn cookie-banner__btn--accept" id="cookieAccept"
                  data-en="Accept all" data-bg="Приеми всички">Accept all</button>
        </div>
      </div>
    </div>
  `;
}

let consentAutoAcceptOff = null;

function showCookieBanner({ openSettings = false, autoAccept = true } = {}) {
  let banner = document.getElementById('cookieBanner');
  if (!banner) {
    document.body.insertAdjacentHTML('beforeend', getCookieBannerHTML());
    banner = document.getElementById('cookieBanner');
    if (typeof applyLanguage === 'function') applyLanguage(currentLang);

    document.getElementById('cookieAccept').addEventListener('click', e => {
      e.stopPropagation();
      setConsent({ analytics: true, marketing: true }, 'accept_all');
    });
    document.getElementById('cookieDecline').addEventListener('click', e => {
      e.stopPropagation();
      setConsent({ analytics: false, marketing: false }, 'reject_all');
    });
    document.getElementById('cookieSettingsBtn').addEventListener('click', e => {
      e.stopPropagation();
      openConsentSettings();
    });
    document.getElementById('cookieSave').addEventListener('click', e => {
      e.stopPropagation();
      setConsent({
        analytics: document.getElementById('consentAnalytics').checked,
        marketing: document.getElementById('consentMarketing').checked,
      }, 'custom');
    });
  }

  if (openSettings) openConsentSettings();
  else if (autoAccept) enableAutoAccept(banner);
  requestAnimationFrame(() => setTimeout(() => banner.classList.add('visible'), 50));
}

function openConsentSettings() {
  const current = getStoredConsent() || { analytics: false, marketing: false };
  document.getElementById('consentAnalytics').checked = current.analytics;
  document.getElementById('consentMarketing').checked = current.marketing;
  document.getElementById('cookieSettings').hidden = false;
  document.getElementById('cookieSave').hidden = false;
  document.getElementById('cookieSettingsBtn').hidden = true;
  document.getElementById('cookieBanner').classList.add('cookie-banner--settings');
  /* The visitor is choosing actively — stop treating scroll/click as "accept" */
  if (consentAutoAcceptOff) consentAutoAcceptOff();
}

/* Continuing to browse counts as "accept all" (click outside the banner or scroll > 200px) */
function enableAutoAccept(banner) {
  if (consentAutoAcceptOff) return;
  const onClick = e => {
    if (!banner.contains(e.target)) setConsent({ analytics: true, marketing: true }, 'auto_accept');
  };
  const onScroll = () => {
    if (window.scrollY > 200) setConsent({ analytics: true, marketing: true }, 'auto_accept');
  };
  const timer = setTimeout(() => document.addEventListener('click', onClick), 1000);
  window.addEventListener('scroll', onScroll, { passive: true });
  consentAutoAcceptOff = () => {
    clearTimeout(timer);
    document.removeEventListener('click', onClick);
    window.removeEventListener('scroll', onScroll);
    consentAutoAcceptOff = null;
  };
}

/* Footer "Cookie settings" link */
function openCookieSettings() {
  showCookieBanner({ openSettings: true });
}

function initCookieConsent() {
  if (getStoredConsent()) return; /* already applied in <head> before GTM loaded */
  setTimeout(() => showCookieBanner(), 600);
}

function setConsent(choice, action) {
  const consent = { analytics: !!choice.analytics, marketing: !!choice.marketing, ts: new Date().toISOString() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    localStorage.removeItem('kirovads_cookie_consent');
  } catch (e) { /* storage blocked — choice applies to this page only */ }
  if (consentAutoAcceptOff) consentAutoAcceptOff();
  updateGTMConsent(consent);
  hideCookieBanner();
  window.dataLayer.push({
    event: 'cookie_consent',
    consent_action: action,
    consent_analytics: consent.analytics ? 'granted' : 'denied',
    consent_marketing: consent.marketing ? 'granted' : 'denied',
  });
}

function updateGTMConsent(consent) {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  const a = consent.analytics ? 'granted' : 'denied';
  const m = consent.marketing ? 'granted' : 'denied';
  gtag('consent', 'update', {
    analytics_storage: a,
    ad_storage: m,
    ad_user_data: m,
    ad_personalization: m,
  });
}

function hideCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  banner.classList.remove('visible');
  setTimeout(() => banner.remove(), 500);
}

/* Inject nav, footer, latest posts section */
function initComponents(activePage, options = {}) {
  const navEl = document.getElementById('nav-placeholder');
  if (navEl) navEl.innerHTML = getNavHTML(activePage);

  const footerEl = document.getElementById('footer-placeholder');
  if (footerEl) footerEl.innerHTML = getFooterHTML();

  const blogEl = document.getElementById('blog-section-placeholder');
  if (blogEl) {
    blogEl.innerHTML = getLatestPostsSection(options.darkBlog || false);
  }

  /* Set footer year */
  const fy = document.getElementById('footerYear');
  if (fy) fy.textContent = new Date().getFullYear();

  /* Nav scroll effect */
  const nav = document.getElementById('mainNav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Cookie consent banner */
  initCookieConsent();
}

function openMobileNav() {
  document.getElementById('mobileNav').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
  document.body.style.overflow = '';
}

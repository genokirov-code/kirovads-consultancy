/* =============================================
   KIROVADS.COM — Shared Components
   Nav, Footer, Latest Blog Posts
   ============================================= */

/* Detect root path relative to current page */
function getRootPath() {
  const path = window.location.pathname;
  if (path.includes('/blog/posts/')) return '../../';
  if (path.includes('/blog/')) return '../';
  return '';
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
    <a href="${p.href}" class="nav__link${activePage === p.id ? ' active' : ''}"
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
               data-en="Book Free Audit" data-bg="Безплатен одит"
               onclick="gtmEvent('cta_click',{location:'nav',label:'Book Free Audit'})">Book Free Audit</a>
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
         data-en="Book Free Audit" data-bg="Безплатен одит">Book Free Audit</a>
    </div>
  `;
}

function getFooterHTML() {
  const r = getRootPath();
  return `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <a href="${r}index.html" class="footer__logo">KIROV<span>ADS</span></a>
            <p class="footer__tagline"
               data-en="Stop burning ad budget. Start growing with data-driven strategies, precision tracking, and AI-powered marketing."
               data-bg="Спри да губиш рекламен бюджет. Расти с базирани на данни стратегии, прецизно проследяване и маркетинг с AI.">
              Stop burning ad budget. Start growing with data-driven strategies, precision tracking, and AI-powered marketing.
            </p>
            <div class="footer__social">
              <a href="https://www.linkedin.com/in/geno-kirov/" target="_blank" rel="noopener noreferrer"
                 class="footer__social-link" aria-label="LinkedIn" title="LinkedIn">in</a>
            </div>
          </div>

          <div>
            <h4 class="footer__heading" data-en="Services" data-bg="Услуги">Services</h4>
            <ul class="footer__links">
              <li><a href="${r}services.html#meta-ads" class="footer__link" data-en="Meta Ads Management" data-bg="Управление на Meta реклами">Meta Ads Management</a></li>
              <li><a href="${r}services.html#google-ads" class="footer__link" data-en="Google Ads Management" data-bg="Управление на Google реклами">Google Ads Management</a></li>
              <li><a href="${r}services.html#tracking" class="footer__link" data-en="Tracking &amp; Analytics" data-bg="Проследяване и анализ">Tracking &amp; Analytics</a></li>
              <li><a href="${r}services.html#ai" class="footer__link" data-en="AI Marketing" data-bg="AI маркетинг">AI Marketing</a></li>
              <li><a href="${r}services.html#strategy" class="footer__link" data-en="Marketing Strategy" data-bg="Маркетингова стратегия">Marketing Strategy</a></li>
              <li><a href="${r}services.html#audit" class="footer__link" data-en="Marketing Audit" data-bg="Маркетингов одит">Marketing Audit</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer__heading" data-en="Company" data-bg="Компания">Company</h4>
            <ul class="footer__links">
              <li><a href="${r}about.html" class="footer__link" data-en="About Geno" data-bg="За Гено">About Geno</a></li>
              <li><a href="${r}blog/index.html" class="footer__link" data-en="Blog" data-bg="Блог">Blog</a></li>
              <li><a href="${r}contact.html" class="footer__link" data-en="Contact" data-bg="Контакт">Contact</a></li>
              <li><a href="${r}contact.html" class="footer__link" data-en="Free Audit" data-bg="Безплатен одит">Free Audit</a></li>
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
            <div class="footer__contact-item">
              <span>📍</span>
              <span data-en="Sofia, Bulgaria" data-bg="София, България">Sofia, Bulgaria</span>
            </div>
            <div class="footer__contact-item" style="margin-top:1rem">
              <a href="${r}contact.html" class="btn btn-primary btn-sm" style="width:100%;justify-content:center"
                 data-en="Book Free Audit" data-bg="Безплатен одит"
                 onclick="gtmEvent('cta_click',{location:'footer',label:'Book Free Audit'})">Book Free Audit</a>
            </div>
          </div>
        </div>

        <div class="footer__bottom">
          <p class="footer__copy">
            © <span id="footerYear"></span> KirovAds.
            <span data-en="All rights reserved." data-bg="Всички права запазени.">All rights reserved.</span>
          </p>
          <div class="footer__legal">
            <a href="${r}privacy.html" class="footer__legal-link" data-en="Privacy Policy" data-bg="Политика за поверителност">Privacy Policy</a>
            <a href="${r}terms.html" class="footer__legal-link" data-en="Terms of Service" data-bg="Условия за ползване">Terms of Service</a>
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
               data-en="Latest Insights" data-bg="Последни статии">Latest Insights</div>
          <h2 data-en="From the Blog" data-bg="От блога">From the Blog</h2>
          <p data-en="Practical marketing knowledge, tracking guides, and growth strategies."
             data-bg="Практически маркетингови знания, ръководства за проследяване и стратегии за растеж.">
            Practical marketing knowledge, tracking guides, and growth strategies.
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
             data-en="View All Articles" data-bg="Виж всички статии"
             onclick="gtmEvent('cta_click',{location:'blog_section',label:'View All Articles'})">
            View All Articles →
          </a>
        </div>
      </div>
    </section>
  `;
}

/* === COOKIE CONSENT BANNER === */
function getCookieBannerHTML() {
  const r = getRootPath();
  return `
    <div class="cookie-banner" id="cookieBanner" role="dialog" aria-label="Cookie consent">
      <div class="cookie-banner__inner">
        <p class="cookie-banner__text"
           data-en="We use cookies and analytics to improve your experience. By continuing to browse, you accept our <a href='${r}privacy.html'>Privacy Policy</a>."
           data-bg="Използваме бисквитки и анализи за подобряване на изживяването. Продължавайки да разглеждате, приемате нашата <a href='${r}privacy.html'>Политика за поверителност</a>.">
          We use cookies and analytics to improve your experience. By continuing to browse, you accept our <a href="${r}privacy.html">Privacy Policy</a>.
        </p>
        <div class="cookie-banner__actions">
          <button class="cookie-banner__btn cookie-banner__btn--decline" id="cookieDecline"
                  data-en="Decline" data-bg="Откажи">Decline</button>
          <button class="cookie-banner__btn cookie-banner__btn--accept" id="cookieAccept"
                  data-en="Accept All" data-bg="Приеми всички">Accept All</button>
        </div>
      </div>
    </div>
  `;
}

function initCookieConsent() {
  const consent = localStorage.getItem('kirovads_cookie_consent');

  /* If already decided, apply and skip banner */
  if (consent === 'granted') { updateGTMConsent('granted'); return; }
  if (consent === 'denied')  { updateGTMConsent('denied');  return; }

  /* Inject the banner */
  document.body.insertAdjacentHTML('beforeend', getCookieBannerHTML());
  const banner = document.getElementById('cookieBanner');

  /* Show with animation after short delay */
  setTimeout(() => banner.classList.add('visible'), 600);

  /* Apply language to banner elements */
  if (typeof applyLanguage === 'function') applyLanguage(currentLang);

  /* Accept button */
  document.getElementById('cookieAccept').addEventListener('click', (e) => {
    e.stopPropagation();
    setCookieConsent('granted');
  });

  /* Decline button */
  document.getElementById('cookieDecline').addEventListener('click', (e) => {
    e.stopPropagation();
    setCookieConsent('denied');
  });

  /* Auto-accept: if user clicks anywhere outside the banner */
  function autoAcceptHandler(e) {
    if (banner.contains(e.target)) return;
    setCookieConsent('granted');
    document.removeEventListener('click', autoAcceptHandler);
  }
  /* Delay attaching so the banner appear-click doesn't trigger it */
  setTimeout(() => {
    document.addEventListener('click', autoAcceptHandler);
  }, 1000);

  /* Auto-accept on scroll (user is browsing) */
  let scrollAccepted = false;
  function scrollAcceptHandler() {
    if (scrollAccepted) return;
    if (window.scrollY > 200) {
      scrollAccepted = true;
      setCookieConsent('granted');
      window.removeEventListener('scroll', scrollAcceptHandler);
    }
  }
  window.addEventListener('scroll', scrollAcceptHandler, { passive: true });
}

function setCookieConsent(value) {
  localStorage.setItem('kirovads_cookie_consent', value);
  updateGTMConsent(value);
  hideCookieBanner();
  if (typeof gtmEvent === 'function') {
    gtmEvent('cookie_consent', { consent_action: value });
  }
}

function updateGTMConsent(value) {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  if (value === 'granted') {
    gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted'
    });
  } else {
    gtag('consent', 'update', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied'
    });
  }
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

/* Shared chrome + behaviour for every page */
(function () {
  const { nav, email } = window.WB;
  const page = document.body.dataset.page || '';

  const arrow = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12.6667L12.6667 4M12.6667 4V12.32M12.6667 4H4.34667" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const smallArrow = `<svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true"><path d="m1 9.66667 8.66667-8.66667m0 0v8.32m0-8.32h-8.32" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3"/></svg>`;
  const bone = (w = 23, h = 21) => `<svg width="${w}" height="${h}" viewBox="0 0 24 22" fill="none" aria-hidden="true"><path d="M3.4 4.2C6.6 4.6 8.6 7.6 9.8 11.6 10.6 14.2 11.4 16.4 12 18.6 12.6 16.4 13.4 14.2 14.2 11.6 15.4 7.6 17.4 4.6 20.6 4.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="3.2" cy="4.1" r="1.9" fill="currentColor"/><circle cx="20.8" cy="4.1" r="1.9" fill="currentColor"/></svg>`;
  window.WB.icons = { arrow, smallArrow, bone };

  const logo = `<a class="brand" href="index.html" aria-label="Wishbone home">${bone()}<span>Wishbone</span></a>`;

  const navLinks = () => nav.map(i =>
    `<li><a href="${i.href}"${page === i.href.replace('.html', '') ? ' aria-current="page"' : ''}>${i.label}</a></li>`
  ).join('');

  /* ---------- header ---------- */
  const headerHost = document.getElementById('site-header');
  if (headerHost) {
    headerHost.outerHTML = `
    <a class="skip-link" href="#content">Skip to content</a>
    <header class="site-header" id="site-header">
      <div class="container">
        ${logo}
        <nav class="nav" aria-label="Primary"><ul style="display:flex;gap:28px;align-items:center">${navLinks()}</ul></nav>
        <a class="btn header-cta" href="contact.html">Get in touch ${arrow}</a>
        <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
          <span></span><span></span>
        </button>
      </div>
    </header>
    <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
      <nav aria-label="Mobile"><ul>${navLinks()}<li><a href="contact.html">Get in touch</a></li></ul></nav>
    </div>`;
  }

  /* ---------- closing cta + footer + sticky bar + cookie ---------- */
  const footerHost = document.getElementById('site-footer');
  if (footerHost) {
    footerHost.outerHTML = `
    <section class="closing container reveal">
      <h2 class="h2">Let’s talk about your run.</h2>
      <p>Tell us about the brand and what you’d want on the slip.</p>
      <a class="btn btn--lg" href="contact.html">Get in touch ${arrow}</a>
    </section>
    <footer class="site-footer" id="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <h2>Get in touch</h2>
            <a class="footer-mail" href="mailto:${email}">${email}</a>
            <h2 style="margin-top:32px">Socials</h2>
            <ul><li><a href="#">LinkedIn</a></li><li><a href="#">Instagram</a></li></ul>
          </div>
          <div><h2>The product</h2><ul>${navLinks()}</ul></div>
          <div><h2>Pages</h2><ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="contact.html">Get in touch</a></li>
          </ul></div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Wishbone</span>
          <ul>
            <li><a href="mailto:${email}">${email}</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Privacy</a></li>
          </ul>
        </div>
      </div>
    </footer>

    <aside class="sticky-cta" id="sticky-cta" aria-live="polite">
      <button class="sticky-close" type="button" aria-label="Dismiss">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-linecap="round"/></svg>
      </button>
      <h3>Curious how it works?</h3>
      <p>Let’s talk it through.</p>
      <span class="spacer"></span>
      <a class="btn" href="contact.html">Get in touch ${arrow}</a>
    </aside>

    <div class="cookie" id="cookie">
      <p>We use a small number of cookies to understand how this site is used. Nothing is sold on, and you can change your mind at any time.</p>
      <div class="cookie__actions">
        <button class="btn btn--ember" type="button" data-cookie="accept">Accept</button>
        <button class="btn btn--dark" type="button" data-cookie="reject">Reject</button>
        <button class="link" type="button" data-cookie="prefs">Preferences</button>
      </div>
    </div>

    <div class="modal" id="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
      <div class="modal__scrim" data-close></div>
      <div class="modal__panel">
        <button class="modal__close" type="button" data-close aria-label="Close preferences">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-linecap="round"/></svg>
        </button>
        <h2 id="cookie-modal-title">You control your data</h2>
        <p>Choose which cookies this site is allowed to set.</p>
        ${[
          ['Required', 'Needed for the site to work at all — sending the contact form, remembering this choice.', true, true],
          ['Analytics', 'Helps us see which pages people actually read, so we can fix the ones they do not.', false, false],
          ['Marketing', 'Lets us measure whether an ad we ran brought you here.', false, false]
        ].map(([t, d, checked, locked]) => `
          <div class="pref">
            <div class="pref__body"><h3>${t}</h3><p>${d}</p></div>
            <label class="switch"><input type="checkbox" ${checked ? 'checked' : ''} ${locked ? 'disabled' : ''} aria-label="${t} cookies"><i></i></label>
          </div>`).join('')}
        <div class="modal__actions">
          <button class="btn btn--ember" type="button" data-cookie="accept">Accept all</button>
          <button class="btn btn--dark" type="button" data-cookie="reject">Decline all</button>
          <button class="btn btn--outline" style="color:var(--ink);border-color:#B9D6C3" type="button" data-cookie="save">Save my choices</button>
        </div>
      </div>
    </div>`;
  }

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.lenis = lenis;
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* ---------- header state + sticky bar ---------- */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-stuck', y > 40);
    const cta = document.getElementById('sticky-cta');
    if (cta && !cta.classList.contains('is-dismissed')) {
      const past = y > (page === 'home' ? window.innerHeight * 0.9 : 420);
      const nearEnd = y + window.innerHeight > document.body.scrollHeight - 260;
      /* Both of these live at the bottom of the screen, so they stack on top
         of each other on a phone. Consent gets the space until it is answered. */
      const consentUp = document.getElementById('cookie').classList.contains('is-visible');
      cta.classList.toggle('is-visible', past && !nearEnd && !consentUp);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('mobile-menu');
  toggle && toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    if (lenis) open ? lenis.stop() : lenis.start();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.body.classList.contains('menu-open')) toggle.click();
    const m = document.getElementById('cookie-modal');
    if (m && m.classList.contains('is-open')) m.classList.remove('is-open');
  });

  /* ---------- sticky cta dismiss ---------- */
  const cta = document.getElementById('sticky-cta');
  cta && cta.querySelector('.sticky-close').addEventListener('click', () => {
    cta.classList.add('is-dismissed');
    cta.classList.remove('is-visible');
  });

  /* ---------- cookie consent ---------- */
  const cookie = document.getElementById('cookie');
  const modal = document.getElementById('cookie-modal');
  const KEY = 'wb-cookie-consent';
  if (cookie && !localStorage.getItem(KEY)) setTimeout(() => cookie.classList.add('is-visible'), 900);
  const settle = value => {
    localStorage.setItem(KEY, value);
    cookie.classList.remove('is-visible');
    modal.classList.remove('is-open');
    onScroll();                 // the bottom is free again
  };
  document.addEventListener('click', e => {
    const action = e.target.closest('[data-cookie]');
    if (action) {
      const kind = action.dataset.cookie;
      if (kind === 'prefs') { modal.classList.add('is-open'); return; }
      if (kind === 'accept') return settle('all');
      if (kind === 'reject') return settle('none');
      if (kind === 'save') return settle([...modal.querySelectorAll('.pref input')].map(i => i.checked ? '1' : '0').join(''));
    }
    if (e.target.closest('[data-close]')) modal.classList.remove('is-open');
  });

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  window.WB.observeReveal = el => io.observe(el);
})();

/* Shared chrome + behaviour for every page */
(function () {
  const page = document.body.dataset.page || '';

  /* Header, footer, nav, consent bar and every card are written into the HTML
     by build.js. This file only enhances what is already on the page, so a
     visitor whose JS fails still gets a navigable, readable site. */
  const smallArrow = `<svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true"><path d="m1 9.66667 8.66667-8.66667m0 0v8.32m0-8.32h-8.32" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3"/></svg>`;
  window.WB.icons = { smallArrow };


  /* ---------- the fortune moment ----------
     Landing page only, at the point the sticky CTA would otherwise fire.

     The landing page always starts green so the crack always has something to
     do — arriving already warm would leave the cookie with nothing to change.
     Every other page inherits whichever palette the visitor left the landing
     page on, so clicking through does not throw the change away. Session
     scoped, so a fresh visit starts green again. */
  const THEME_KEY = 'wb-theme';
  const moment    = document.getElementById('moment');

  const applyTheme = (name, animate) => {
    if (animate) {
      document.documentElement.classList.add('theme-shifting');
      setTimeout(() => document.documentElement.classList.remove('theme-shifting'), 1000);
    }
    if (name === 'warm') document.documentElement.setAttribute('data-theme', 'warm');
    else document.documentElement.removeAttribute('data-theme');
    try { sessionStorage.setItem(THEME_KEY, name); } catch (e) {}
  };

  if (page === 'home') {
    applyTheme('dark', false);              /* the crack needs somewhere to go */
  } else {
    let carried = 'dark';
    try { carried = sessionStorage.getItem(THEME_KEY) || 'dark'; } catch (e) {}
    if (carried === 'warm') applyTheme('warm', false);
  }

  document.addEventListener('click', e => {
    if (e.target.closest('[data-theme-back]')) applyTheme('dark', true);
  });

  if (moment) {
    const cookie = document.getElementById('moment-cookie');
    const film   = document.getElementById('moment-film');
    const video  = document.getElementById('moment-video');
    let shown = false, opened = false;

    /* The film only joins the layout once it has decoded a frame, so a missing
       or broken file leaves one centred column rather than a black rectangle.
       Same rule the hero cracker already plays by. */
    if (video) {
      video.addEventListener('loadeddata', () => {
        moment.classList.add('has-film');
        void film.offsetHeight;      /* in case the cookie was already cracked */
      }, { once: true });
    }

    const closeMoment = () => {
      moment.classList.remove('is-in');
      setTimeout(() => { moment.hidden = true; }, 500);
      if (video) video.pause();          /* nothing decoding behind a hidden overlay */
      if (lenis) lenis.start();
      onScroll();                                  // let the sticky CTA back in
    };

    const showMoment = () => {
      if (shown) return;                 /* once per load, not once per visitor */
      shown = true;
      moment.hidden = false;
      void moment.offsetHeight;          /* force a reflow so the transition runs */
      moment.classList.add('is-in');
      /* Buffer while the cookie waits to be tapped. The markup says
         preload="none", so a visit that never reaches the moment never asks
         for the file at all. */
      if (video) { video.preload = 'auto'; video.load(); }
      if (lenis) lenis.stop();
      cookie.focus({ preventScroll: true });
    };

    const crack = () => {
      if (opened) return;
      opened = true;
      moment.classList.add('is-open');
      /* Muted and inline, so this is allowed without a gesture — and it has
         one anyway. Reduced motion keeps the poster frame instead. */
      if (video && !reduced) video.play().catch(() => {});
      setTimeout(() => applyTheme('warm', true), 620);   // after the halves part
      setTimeout(closeMoment, 4200);                     // then hand the page back
    };

    cookie.addEventListener('click', crack);
    document.addEventListener('click', e => {
      if (e.target.closest('[data-moment-close]')) closeMoment();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && moment.classList.contains('is-in')) closeMoment();
    });

    window.WB.showMoment = showMoment;               // so onScroll can fire it
    window.WB.momentPending = true;

    /* an earlier build kept these in localStorage; the palette is session
       scoped now, so clear the old keys rather than leave dead data behind. */
    try {
      localStorage.removeItem('wb-theme');
      localStorage.removeItem('wb-moment-seen');
    } catch (e) {}
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
      const momentUp  = document.getElementById('moment')?.classList.contains('is-in');
      cta.classList.toggle('is-visible', past && !nearEnd && !consentUp && !momentUp);

      /* The moment takes the same cue the CTA does — but only once, and only
         after consent has been dealt with, so the screen is never contested. */
      if (past && !consentUp && window.WB.momentPending && window.WB.showMoment) {
        window.WB.momentPending = false;
        window.WB.showMoment();
      }
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

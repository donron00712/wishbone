/* Homepage: pinned hero sequence, why-it-works, formats */
(function () {
  const { wishes, sampleFortunes, photos, icons } = window.WB;

  /* The wishbone mark, used as the separator between fortunes in the marquee.
     Lives here because this is the only place that still draws one. */
  const bone = (w, h) => `<svg width="${w}" height="${h}" viewBox="0 0 24 22" fill="none" aria-hidden="true"><path d="M3.4 4.2C6.6 4.6 8.6 7.6 9.8 11.6 10.6 14.2 11.4 16.4 12 18.6 12.6 16.4 13.4 14.2 14.2 11.6 15.4 7.6 17.4 4.6 20.6 4.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="3.2" cy="4.1" r="1.9" fill="currentColor"/><circle cx="20.8" cy="4.1" r="1.9" fill="currentColor"/></svg>`;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* No scroll animation available, either because the visitor asked for less
     motion or because GSAP did not load. The hero then lays its two stages out
     down the page instead of stacking them in the same absolute space. */
  const staticHero = reduced || !window.gsap;
  if (staticHero) document.querySelector('.home-hero').classList.add('is-static');

  /* A decorative QR block. Deterministic from the brand name so each slip keeps
     the same pattern between renders. It is illustrative and does not scan.

     The modules are emitted as ONE path rather than ~120 <rect> elements. At
     eighteen QRs on the page that is the difference between ~2,100 DOM nodes
     and eighteen, and it is the single largest thing on this page. */
  const qrSvg = (seed, px) => {
    let h = 2166136261;
    for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
    const rnd = () => (h = (Math.imul(h, 1664525) + 1013904223) >>> 0) / 4294967296;
    const N = 21;
    const inFinder = (x, y) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
    let d = '';
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (inFinder(x, y)) continue;
        if (rnd() > 0.52) d += `M${x} ${y}h1v1h-1z`;
      }
    }
    const finder = (fx, fy) =>
      `<rect x="${fx + 0.5}" y="${fy + 0.5}" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1"/>` +
      `<rect x="${fx + 2}" y="${fy + 2}" width="3" height="3"/>`;
    return `<svg class="qr" width="${px}" height="${px}" viewBox="0 0 21 21" fill="currentColor" aria-hidden="true">` +
      `<path d="${d}"/>` + finder(0, 0) + finder(14, 0) + finder(0, 14) + `</svg>`;
  };

  /* ---------- 1. split the headline into animatable characters ----------
     Only when it is going to be animated: leaving the plain text alone keeps
     the headline readable if anything downstream fails. */
  const title = document.querySelector('.hero-title');
  if (!staticHero) {
    title.innerHTML = title.textContent.trim().split(/\s+/).map(w =>
      `<span class="word">${[...w].map(c => `<span class="char">${c}</span>`).join('')}</span>`
    ).join(' ');
  }

  /* ---------- 2. marquee of wishes ---------- */
  const run = wishes.map(w =>
    `<span class="slip">${w}</span><span class="sep">${bone(15, 14)}</span>`
  ).join('');
  document.querySelector('.marquee__track').innerHTML = run + run;

  /* ---------- 3. the drifting wall of brands behind stage two ---------- */
  const wrapper = document.querySelector('.grid-wrapper');
  const perRow = 8;

  /* Three rows stand 478px tall on a phone — 57% of the viewport, leaving a
     band of dead ground above and below a wall that is supposed to read as
     endless. Five rows carry it past the edge instead. Desktop already
     overflows at three (948px against an 820 viewport) so it keeps them, and
     the tiles stay the size they are: filling the height by growing them
     instead would put a single 272px tile across most of a phone screen. */
  const rowCount = window.matchMedia('(max-width:767px)').matches ? 5 : 3;

  /* More rows than there are fortunes to fill them, so rows past the end of
     the list wrap back to the start rather than coming out empty. */
  const rowSlips = r => Array.from({ length: perRow },
    (_, i) => sampleFortunes[(r * perRow + i) % sampleFortunes.length]);

  /* A photograph of a real cookie, sitting in the wall as one more tile.
     Only used if data.js has any — see the note there about what may go in. */
  const photoTile = p => `
      <div class="tile tile--photo">
        <img src="${p.src}" alt="${p.alt}" loading="lazy" decoding="async">
        ${p.credit ? `<span class="tile__credit">${p.credit}</span>` : ''}
      </div>`;

  wrapper.innerHTML = Array.from({ length: rowCount }, (_, r) => {
    const slips = rowSlips(r).map(f => `
      <div class="tile">
        <div class="paper paper--fortune">
          <p>${f.line}</p>
          <span class="paper__nums">${f.nums}</span>
        </div>
        <div class="paper paper--ad" style="--ad-bg:${f.bg};--ad-fg:${f.fg}">
          ${f.qr ? qrSvg(f.brand, 26) : ''}
          <span class="paper__tag">${f.tag}</span>
          <span class="paper__id">
            <b>${f.brand}</b>
            <em>${f.url}</em>
          </span>
        </div>
      </div>`);

    /* Pictures are dealt round-robin across the three rows and folded in at
       spaced positions, so the wall reads as a mix rather than a block of
       slips followed by a block of pictures — and so every picture in data.js
       is actually reached. Taking photos[r] only ever showed the first three,
       however many were listed. */
    photos.filter((_, i) => i % rowCount === r).forEach((pic, k) => {
      slips.splice(Math.min(2 + k * 3, slips.length), 0, photoTile(pic));
    });

    const tiles = slips.join('');
    return `<div class="grid-row" data-row="${r}">${tiles + tiles}</div>`;
  }).join('');

  /* ---------- 3b. the unit ----------
     The slip and nothing else. Same data as the wall, so the thing being
     explained and the thing filling the hero are one product. */
  const spec = document.querySelector('.spec[data-slip]');
  if (spec) {
    const f = sampleFortunes.find(x => x.brand === spec.dataset.slip) || sampleFortunes[0];
    spec.innerHTML = `
      <div class="paper paper--fortune">
        <p>${f.line}</p>
        <span class="paper__nums">${f.nums}</span>
      </div>
      <div class="paper paper--ad" style="--ad-bg:${f.bg};--ad-fg:${f.fg}">
        ${f.qr ? qrSvg(f.brand, 26) : ''}
        <span class="paper__tag">${f.tag}</span>
        <span class="paper__id"><b>${f.brand}</b><em>${f.url}</em></span>
      </div>`;
  }

  /* Reason, format and target cards are in the HTML — build.js writes them. */

  document.querySelectorAll('.reveal').forEach(el => window.WB.observeReveal(el));

  /* Hold the cookie animation until it is actually on screen, so it is not
     looping unseen above the fold or burning cycles off-screen. */
  const cracker = document.getElementById('cracker');
  if (cracker) {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { cracker.classList.add('is-in'); obs.disconnect(); }
      });
    }, { threshold: 0.35 }).observe(cracker);

    /* Drop-in slot for real footage. Set data-media on .cracker to the file
       stem, e.g. data-media="assets/media/cookie", and this swaps the drawn
       cookie for <video>, looking for .webm then .mp4 with .jpg as poster.
       Left empty there is no request and no console noise. */
    const media = cracker.dataset.media;
    if (media && !reduced) {
      const v = document.createElement('video');
      v.className = 'cracker__video';
      v.autoplay = v.loop = v.muted = v.playsInline = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.preload = 'metadata';
      v.poster = `${media}.jpg`;
      v.innerHTML = `<source src="${media}.webm" type="video/webm">` +
                    `<source src="${media}.mp4" type="video/mp4">`;
      /* Only take over once it can actually play, so a missing or broken file
         leaves the drawn cookie on screen rather than an empty box. */
      v.addEventListener('loadeddata', () => {
        cracker.replaceChildren(v);
        cracker.classList.add('has-video');
      }, { once: true });
    }
  }

  /* ---------- 6. hero motion ---------- */
  const chars = title.querySelectorAll('.char');
  const titleWrap = document.querySelector('.hero-title-wrap');
  const marquee = document.querySelector('.marquee');
  const heroGrid = document.querySelector('.hero-grid');
  const gridCopy = document.querySelector('.hero-grid__copy');
  const keep = document.querySelector('.keep-scrolling');
  const frames = document.querySelectorAll('.hero-frame');
  const rows = document.querySelectorAll('.grid-row');

  if (staticHero) return;

  gsap.registerPlugin(ScrollTrigger);

  /* intro */
  const intro = gsap.timeline({ delay: 0.25 })
    .fromTo(frames, { opacity: 0, scale: 0.82 },
      { opacity: 1, scale: 1, duration: 1.6, ease: 'expo.out', stagger: 0.12 })
    .fromTo(chars, { opacity: 0, yPercent: 55, rotateX: -92 },
      { opacity: 1, yPercent: 0, rotateX: 0, duration: 1.1, ease: 'expo.out', stagger: 0.018 }, 0.15)
    .fromTo('.hero-sub, .hero-actions', { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, '-=0.55')
    .fromTo(marquee, { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, '-=0.7');

  /* Scrolling during the intro finishes it on the spot. Both timelines drive
     the marquee and the title: the intro is animating them in on a clock while
     the scrubbed timeline is taking them out on scroll position, and the intro
     wins the tick because it renders later. The visible symptom is the marquee
     flickering back over the wall for as long as the intro has left to run.
     Scrolling is a clear enough signal that the visitor is past the intro. */
  window.addEventListener('scroll', () => {
    if (intro.isActive()) intro.progress(1);
  }, { once: true, passive: true });

  /* scrubbed handover from stage one to stage two */
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom bottom', scrub: 0.6 }
  });

  /* immediateRender:false matters here. These tweens sit at position 0 of a
     scrubbed timeline, so GSAP would otherwise capture their start values the
     moment the timeline is built — mid-intro — and pin the frames and marquee
     at whatever partial scale/opacity the intro happened to be at. */
  tl.to(titleWrap, { scale: 0.88, yPercent: -8, opacity: 0, ease: 'none', duration: 0.3 }, 0)
    /* fromTo, not to. A bare .to() captures its start value the first time it
       renders, and with immediateRender:false that can happen mid-intro while
       the marquee is still faded out — it then animates 0 to 0, hides nothing,
       and the intro leaves the marquee sitting at opacity 1 over the wall for
       the rest of the page. Naming the start explicitly makes the tween mean
       the same thing whenever it first renders. Gone by 0.16, before the wall
       is set visible at 0.18, because the marquee is z-index 6 against the
       wall's 2 and any overlap lays scrolling text across the tiles. */
    .fromTo(marquee, { opacity: 1, y: 0 },
      { opacity: 0, y: 40, ease: 'none', duration: 0.16,
        immediateRender: false, overwrite: 'auto' }, 0)
    .to(frames[0], { scale: 1.5, opacity: 0, ease: 'none', duration: 0.35, immediateRender: false }, 0)
    .to(frames[1], { scale: 1.28, opacity: 0.35, ease: 'none', duration: 0.35, immediateRender: false }, 0)

    .set(heroGrid, { visibility: 'visible' }, 0.18)
    .fromTo(heroGrid, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.18 }, 0.2)
    .fromTo(wrapper, { scale: 1.45 }, { scale: 1, ease: 'none', duration: 0.5 }, 0.18)


    .fromTo(gridCopy, { opacity: 0, y: 26 }, { opacity: 1, y: 0, ease: 'none', duration: 0.14 }, 0.42)
    .fromTo(keep, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.08 }, 0.44)
    .to(keep, { opacity: 0, ease: 'none', duration: 0.08 }, 0.82)
    .to(heroGrid, { opacity: 0, ease: 'none', duration: 0.12 }, 0.88)
    .to(gridCopy, { y: -30, ease: 'none', duration: 0.12 }, 0.88);

  /* Each row drifts its own way so the wall never reads as one sliding block.
     Cycled rather than written out per row, because a phone builds five rows
     and a desktop three. Every tween is positioned absolutely at 0.18, so
     adding them after the chain puts them exactly where the chain did. */
  const drift = [[-14, 4], [6, -12], [-9, 7], [11, -5], [-6, 10]];
  rows.forEach((row, i) => {
    const [from, to] = drift[i % drift.length];
    tl.fromTo(row, { xPercent: from },
      { xPercent: to, ease: 'none', duration: 0.82 }, 0.18);
  });

  /* dev helper: index.html?stage=0..1 jumps to a point in the hero sequence */
  const stage = new URLSearchParams(location.search).get('stage');
  if (stage !== null) {
    setTimeout(() => {
      const st = tl.scrollTrigger;
      const y = st.start + (st.end - st.start) * parseFloat(stage);
      if (window.lenis) window.lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    }, 400);
  }
})();

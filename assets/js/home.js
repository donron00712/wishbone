/* Homepage: pinned hero sequence, why-it-works, formats */
(function () {
  const { wishes, sampleFortunes, reasons, formats, targets, icons } = window.WB;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* No scroll animation available, either because the visitor asked for less
     motion or because GSAP did not load. The hero then lays its two stages out
     down the page instead of stacking them in the same absolute space. */
  const staticHero = reduced || !window.gsap;
  if (staticHero) document.querySelector('.home-hero').classList.add('is-static');

  /* A decorative QR block. Deterministic from the brand name so each slip keeps
     the same pattern between renders. It is a mock-up and does not scan. */
  const qrSvg = (seed, px) => {
    let h = 2166136261;
    for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
    const rnd = () => (h = (Math.imul(h, 1664525) + 1013904223) >>> 0) / 4294967296;
    const N = 21, cells = [];
    const inFinder = (x, y) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (inFinder(x, y)) continue;
        if (rnd() > 0.52) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
      }
    }
    const finder = (fx, fy) =>
      `<rect x="${fx + 0.5}" y="${fy + 0.5}" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1"/>` +
      `<rect x="${fx + 2}" y="${fy + 2}" width="3" height="3"/>`;
    return `<svg class="qr" width="${px}" height="${px}" viewBox="0 0 21 21" fill="currentColor" aria-hidden="true">` +
      cells.join('') + finder(0, 0) + finder(14, 0) + finder(0, 14) + `</svg>`;
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
    `<span class="slip">${w}</span><span class="sep">${icons.bone(15, 14)}</span>`
  ).join('');
  document.querySelector('.marquee__track').innerHTML = run + run;

  /* ---------- 3. the drifting wall of brands behind stage two ---------- */
  const wrapper = document.querySelector('.grid-wrapper');
  const perRow = 8;
  wrapper.innerHTML = [0, 1, 2].map(r => {
    const tiles = sampleFortunes.slice(r * perRow, r * perRow + perRow).map(f => `
      <div class="tile">
        <span class="slip">${f.line}</span>
        <span class="tile__foot">
          ${f.qr ? qrSvg(f.brand, 30) : ''}
          <span class="tile__id">
            <b>${f.brand}</b>
            <em>${f.offer}</em>
          </span>
        </span>
      </div>`).join('');
    return `<div class="grid-row" data-row="${r}">${tiles + tiles}</div>`;
  }).join('');

  /* ---------- 4. why it works ---------- */
  document.getElementById('reasons').innerHTML = reasons.map(r => `
    <li class="reason reveal">
      <span class="reason__n">${r.n}</span>
      <h3>${r.title}</h3>
      <p>${r.body}</p>
    </li>`).join('');

  document.getElementById('targets').innerHTML = targets.map(t => `
    <div class="target"><div class="num">${t.num}</div><div class="label">${t.label}</div></div>`).join('');

  /* ---------- 5. the formats ---------- */
  document.getElementById('formats').innerHTML = formats.map(f => `
    <li>
      <a class="format" href="formats.html">
        <span class="format__bg"></span>
        <div>
          <div class="meta">${f.meta}</div>
          <h3>${f.title}</h3>
        </div>
        <div>
          <p>${f.body}</p>
          <span class="know">See the formats ${icons.smallArrow}</span>
        </div>
      </a>
    </li>`).join('');

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
  gsap.timeline({ delay: 0.25 })
    .fromTo(frames, { opacity: 0, scale: 0.82 },
      { opacity: 1, scale: 1, duration: 1.6, ease: 'expo.out', stagger: 0.12 })
    .fromTo(chars, { opacity: 0, yPercent: 55, rotateX: -92 },
      { opacity: 1, yPercent: 0, rotateX: 0, duration: 1.1, ease: 'expo.out', stagger: 0.018 }, 0.15)
    .fromTo('.hero-sub, .hero-actions', { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, '-=0.55')
    .fromTo(marquee, { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, '-=0.7');

  /* scrubbed handover from stage one to stage two */
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom bottom', scrub: 0.6 }
  });

  /* immediateRender:false matters here. These tweens sit at position 0 of a
     scrubbed timeline, so GSAP would otherwise capture their start values the
     moment the timeline is built — mid-intro — and pin the frames and marquee
     at whatever partial scale/opacity the intro happened to be at. */
  tl.to(titleWrap, { scale: 0.88, yPercent: -8, opacity: 0, ease: 'none', duration: 0.3 }, 0)
    .to(marquee,   { opacity: 0, y: 40, ease: 'none', duration: 0.22, immediateRender: false }, 0)
    .to(frames[0], { scale: 1.5, opacity: 0, ease: 'none', duration: 0.35, immediateRender: false }, 0)
    .to(frames[1], { scale: 1.28, opacity: 0.35, ease: 'none', duration: 0.35, immediateRender: false }, 0)

    .set(heroGrid, { visibility: 'visible' }, 0.18)
    .fromTo(heroGrid, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.18 }, 0.2)
    .fromTo(wrapper, { scale: 1.45 }, { scale: 1, ease: 'none', duration: 0.5 }, 0.18)

    .fromTo(rows[0], { xPercent: -14 }, { xPercent: 4,   ease: 'none', duration: 0.82 }, 0.18)
    .fromTo(rows[1], { xPercent: 6 },   { xPercent: -12, ease: 'none', duration: 0.82 }, 0.18)
    .fromTo(rows[2], { xPercent: -9 },  { xPercent: 7,   ease: 'none', duration: 0.82 }, 0.18)

    .fromTo(gridCopy, { opacity: 0, y: 26 }, { opacity: 1, y: 0, ease: 'none', duration: 0.14 }, 0.42)
    .fromTo(keep, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.08 }, 0.44)
    .to(keep, { opacity: 0, ease: 'none', duration: 0.08 }, 0.82)
    .to(heroGrid, { opacity: 0, ease: 'none', duration: 0.12 }, 0.88)
    .to(gridCopy, { y: -30, ease: 'none', duration: 0.12 }, 0.88);

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

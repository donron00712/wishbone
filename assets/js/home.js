/* Homepage: pinned hero sequence, why-it-works, formats */
(function () {
  const { wishes, sampleFortunes, reasons, formats, targets, icons } = window.WB;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* No scroll animation available, either because the visitor asked for less
     motion or because GSAP did not load. The hero then lays its two stages out
     down the page instead of stacking them in the same absolute space. */
  const staticHero = reduced || !window.gsap;
  if (staticHero) document.querySelector('.home-hero').classList.add('is-static');

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
        <span class="tile__brand">${f.brand} <i>·</i> ${f.offer}</span>
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

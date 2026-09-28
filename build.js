#!/usr/bin/env node
/**
 * Kismat Cookies build.
 *
 * The site used to assemble its own header, footer and every card in the
 * browser, which meant the shipped HTML was 145 words and a visitor with no
 * JS got no navigation at all. This script does that assembly at build time
 * instead, writing real markup into the pages between <!--#name--> markers.
 *
 * Content still lives in one place (assets/js/data.js), so nothing is
 * duplicated by hand. Run `npm run build` after editing data or partials.
 * No dependencies, no framework, output is plain static files.
 */
const fs = require('fs');
const path = require('path');

global.window = {};
require('./assets/js/data.js');
const D = global.window.WB;

/* Footage for the fortune moment, if data.js names one. Attribute values are
   escaped because alt and caption are prose someone will edit by hand. */
const film = D.momentFilm || {};
const esc = (v) => String(v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const arrow = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12.6667L12.6667 4M12.6667 4V12.32M12.6667 4H4.34667" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const smallArrow = `<svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true"><path d="m1 9.66667 8.66667-8.66667m0 0v8.32m0-8.32h-8.32" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3"/></svg>`;
const bone = (w = 23, h = 21) => `<svg width="${w}" height="${h}" viewBox="0 0 24 22" fill="none" aria-hidden="true"><path d="M3.4 4.2C6.6 4.6 8.6 7.6 9.8 11.6 10.6 14.2 11.4 16.4 12 18.6 12.6 16.4 13.4 14.2 14.2 11.6 15.4 7.6 17.4 4.6 20.6 4.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="3.2" cy="4.1" r="1.9" fill="currentColor"/><circle cx="20.8" cy="4.1" r="1.9" fill="currentColor"/></svg>`;


/* The wrapper, emitted wherever it is needed. `sfx` keeps the gradient and clip
   ids unique so two of them on one page cannot collide.

   A sealed sachet with crimped ends, torn across the middle. Two earlier passes
   tried to draw the cannoli itself and both failed the only test that matters —
   they looked like a cartoon of food rather than food. Drawing the wrapper
   instead sidesteps that entirely: a sachet is paper and geometry, which vector
   renders honestly, and the thing that is hard to draw stays inside it where
   nobody has to judge it.

   It is also truer to the product. A real run arrives wrapped, and the wrapper
   is a brand surface in its own right, which is why there is a printed band on
   it rather than blank paper.

   Both halves share one tear line traversed in opposite directions, so the
   ragged edges interlock instead of crossing — the same trick every version of
   this has used, and the reason the halves read as having been pulled apart
   rather than drawn apart. */
const TEAR_UP   = "L154 150 L146 141 L155 132 L145 123 L154 114 L146 105";
const TEAR_DOWN = "L146 105 L154 114 L145 123 L155 132 L146 141 L154 150 L150 158";

const WRAP_L = `M150 92 C122 87 92 88 66 93 L60 100 L48 96 L46 106 L34 102 L30 114 L26 125 L30 136 L34 148 L46 144 L48 154 L60 150 L66 157 C92 162 122 163 150 158 ${TEAR_UP} Z`;
const WRAP_R = `M150 92 ${TEAR_DOWN} C178 163 208 162 234 157 L240 150 L252 154 L254 144 L266 148 L270 136 L274 125 L270 114 L266 102 L254 106 L252 96 L240 100 L234 93 C208 88 178 87 150 92 Z`;

const wrapHalves = (sfx) => `
                <svg class="biscuit__half biscuit__half--l" viewBox="0 0 300 250" aria-hidden="true">
                  <defs>
                    <linearGradient id="wrapL${sfx}" x1="0" y1="0" x2="0.25" y2="1">
                      <stop offset="0" stop-color="#FBF4E6"/><stop offset="0.42" stop-color="#F0E4CB"/>
                      <stop offset="0.78" stop-color="#DFCDA9"/><stop offset="1" stop-color="#C6B085"/>
                    </linearGradient>
                    <clipPath id="clipL${sfx}"><path d="${WRAP_L}"/></clipPath>
                  </defs>
                  <path fill="url(#wrapL${sfx})" d="${WRAP_L}"/>
                  <g clip-path="url(#clipL${sfx})">
                    <!-- the printed band: the wrapper is a brand surface too -->
                    <rect x="20" y="112" width="132" height="15" fill="#C08A3A" fill-opacity=".85"/>
                    <rect x="20" y="112" width="132" height="3" fill="#8F6220" fill-opacity=".45"/>
                    <!-- the sheen of a folded sheet catching the light -->
                    <path fill="#FFFDF6" fill-opacity=".5" d="M66 90 C96 86 124 87 150 90 L150 101 C124 98 96 97 66 101 Z"/>
                    <!-- creases running out of the crimp -->
                    <g stroke="#B79B6C" stroke-opacity=".42" stroke-width="1.4" stroke-linecap="round">
                      <path d="M62 100 L74 110"/><path d="M60 126 L74 126"/><path d="M62 150 L74 140"/>
                    </g>
                    <!-- the sachet turning under -->
                    <path fill="#A98A56" fill-opacity=".22" d="M20 146 C70 156 110 158 152 154 L152 172 L20 172 Z"/>
                  </g>
                </svg>

                <svg class="biscuit__half biscuit__half--r" viewBox="0 0 300 250" aria-hidden="true">
                  <defs>
                    <linearGradient id="wrapR${sfx}" x1="0" y1="0" x2="0.25" y2="1">
                      <stop offset="0" stop-color="#F8F0DF"/><stop offset="0.42" stop-color="#EBDDC1"/>
                      <stop offset="0.78" stop-color="#D8C49C"/><stop offset="1" stop-color="#BCA477"/>
                    </linearGradient>
                    <clipPath id="clipR${sfx}"><path d="${WRAP_R}"/></clipPath>
                  </defs>
                  <path fill="url(#wrapR${sfx})" d="${WRAP_R}"/>
                  <g clip-path="url(#clipR${sfx})">
                    <rect x="148" y="112" width="132" height="15" fill="#B67F33" fill-opacity=".85"/>
                    <rect x="148" y="112" width="132" height="3" fill="#855A1C" fill-opacity=".45"/>
                    <path fill="#FFFDF6" fill-opacity=".44" d="M150 90 C176 87 204 86 234 90 L234 101 C204 97 176 98 150 101 Z"/>
                    <g stroke="#AC9063" stroke-opacity=".42" stroke-width="1.4" stroke-linecap="round">
                      <path d="M238 100 L226 110"/><path d="M240 126 L226 126"/><path d="M238 150 L226 140"/>
                    </g>
                    <path fill="#9E7F4C" fill-opacity=".22" d="M280 146 C230 156 190 158 148 154 L148 172 L280 172 Z"/>
                  </g>
                </svg>`;


/* Pages that still build and still answer on their URL, but are kept out of
   the navigation, out of the sitemap, and told not to be indexed. One list
   drives all three, so putting a page back is deleting a word from here
   rather than remembering three separate places. */
const HIDDEN = ['cases'];
const isHidden = (page) => HIDDEN.includes(page === 'home' ? 'index' : page);

const navLinks = (page) => D.nav
  .filter(i => !HIDDEN.includes(i.href.replace('.html', '')))
  .map(i =>
    `<li><a href="${i.href}"${page === i.href.replace('.html', '') ? ' aria-current="page"' : ''}>${i.label}</a></li>`
  ).join('\n            ');

const header = (page) => `<a class="skip-link" href="#content">Skip to content</a>
    <header class="site-header" id="site-header">
      <div class="container">
        <a class="brand" href="/" aria-label="Kismat Cookies home">${bone()}<span>Kismat Cookies</span></a>
        <nav class="nav" aria-label="Primary">
          <ul>
            ${navLinks(page)}
          </ul>
        </nav>
        <a class="btn header-cta" href="contact.html">Get in touch ${arrow}</a>
        <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
          <span></span><span></span>
        </button>
      </div>
    </header>
    <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
      <nav aria-label="Mobile">
        <ul>
          ${navLinks(page)}
          <li><a href="contact.html">Get in touch</a></li>
        </ul>
      </nav>
    </div>`;

const footer = (page) => `<section class="closing container reveal">
      <h2 class="h2">Let’s talk about your run.</h2>
      <p>Tell us about the brand and what you’d want on the slip.</p>
      <a class="btn btn--lg" href="contact.html">Get in touch ${arrow}</a>
    </section>
    <footer class="site-footer" id="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <h2>Get in touch</h2>
            <a class="footer-mail" href="mailto:${D.email}">${D.email}</a>
            <p class="footer-social"><a href="${D.linkedin}"
               target="_blank" rel="noopener">LinkedIn ${smallArrow}</a></p>
          </div>
          <div><h2>The product</h2><ul>
            ${navLinks(page)}
          </ul></div>
          <div><h2>Pages</h2><ul>
            <li><a href="/">Home</a></li>
            <li><a href="contact.html">Get in touch</a></li>
          </ul></div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Kismat Cookies</span>
          <ul>
            <li><a href="mailto:${D.email}">${D.email}</a></li>
            <li><button class="theme-back" type="button" data-theme-back>Back to dark</button></li>
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


${page === 'home' ? `    <!-- The fortune moment. Landing page only, on every load: crack the
         roll, read the slip, and the site turns warm. Other pages inherit
         whichever palette the visitor left the landing page on. -->
    <div class="moment" id="moment" hidden>
      <div class="moment__scrim" data-moment-close></div>
      <!-- Night sky. Positions are derived from the index rather than random,
           so the same sky is served to everyone and to every rebuild. -->
      <div class="moment__sky" aria-hidden="true">
        ${(() => {
          let h = 1103515245;
          const rnd = () => (h = (h * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
          let out = '';
          for (let i = 0; i < 46; i++) {
            const x = (rnd() * 100).toFixed(2);
            const y = (rnd() * 100).toFixed(2);
            const size = (1.1 + rnd() * 2.4).toFixed(2);
            const op = (0.45 + rnd() * 0.55).toFixed(2);
            const dur = (2.6 + rnd() * 4.8).toFixed(2);
            const del = (rnd() * 7).toFixed(2);
            out += `<span class="star" style="--x:${x}%;--y:${y}%;--s:${size}px;--o:${op};--t:${dur}s;--d:${del}s"></span>`;
          }
          return out;
        })()}
        <span class="shoot shoot--a"></span>
        <span class="shoot shoot--b"></span>

      </div>

      <div class="moment__motes" aria-hidden="true">
        ${Array.from({ length: 14 }, (_, i) => {
          const left  = [7, 15, 23, 31, 39, 46, 54, 61, 69, 76, 83, 89, 94, 97][i];
          const delay = [0, 2.6, 5.1, 1.3, 3.9, 6.4, .7, 4.4, 2.1, 5.8, 3.2, 1.8, 7.1, .4][i];
          const dur   = [11, 14, 12, 15, 13, 16, 12, 14, 15, 11, 13, 16, 14, 12][i];
          const size  = [3, 5, 4, 3, 6, 4, 5, 3, 4, 6, 3, 5, 4, 6][i];
          return `<span class="mote" style="--x:${left}%;--d:${delay}s;--t:${dur}s;--s:${size}px"></span>`;
        }).join('')}
      </div>
      <div class="moment__inner" role="dialog" aria-modal="true" aria-labelledby="moment-title">
        <!-- The stage is centred, so the film growing from nothing on the right
             walks the fortune to the left on its own. One transition, not two
             that have to be kept in step. -->
        <div class="moment__stage">
        <div class="moment__fortune">
        <p class="moment__eyebrow" id="moment-title">One for you</p>
        <button class="moment__cookie" type="button" id="moment-cookie"
                aria-label="Open the wrapper">
          <span class="moment__aura" aria-hidden="true"></span>
          <span class="biscuit">
            ${wrapHalves('m')}
            <span class="biscuit__crumb"></span><span class="biscuit__crumb"></span>
            <span class="biscuit__crumb"></span><span class="biscuit__crumb"></span>
            <span class="biscuit__crumb"></span>
          </span>
        </button>
        <p class="moment__hint">Tap to open it</p>
        <figure class="moment__slip" role="status">
          <div class="paper paper--fortune">
            <p>Your fortune holds within you.</p>
            <span class="paper__nums">3, 9, 14, 22, 31, 45</span>
          </div>
          <div class="paper paper--ad" style="--ad-bg:#F7971E;--ad-fg:#14110D">
            <span class="paper__tag">10% offer for you</span>
            <span class="paper__id"><b>Kismat Cookies</b></span>
          </div>
        </figure>
        </div>
${film.stem ? `        <!-- Written out only when data.js names a stem, and revealed only
             once the file has decoded a frame, so a missing or broken video
             leaves the moment as one centred column rather than a black box. -->
        <div class="moment__film" id="moment-film">
          <video class="moment__video" id="moment-video"
                 preload="none" muted loop playsinline
                 poster="${film.stem}.jpg"${film.alt ? ` aria-label="${esc(film.alt)}"` : ''}>
            <source src="${film.stem}.webm" type="video/webm">
            <source src="${film.stem}.mp4" type="video/mp4">
          </video>${film.caption ? `
          <p class="moment__caption">${esc(film.caption)}</p>` : ''}
        </div>
` : ''}        </div>
        <button class="moment__close" type="button" data-moment-close>Close</button>
      </div>
    </div>` : ''}

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
        ].map(([t, d, checked, locked]) => `<div class="pref">
            <div class="pref__body"><h3>${t}</h3><p>${d}</p></div>
            <label class="switch"><input type="checkbox" ${checked ? 'checked' : ''} ${locked ? 'disabled' : ''} aria-label="${t} cookies"><i></i></label>
          </div>`).join('\n        ')}
        <div class="modal__actions">
          <button class="btn btn--ember" type="button" data-cookie="accept">Accept all</button>
          <button class="btn btn--dark" type="button" data-cookie="reject">Decline all</button>
          <button class="btn btn--outline" style="color:var(--ink);border-color:#B9D6C3" type="button" data-cookie="save">Save my choices</button>
        </div>
      </div>
    </div>`;

const reasonCards = (list) => list.map(r =>
  `<li class="reason"><span class="reason__n">${r.n}</span><h3>${r.title}</h3><p>${r.body}</p></li>`
).join('\n        ');

const formatCards = (asLink) => D.formats.map(f => `<li>
          <${asLink ? 'a class="format" href="formats.html"' : 'div class="format"'}>
            <span class="format__bg"></span>
            <div><div class="meta">${f.meta}</div><h3>${f.title}</h3></div>
            <div><p>${f.body}</p>${asLink
              ? `<span class="know">See the formats ${smallArrow}</span>`
              : `<a class="know" href="contact.html">Ask about this ${smallArrow}</a>`}</div>
          </${asLink ? 'a' : 'div'}>
        </li>`).join('\n        ');

const targetCells = () => D.targets.map(t =>
  `<div class="target"><div class="num">${t.num}</div><div class="label">${t.label}</div></div>`
).join('\n          ');

/* Case studies. Real campaigns run by other people — each card credits who ran
   it, and the page states plainly that they are not ours. */
const caseCards = () => D.cases.map(c => `<li class="case reveal">
          <div class="case__head">
            <span class="case__brand">${c.brand}</span>
            <span class="case__where">${c.place} &middot; ${c.when}</span>
          </div>
          <h2 class="case__title">${c.title}</h2>
          <p class="case__body">${c.body}</p>
          <dl class="case__stats">
            ${c.stats.map(s => `<div><dt>${s.n}</dt><dd>${s.l}</dd></div>`).join('')}
          </dl>
          <p class="case__by">Run by ${c.runBy}</p>
        </li>`).join('\n        ');

/* ---- canonical, social and crawl metadata --------------------------------
   Derived from each page's own <title> and description rather than a second
   list to keep in step with them. Paths are the clean ones cleanUrls serves,
   so the canonical matches the URL a visitor actually has. */
const SITE = 'https://kismatcookies.com';
const pathFor = (page) => page === 'index' ? '/' : `/${page}`;

const socialHead = (page, html) => {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [, 'Kismat Cookies'])[1];
  const desc  = (html.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1];
  /* "The formats | Kismat Cookies" reads as a tab label; a share card wants
     the page's own name, and og:site_name carries the brand separately. */
  const ogTitle = page === 'index'
    ? 'Kismat Cookies'
    : title.replace(/\s*\|\s*Kismat Cookies\s*$/, '');
  const url = SITE + pathFor(page);
  /* A hidden page keeps its canonical — if it is already indexed, the tag is
     what tells Google which URL the noindex applies to. */
  return `${isHidden(page) ? '<meta name="robots" content="noindex,follow">\n' : ''}<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Kismat Cookies">
<meta property="og:locale" content="en_US">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(ogTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/assets/media/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="A sealed wrapper torn open beside the words Kismat Cookies.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(ogTitle)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}/assets/media/og.png">${page === 'index' ? `
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': SITE + '/#org',
      name: 'Kismat Cookies',
      url: SITE,
      logo: SITE + '/assets/media/og.png',
      description: 'Advertising inside a rice-flour cannoli served with the restaurant check, carrying a brand\u2019s line, code and lucky numbers on the slip inside.',
      email: D.email,
      areaServed: { '@type': 'Country', name: 'India' },
      /* Canonical profile URL only. sameAs is how Google matches this entity
         to the same company elsewhere, and a view-state query string
         (?viewAsMember=...) makes it a different string to match against. */
      sameAs: [D.linkedin]
    },
    {
      '@type': 'WebSite',
      '@id': SITE + '/#site',
      name: 'Kismat Cookies',
      url: SITE,
      publisher: { '@id': SITE + '/#org' },
      inLanguage: 'en'
    }
  ]
})}</script>` : ''}`;
};

/* The contact page's "or just email us" block. A region rather than markup in
   the template, because the address was hardcoded there and had already drifted
   from data.js once — everything else on the site reads it from one place. */
const reach = () => `
            <h2 style="font-family:Manrope,sans-serif;font-weight:500;font-size:16px;margin-bottom:16px">Or just email us</h2>
            <a class="footer-mail" href="mailto:${D.email}">${D.email}</a>
            <p class="footer-social"><a href="${D.linkedin}"
               target="_blank" rel="noopener">Kismat Cookies on LinkedIn ${smallArrow}</a></p>`;

const blocks = (page) => ({
  header: header(page),
  footer: footer(page),
  reach: reach(),
  ooh: reasonCards(D.oohPoints),
  reasons: reasonCards(D.reasons),
  formats: formatCards(page === 'home'),
  targets: targetCells(),
  cases: caseCards()
});

let touched = 0;
const pages = [];
for (const file of fs.readdirSync('src/pages').filter(f => f.endsWith('.html'))) {
  const page = path.basename(file, '.html');
  let html = fs.readFileSync(path.join('src/pages', file), 'utf8');
  const b = blocks(page === 'index' ? 'home' : page);
  html = html.replace(/<!--#(\w+)-->[\s\S]*?<!--\/#\1-->/g, (m, name) =>
    b[name] !== undefined ? `<!--#${name}-->${b[name]}<!--/#${name}-->` : m);
  /* Rebuilt from scratch each time rather than edited in place, so running
     the build twice does not stack two copies of the block. */
  html = html.replace(/\n?<!--#social-->[\s\S]*?<!--\/#social-->/g, '')
             .replace('</head>', `<!--#social-->\n${socialHead(page, html)}\n<!--/#social-->\n</head>`);
  fs.writeFileSync(file, html);
  touched++;
  console.log(`  built ${file}`);
  pages.push(page);
}
/* robots.txt and sitemap.xml are written from the page list above, so a new
   page in src/pages is crawlable without anyone remembering to add it. */
fs.writeFileSync('robots.txt',
`User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync('sitemap.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter(p => !HIDDEN.includes(p))
  .sort((a, b) => (a === 'index' ? -1 : b === 'index' ? 1 : a.localeCompare(b)))
  .map(p => `  <url>
    <loc>${SITE}${pathFor(p)}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p === 'index' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`);
console.log('  wrote robots.txt + sitemap.xml');

console.log(`\n${touched} pages built from src/pages + assets/js/data.js`);

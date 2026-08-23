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

const arrow = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12.6667L12.6667 4M12.6667 4V12.32M12.6667 4H4.34667" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const smallArrow = `<svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true"><path d="m1 9.66667 8.66667-8.66667m0 0v8.32m0-8.32h-8.32" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3"/></svg>`;
const bone = (w = 23, h = 21) => `<svg width="${w}" height="${h}" viewBox="0 0 24 22" fill="none" aria-hidden="true"><path d="M3.4 4.2C6.6 4.6 8.6 7.6 9.8 11.6 10.6 14.2 11.4 16.4 12 18.6 12.6 16.4 13.4 14.2 14.2 11.6 15.4 7.6 17.4 4.6 20.6 4.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="3.2" cy="4.1" r="1.9" fill="currentColor"/><circle cx="20.8" cy="4.1" r="1.9" fill="currentColor"/></svg>`;


/* The cookie, emitted wherever it is needed. `sfx` keeps the gradient and
   clip ids unique so two of them on one page cannot collide.
   Both halves share one break polyline, traversed in opposite directions,
   so the jagged edges interlock instead of crossing. */
const BREAK_L = "M150 116 C144 94 134 76 120 66 C113 61 104 61 99 67 A86 74 0 0 0 150 202 L143 186 L156 172 L142 156 L155 142 Z";
const BREAK_R = "M150 116 L155 142 L142 156 L156 172 L143 186 L150 202 A86 74 0 0 0 201 67 C196 61 187 61 180 66 C166 76 156 94 150 116 Z";

const cookieHalves = (sfx) => `
                <svg class="biscuit__half biscuit__half--l" viewBox="0 0 300 250" aria-hidden="true">
                  <defs>
                    <radialGradient id="bakeL${sfx}" cx="0.32" cy="0.26" r="0.95">
                      <stop offset="0" stop-color="#FCF2DA"/><stop offset="0.55" stop-color="#EFC886"/><stop offset="1" stop-color="#C68432"/>
                    </radialGradient>
                    <clipPath id="clipL${sfx}"><path d="${BREAK_L}"/></clipPath>
                  </defs>
                  <path fill="url(#bakeL${sfx})" d="${BREAK_L}"/>
                  <g clip-path="url(#clipL${sfx})">
                    <path fill="none" stroke="#A96D24" stroke-opacity=".38" stroke-width="2.3" stroke-linecap="round" d="M72 140 A82 70 0 0 0 150 198"/>
                    <g stroke="#A96D24" stroke-opacity=".3" stroke-width="1.5" stroke-linecap="round">
                      <path d="M70 146 l11 -2"/><path d="M74 162 l11 -3"/><path d="M82 176 l10 -5"/>
                      <path d="M94 188 l8 -7"/><path d="M113 70 l-8 8"/><path d="M122 79 l-9 7"/>
                      <path d="M130 90 l-10 6"/><path d="M137 102 l-11 5"/>
                    </g>
                  </g>
                </svg>

                <svg class="biscuit__half biscuit__half--r" viewBox="0 0 300 250" aria-hidden="true">
                  <defs>
                    <radialGradient id="bakeR${sfx}" cx="0.7" cy="0.26" r="0.95">
                      <stop offset="0" stop-color="#F7E6C2"/><stop offset="0.55" stop-color="#E8BC78"/><stop offset="1" stop-color="#B87927"/>
                    </radialGradient>
                    <clipPath id="clipR${sfx}"><path d="${BREAK_R}"/></clipPath>
                  </defs>
                  <path fill="url(#bakeR${sfx})" d="${BREAK_R}"/>
                  <g clip-path="url(#clipR${sfx})">
                    <path fill="none" stroke="#96631E" stroke-opacity=".38" stroke-width="2.3" stroke-linecap="round" d="M228 140 A82 70 0 0 1 150 198"/>
                    <g stroke="#96631E" stroke-opacity=".3" stroke-width="1.5" stroke-linecap="round">
                      <path d="M230 146 l-11 -2"/><path d="M226 162 l-11 -3"/><path d="M218 176 l-10 -5"/>
                      <path d="M206 188 l-8 -7"/><path d="M187 70 l8 8"/><path d="M178 79 l9 7"/>
                      <path d="M170 90 l10 6"/><path d="M163 102 l11 5"/>
                    </g>
                  </g>
                </svg>`;

const navLinks = (page) => D.nav.map(i =>
  `<li><a href="${i.href}"${page === i.href.replace('.html', '') ? ' aria-current="page"' : ''}>${i.label}</a></li>`
).join('\n            ');

const header = (page) => `<a class="skip-link" href="#content">Skip to content</a>
    <header class="site-header" id="site-header">
      <div class="container">
        <a class="brand" href="index.html" aria-label="Kismat Cookies home">${bone()}<span>Kismat Cookies</span></a>
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
          </div>
          <div><h2>The product</h2><ul>
            ${navLinks(page)}
          </ul></div>
          <div><h2>Pages</h2><ul>
            <li><a href="index.html">Home</a></li>
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
         cookie, read the slip, and the site turns warm. Other pages inherit
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

        <!-- Cloud bank. Each cloud is bottom-anchored, so only its top half
             clears the edge; it starts small in a corner and grows inward and
             upward, fading as it goes, while the next one is already coming up
             behind it. Six of them, three a side, staggered so the bank never
             empties. -->
        ${[
          { side: 'l', to: 14, s0: .34, s1: 1.30, t: 26, d: 0, o: .62 },
          { side: 'l', from: -26, to: 4,  s0: .28, s1: 1.05, t: 34, d: -12, o: .42 },
          { side: 'l', to: 22, s0: .38, s1: 1.50, t: 30, d: -23, o: .30 },
          { side: 'r', to: 14, s0: .36, s1: 1.35, t: 29, d: -5, o: .58 },
          { side: 'r', from: -28, to: 2,  s0: .30, s1: 1.10, t: 37, d: -19, o: .38 },
          { side: 'r', from: -8,  to: 24, s0: .40, s1: 1.55, t: 32, d: -28, o: .26 }
        ].map(c =>
          `<span class="cloud cloud--${c.side}" style="--to:${c.to}vw;--s0:${c.s0};--s1:${c.s1};--t:${c.t}s;--d:${c.d}s;--o:${c.o}"></span>`
        ).join('')}
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
        <p class="moment__eyebrow" id="moment-title">One for you</p>
        <button class="moment__cookie" type="button" id="moment-cookie"
                aria-label="Crack open the fortune cookie">
          <span class="moment__aura" aria-hidden="true"></span>
          <span class="biscuit">
            ${cookieHalves('m')}
            <span class="biscuit__crumb"></span><span class="biscuit__crumb"></span>
            <span class="biscuit__crumb"></span><span class="biscuit__crumb"></span>
            <span class="biscuit__crumb"></span>
          </span>
        </button>
        <p class="moment__hint">Tap to crack it open</p>
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

/* Journal entries are not articles yet, so they are not links. A card that
   promises a read and delivers a contact form costs more trust than it wins. */
const postCards = () => D.posts.map(p => `<li>
          <div class="format format--static">
            <div><div class="meta">${p.tag}</div><h3>${p.title}</h3></div>
            <div><p>${p.dek}</p></div>
          </div>
        </li>`).join('\n        ');

const blocks = (page) => ({
  header: header(page),
  footer: footer(page),
  ooh: reasonCards(D.oohPoints),
  reasons: reasonCards(D.reasons),
  formats: formatCards(page === 'home'),
  targets: targetCells(),
  posts: postCards()
});

let touched = 0;
for (const file of fs.readdirSync('src/pages').filter(f => f.endsWith('.html'))) {
  const page = path.basename(file, '.html');
  let html = fs.readFileSync(path.join('src/pages', file), 'utf8');
  const b = blocks(page === 'index' ? 'home' : page);
  html = html.replace(/<!--#(\w+)-->[\s\S]*?<!--\/#\1-->/g, (m, name) =>
    b[name] !== undefined ? `<!--#${name}-->${b[name]}<!--/#${name}-->` : m);
  fs.writeFileSync(file, html);
  touched++;
  console.log(`  built ${file}`);
}
console.log(`\n${touched} pages built from src/pages + assets/js/data.js`);

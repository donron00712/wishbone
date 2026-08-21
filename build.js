#!/usr/bin/env node
/**
 * Wishbone build.
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

const navLinks = (page) => D.nav.map(i =>
  `<li><a href="${i.href}"${page === i.href.replace('.html', '') ? ' aria-current="page"' : ''}>${i.label}</a></li>`
).join('\n            ');

const header = (page) => `<a class="skip-link" href="#content">Skip to content</a>
    <header class="site-header" id="site-header">
      <div class="container">
        <a class="brand" href="index.html" aria-label="Wishbone home">${bone()}<span>Wishbone</span></a>
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
          <span>© ${new Date().getFullYear()} Wishbone</span>
          <ul><li><a href="mailto:${D.email}">${D.email}</a></li></ul>
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

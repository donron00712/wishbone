# Wishbone

Marketing site for Wishbone — advertising inside real fortune cookies at
restaurants. Wishbone is the brand; the fortune cookie is the medium. The cookie
arrives with the check, gets cracked open, and the line inside is read out loud.
Static HTML/CSS/JS, no build step.

## Run

```bash
npm start
```

Or without npm:

```bash
python3 -m http.server 4321
```

Then open http://localhost:4321. There is no build step — the files are served as-is.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — pinned 300vh hero, the unit, why it works, the formats |
| `formats.html` | The six formats in detail |
| `why-it-works.html` | The argument behind the product, stated as reasoning not results |
| `journal.html` | Pre-launch notes |
| `contact.html` | Contact form with inline validation + honeypot |

There are deliberately no case studies, client logos or testimonials — the brand
has not launched. The `.honesty` blocks on the home and why-it-works pages say so
outright; delete them once there is a real campaign to point at.

## Editing content

Almost everything is data-driven from `assets/js/data.js`:

| Export | Feeds |
| --- | --- |
| `email` | Footer, contact page, sticky bar — **placeholder, replace before launch** |
| `nav` | Header, mobile menu, footer |
| `wishes` | Fortune lines — hero marquee and the drifting wall in stage two |
| `reasons` | "Why it works" cards |
| `formats` | "The formats" cards |
| `targets` | The three-figure strip |
| `posts` | Journal cards |

Other files: `assets/css/style.css` (tokens + every component),
`assets/js/site.js` (header, menu, footer, sticky bar, cookie consent, Lenis,
reveal-on-scroll), `assets/js/home.js` (hero split text, marquee, GSAP timeline).

Third-party: GSAP + ScrollTrigger and Lenis from jsDelivr, Syne + Manrope from Google Fonts.

## Palette — deep green

| Token | Value | Use |
| --- | --- | --- |
| `--base` | `#051F20` | Page floor behind the shading underlay |
| `--bg` | `#0B2B26` | Body |
| `--surface` | `#163832` | Raised panels |
| `--line` | `#235347` | Hairline borders |
| `--muted` | `#8EB69B` | Secondary copy, eyebrows, marquee |
| `--text` | `#DAF1DE` | Primary copy |
| `--gradient` | `#DAF1DE → #8EB69B → #235347` | Fortune cards and card hover |

Type: Syne 400 for headings, Manrope 300 for body, Georgia italic for anything
printed on a fortune. Radii: 32px cards, 100px pills, 20px fortune cards.

## Hero sequence

`.home-hero` is 300vh with a `position: sticky` stage. One scrubbed GSAP timeline:

| Progress | What happens |
| --- | --- |
| 0.00–0.30 | Headline scales down and fades, wish marquee drops away, frames expand |
| 0.18–0.50 | Wall of wishes fades up and scales from 1.45 → 1 |
| 0.18–1.00 | Three rows drift horizontally at different rates |
| 0.42–0.56 | Right-hand copy and CTA fade in |
| 0.88–1.00 | Wall fades out into the page below |

To inspect one frame: `index.html?stage=0.62`, where the value is timeline progress.

## Before this goes live

- Replace `email` in `data.js` — `hello@wishbone.co` is a placeholder.
- Wire the contact form to a real endpoint; it currently only validates and shows
  a success state client-side.
- Fill in the Terms, Privacy and social links in `site.js` (currently `#`).
- Decide whether the `.honesty` blocks stay.

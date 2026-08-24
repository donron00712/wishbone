# Editing this site

Content lives in `assets/js/data.js`. Page shells live in `src/pages/`.
Running the build writes real HTML into the files at the repo root, which is
what Vercel serves.

```bash
npm run build     # regenerate the pages
npm start         # build, then serve on :4321
```

**Edit `src/pages/*.html`, never the root `*.html`** — the root files are
generated and your changes there will be overwritten on the next build.

Regions between `<!--#name-->` and `<!--/#name-->` are filled by `build.js`:
`header`, `footer`, `ooh`, `reasons`, `formats`, `targets`, `posts`.

## Before launch

- `assets/js/data.js` → `email` is a placeholder
- `src/pages/contact.html` → set `FORM_ENDPOINT` to a real form endpoint.
  Left empty, the form opens the visitor's mail client instead, so enquiries
  still arrive — but a real endpoint is better.
- Footer has no Terms/Privacy links. Add them once the pages exist rather
  than linking to `#`.

## Themes

Two palettes live in `assets/css/style.css`:

- **dark** (default) — the deep green, defined on `:root`
- **warm** — the orange/yellow, defined in one block on `[data-theme="warm"]`

A visitor gets warm by cracking the cookie in the "fortune moment" overlay,
which appears once per visitor. Their choice is remembered in `localStorage`
under `wb-theme`, and a "Back to dark" control sits in the footer while both
palettes exist.

### Making warm the only palette later

The warm values are deliberately one self-contained token block, so this is a
small edit rather than a hunt:

1. In `style.css`, move the values inside `[data-theme="warm"] { … }` into
   `:root`, replacing the green ones.
2. Delete the remaining `[data-theme="warm"] …` element rules by folding each
   into its base rule (there are four: body background, the cookie's edge and
   shadow, the stuck header, and `.btn:hover`).
3. Remove the moment overlay from `build.js`, and the theme block from
   `site.js`.
4. Drop `.theme-back` from `style.css` and the footer.

Nothing else in the codebase reads a colour directly — every component goes
through the tokens — so no component rules need touching.

## Photographs in the hero wall

`assets/js/data.js` has a `photos` array, empty by default. Add an entry and the
photo appears as a tile in the wall alongside the printed slips:

```js
const photos = [
  { src: 'assets/media/cookie-01.jpg',
    alt: 'A cracked fortune cookie on a white plate, the slip half out.',
    credit: 'Photo: your name' }
];
```

One photo is used per row, folded in among the slips. Put the files in
`assets/media/`.

**Only add a file you are allowed to publish.** That means one of:

- a photograph you took
- a stock image you have licensed (Unsplash and Pexels are free for commercial
  use; Getty, Stocksy and Adobe Stock are paid)
- an image whose creator has given you permission in writing

A screenshot from Instagram or TikTok is none of those. The photograph belongs
to whoever took it, publishing it here without permission is infringement, and
showing someone's username next to this brand implies an endorsement that does
not exist.

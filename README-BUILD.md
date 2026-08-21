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

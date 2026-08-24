#!/usr/bin/env node
/**
 * Prepare an image for the hero wall.
 *
 *   node add-photo.js <file> [name]
 *
 * Crops to a square around the centre, resizes to 600px, compresses, and
 * writes it into assets/media/. Prints the line to paste into data.js.
 * Needs ffmpeg, which you already have.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const src = process.argv[2];
if (!src) {
  console.error('Usage: node add-photo.js <file> [name]\n' +
                'e.g.   node add-photo.js ~/Desktop/cookie.jpg my-cookie');
  process.exit(1);
}
if (!fs.existsSync(src)) { console.error(`Not found: ${src}`); process.exit(1); }

const name = (process.argv[3] || path.basename(src, path.extname(src)))
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const out = `assets/media/${name}.jpg`;

/* square crop around the centre, then down to 600px and compressed */
const vf = "crop='min(iw,ih)':'min(iw,ih)',scale=600:600";
execSync(`ffmpeg -v error -i "${src}" -vf "${vf}" -q:v 5 "${out}" -y`);

const kb = Math.round(fs.statSync(out).size / 1024);
console.log(`\n  wrote ${out}  (${kb} KB)\n`);
console.log('  Add this to the photos array in assets/js/data.js:\n');
console.log(`    { src: '${out}',`);
console.log(`      alt: 'Describe what is in the photo.' },\n`);
console.log('  Then run: npm run build\n');

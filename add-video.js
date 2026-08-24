#!/usr/bin/env node
/**
 * Prepare footage for the fortune moment.
 *
 *   node add-video.js <file> [name] [--from <s>] [--to <s>]
 *
 * Crops to 4:5 around the centre, scales to 864x1080, drops the audio track
 * and writes the three files the moment looks for into assets/media/:
 * <name>.mp4, <name>.webm and <name>.jpg as the poster. Prints the lines to
 * paste into data.js. Needs ffmpeg, which you already have.
 *
 * 864x1080 is the frame at 2x: it renders at ~400 CSS px wide on a desktop.
 * The moment hands the page back 14s after the crack, so anything longer
 * than that will not be seen to the end. --from and --to cut it down to the
 * seconds that carry the point, in the source's own timeline:
 *
 *   node add-video.js raw.mov moment-film --from 5 --to 12.9
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/* --from/--to are pulled out first, so the positional file and name keep
   reading the same way they always have. */
const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(name);
  if (i === -1) return null;
  const v = argv.splice(i, 2)[1];
  if (v === undefined || isNaN(parseFloat(v))) {
    console.error(`${name} needs a number of seconds, e.g. ${name} 5.5`);
    process.exit(1);
  }
  return parseFloat(v);
};
const from = flag('--from');
const to   = flag('--to');

const src = argv[0];
if (!src) {
  console.error('Usage: node add-video.js <file> [name] [--from <s>] [--to <s>]\n' +
                'e.g.   node add-video.js ~/Desktop/crack.mov cookie-crack --from 5 --to 12.9');
  process.exit(1);
}
if (!fs.existsSync(src)) { console.error(`Not found: ${src}`); process.exit(1); }

const name = (argv[1] || path.basename(src, path.extname(src)))
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const stem = `assets/media/${name}`;

/* 4:5 crop around the centre, then to the delivery frame */
const vf = "crop='min(iw,ih*4/5)':'min(ih,iw*5/4)',scale=864:1080,setsar=1";

const run = (cmd) => execSync(cmd, { stdio: ['ignore', 'ignore', 'inherit'] });

/* Before -i so ffmpeg seeks rather than decodes-and-discards the head. */
const seek = from === null ? '' : `-ss ${from} `;
const span = to === null ? '' : `-to ${to === null ? '' : (from === null ? to : to - from)} `;
/* The poster is the first frame the visitor will actually see. */
const posterAt = (from === null ? 0.2 : from + 0.2);

console.log('\n  encoding…');
run(`ffmpeg -v error ${seek}-i "${src}" ${span}-vf "${vf}" -an -c:v libx264 -profile:v high ` +
    `-pix_fmt yuv420p -crf 24 -preset slow -movflags +faststart "${stem}.mp4" -y`);
run(`ffmpeg -v error ${seek}-i "${src}" ${span}-vf "${vf}" -an -c:v libvpx-vp9 ` +
    `-crf 34 -b:v 0 -row-mt 1 "${stem}.webm" -y`);
run(`ffmpeg -v error -ss ${posterAt} -i "${src}" -vf "${vf}" -frames:v 1 -q:v 4 "${stem}.jpg" -y`);

const kb = (f) => Math.round(fs.statSync(f).size / 1024);
console.log(`\n  wrote ${stem}.mp4   (${kb(`${stem}.mp4`)} KB)`);
console.log(`  wrote ${stem}.webm  (${kb(`${stem}.webm`)} KB)`);
console.log(`  wrote ${stem}.jpg   (${kb(`${stem}.jpg`)} KB)\n`);

/* the moment closes 14s after the crack, so say so rather than let it surprise */
try {
  const dur = parseFloat(execSync(
    `ffprobe -v error -show_entries format=duration -of csv=p=0 "${stem}.mp4"`
  ).toString().trim());
  if (dur > 14) {
    console.log(`  Note: this runs ${dur.toFixed(1)}s. The moment closes 14s after`);
    console.log('  the crack, so the tail of it is never seen.\n');
  }
} catch (e) {}

console.log('  Set this as momentFilm in assets/js/data.js:\n');
console.log('    const momentFilm = {');
console.log(`      stem: '${stem}',`);
console.log("      alt:  'Describe what happens in the footage.',");
console.log("      caption: ''");
console.log('    };\n');
console.log('  Then run: npm run build\n');

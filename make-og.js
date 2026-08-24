#!/usr/bin/env node
/**
 * Render assets/media/og.svg to the 1200x630 og.png the share tags point at.
 *
 *   npm run og
 *
 * Chrome headless rather than qlmanage: qlmanage scales an SVG to fit a square
 * thumbnail, so a 1200x630 source comes back oversized and centre-cropped.
 * Chrome renders the box you ask for.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].find(p => fs.existsSync(p));

if (!CHROME) {
  console.error('Needs Chrome, Brave or Chromium to render the SVG. None found.');
  process.exit(1);
}

const svg = fs.readFileSync('assets/media/og.svg', 'utf8');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'og-'));
const page = path.join(tmp, 'og.html');
const shot = path.join(tmp, 'og.png');

/* The wrapper pins the viewport so nothing scales or scrolls. */
fs.writeFileSync(page, `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;padding:0;width:1200px;height:630px;overflow:hidden}
svg{display:block;width:1200px;height:630px}</style>
${svg}`);

execFileSync(CHROME, [
  '--headless', '--disable-gpu', '--hide-scrollbars',
  '--force-device-scale-factor=1', '--window-size=1200,630',
  `--screenshot=${shot}`, `file://${page}`,
], { stdio: ['ignore', 'ignore', 'ignore'] });

fs.copyFileSync(shot, 'assets/media/og.png');
fs.rmSync(tmp, { recursive: true, force: true });

const kb = Math.round(fs.statSync('assets/media/og.png').size / 1024);
console.log(`\n  wrote assets/media/og.png  (1200x630, ${kb} KB)\n`);
console.log('  Edit assets/media/og.svg and run this again to change it.\n');

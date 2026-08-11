#!/usr/bin/env node
// WCAG 2.1 contrast measurement + colour inventory. Zero dependencies.
//
//   node contrast.mjs "#6b7280" "#ffffff" "#111827" "#f9fafb"
//   node contrast.mjs --json "#6b7280" "#fff"
//   node contrast.mjs --scan src/styles/globals.css
//   node contrast.mjs --scan src --ext css,tsx
//
// Exits 1 when any pair fails AA for normal text, so it can gate a build.
// Pass --no-fail to always exit 0.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const THRESHOLDS = {
  'AA normal': 4.5,
  'AA large': 3.0,
  'AAA normal': 7.0,
  'AAA large': 4.5,
  'UI / graphics': 3.0,
};

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const RGB_FN = /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/;
const HSL_FN = /hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%/;
// Tailwind v4 defaults to oklch: `oklch(0.723 0.219 149.579)`
const OKLCH_FN = /oklch\(\s*([\d.]+%?)[\s,]+([\d.]+%?)[\s,]+([\d.]+)/;
// shadcn stores bare HSL triplets: `--background: 222.2 47.4% 11.2%`
const HSL_BARE = /^\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*$/;

function parseColor(input) {
  const raw = String(input).trim();

  const bare = raw.match(HSL_BARE);
  if (bare) return hslToRgb(+bare[1], +bare[2], +bare[3]);

  const oklchFn = raw.match(OKLCH_FN);
  if (oklchFn) {
    const pct = (v) => (v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v));
    // Chroma given as a percentage is relative to 0.4 per the CSS Color 4 spec.
    const c = oklchFn[2].endsWith('%')
      ? (parseFloat(oklchFn[2]) / 100) * 0.4
      : parseFloat(oklchFn[2]);
    return oklchToRgb(pct(oklchFn[1]), c, +oklchFn[3]);
  }

  const hslFn = raw.match(HSL_FN);
  if (hslFn) return hslToRgb(+hslFn[1], +hslFn[2], +hslFn[3]);

  const rgbFn = raw.match(RGB_FN);
  if (rgbFn) return [+rgbFn[1], +rgbFn[2], +rgbFn[3]].map(clamp255);

  let hex = raw.startsWith('#') ? raw.slice(1) : raw;
  if (!/^[0-9a-fA-F]+$/.test(hex)) return null;

  if (hex.length === 3 || hex.length === 4) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  if (hex.length !== 6 && hex.length !== 8) return null;

  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

const clamp255 = (n) => Math.min(255, Math.max(0, Math.round(n)));

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const seg = [
    [c, x, 0], [x, c, 0], [0, c, x],
    [0, x, c], [x, 0, c], [c, 0, x],
  ][Math.floor(h / 60) % 6];
  return seg.map((v) => clamp255((v + m) * 255));
}

// OKLCH → sRGB, per CSS Color 4 (OKLab matrices from Björn Ottosson).
function oklchToRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const lin = [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];

  return lin.map((v) => {
    const srgb = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    return clamp255(srgb * 255);
  });
}

// WCAG 2.1 relative luminance (§ definition of relative luminance).
function luminance([r, g, b]) {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrast(fg, bg) {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const toHex = ([r, g, b]) =>
  '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');

// ---------------------------------------------------------------- pair mode

function checkPairs(args, asJson, shouldFail) {
  if (args.length < 2) {
    console.error('Need at least one foreground/background pair.');
    process.exit(2);
  }
  if (args.length % 2 !== 0) {
    console.error(`Odd number of colours (${args.length}) — pairs must be fg bg fg bg …`);
    process.exit(2);
  }

  const results = [];
  for (let i = 0; i < args.length; i += 2) {
    const fg = parseColor(args[i]);
    const bg = parseColor(args[i + 1]);
    if (!fg || !bg) {
      console.error(`Could not parse colour pair: "${args[i]}" / "${args[i + 1]}"`);
      process.exit(2);
    }
    const ratio = contrast(fg, bg);
    results.push({
      fg: toHex(fg),
      bg: toHex(bg),
      ratio: Math.round(ratio * 100) / 100,
      passes: Object.fromEntries(
        Object.entries(THRESHOLDS).map(([k, v]) => [k, ratio >= v]),
      ),
    });
  }

  const failed = results.filter((r) => !r.passes['AA normal']);

  if (asJson) {
    console.log(JSON.stringify({ standard: 'WCAG 2.1', results, failed: failed.length }, null, 2));
  } else {
    console.log('WCAG 2.1 contrast\n');
    console.log(
      pad('foreground', 12) + pad('background', 12) + pad('ratio', 9) +
      pad('AA', 6) + pad('AA lg', 8) + pad('AAA', 6) + 'UI',
    );
    console.log('-'.repeat(60));
    for (const r of results) {
      console.log(
        pad(r.fg, 12) + pad(r.bg, 12) + pad(r.ratio.toFixed(2) + ':1', 9) +
        pad(mark(r.passes['AA normal']), 6) + pad(mark(r.passes['AA large']), 8) +
        pad(mark(r.passes['AAA normal']), 6) + mark(r.passes['UI / graphics']),
      );
    }
    console.log('\nAA normal 4.5 · AA large 3.0 · AAA normal 7.0 · UI/graphics 3.0');
    console.log(
      failed.length
        ? `\nFAIL — ${failed.length} of ${results.length} pair(s) below AA for normal text.`
        : `\nPASS — all ${results.length} pair(s) meet AA for normal text.`,
    );
  }

  if (failed.length && shouldFail) process.exit(1);
}

const pad = (s, n) => String(s).padEnd(n);
const mark = (ok) => (ok ? 'pass' : 'FAIL');

// ---------------------------------------------------------------- scan mode

const DEFAULT_EXT = ['css', 'scss', 'sass', 'less', 'ts', 'tsx', 'js', 'jsx', 'vue', 'svelte', 'html', 'json'];
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'out', 'coverage', '.turbo', 'vendor']);

// Colours hide in four notations in a modern codebase. Hex alone misses most of a
// Tailwind v4 (oklch) or shadcn (bare HSL triplet) theme file entirely.
const SCAN_PATTERNS = [
  HEX,
  /oklch\([^)]+\)/gi,
  /hsla?\([^)]+\)/gi,
  /rgba?\([^)]+\)/gi,
  // `--background: 222.2 47.4% 11.2%` — the shadcn convention, no function wrapper.
  /--[a-z0-9-]+:\s*([\d.]+\s+[\d.]+%\s+[\d.]+%)/gi,
];

function extractColors(text) {
  const found = [];
  for (const pattern of SCAN_PATTERNS) {
    for (const m of text.matchAll(pattern)) {
      // Capture group 1 when present (bare triplets), else the whole match.
      found.push(m[1] ?? m[0]);
    }
  }
  return found;
}

function walk(target, exts, acc = []) {
  let st;
  try {
    st = statSync(target);
  } catch {
    console.error(`Cannot read: ${target}`);
    process.exit(2);
  }
  if (st.isFile()) {
    acc.push(target);
    return acc;
  }
  for (const entry of readdirSync(target)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(target, entry);
    let s;
    try {
      s = statSync(full);
    } catch {
      continue;
    }
    if (s.isDirectory()) walk(full, exts, acc);
    else if (exts.includes(extname(entry).slice(1).toLowerCase())) acc.push(full);
  }
  return acc;
}

function scan(target, exts, asJson) {
  const files = walk(target, exts);
  const counts = new Map();

  for (const file of files) {
    let text;
    try {
      text = readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    for (const match of extractColors(text)) {
      const rgb = parseColor(match);
      if (!rgb) continue;
      const key = toHex(rgb);
      const prev = counts.get(key) || { count: 0, files: new Set() };
      prev.count += 1;
      prev.files.add(file);
      counts.set(key, prev);
    }
  }

  const colors = [...counts.entries()]
    .map(([hex, v]) => ({ hex, count: v.count, files: v.files.size }))
    .sort((a, b) => b.count - a.count);

  // Near-duplicates: same visual colour defined more than once with drifting values.
  const dupes = [];
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const a = parseColor(colors[i].hex);
      const b = parseColor(colors[j].hex);
      const dist = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      if (dist > 0 && dist < 8) dupes.push([colors[i].hex, colors[j].hex, Math.round(dist * 10) / 10]);
    }
  }

  if (asJson) {
    console.log(JSON.stringify({ filesScanned: files.length, distinct: colors.length, colors, nearDuplicates: dupes }, null, 2));
    return;
  }

  console.log(`Scanned ${files.length} file(s) under ${target}\n`);
  // Values are normalised to hex for comparison, but the sources may be oklch/hsl/rgb.
  console.log(`Distinct colours: ${colors.length}`);
  if (colors.length > 20) {
    console.log('  ^ over 20 distinct colours without named roles is a design-system smell.');
  }
  console.log('');
  console.log(pad('colour', 12) + pad('uses', 7) + 'files');
  console.log('-'.repeat(30));
  for (const c of colors.slice(0, 40)) {
    console.log(pad(c.hex, 12) + pad(c.count, 7) + c.files);
  }
  if (colors.length > 40) console.log(`… and ${colors.length - 40} more`);

  if (dupes.length) {
    console.log(`\nNear-duplicates (same visual colour, drifting values): ${dupes.length}`);
    for (const [a, b, d] of dupes.slice(0, 15)) {
      console.log(`  ${a}  ≈  ${b}   (distance ${d})`);
    }
    if (dupes.length > 15) console.log(`  … and ${dupes.length - 15} more`);
  }
}

// ---------------------------------------------------------------- entry

const argv = process.argv.slice(2);

if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
  console.log(`WCAG 2.1 contrast measurement + colour inventory

  contrast.mjs <fg> <bg> [<fg> <bg> …]   measure pairs (hex, rgb(), hsl(), bare HSL triplet)
  contrast.mjs --scan <file|dir>         inventory colours, flag near-duplicates
  contrast.mjs --ext css,tsx             restrict --scan extensions
  contrast.mjs --json                    machine-readable output
  contrast.mjs --no-fail                 always exit 0

Exits 1 when a pair is below AA (4.5:1) for normal text.`);
  process.exit(0);
}

const asJson = argv.includes('--json');
const shouldFail = !argv.includes('--no-fail');

const extIdx = argv.indexOf('--ext');
const exts = extIdx !== -1 && argv[extIdx + 1]
  ? argv[extIdx + 1].split(',').map((e) => e.trim().replace(/^\./, '').toLowerCase())
  : DEFAULT_EXT;

const scanIdx = argv.indexOf('--scan');
if (scanIdx !== -1) {
  const target = argv[scanIdx + 1];
  if (!target || target.startsWith('--')) {
    console.error('--scan needs a file or directory path.');
    process.exit(2);
  }
  scan(target, exts, asJson);
} else {
  const positional = argv.filter((a, i) => {
    if (a.startsWith('--')) return false;
    if (extIdx !== -1 && i === extIdx + 1) return false;
    return true;
  });
  checkPairs(positional, asJson, shouldFail);
}

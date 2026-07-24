import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bibleRoot = path.join(root, '..', 'sato-sato-codex-build-pack');
const outDir = path.join(root, 'public', 'Inside');

const NOINDEX =
  '  <meta name="robots" content="noindex, nofollow, noarchive">\n  <meta name="googlebot" content="noindex, nofollow">\n';

function rewriteAssetPaths(html) {
  return html
    .replaceAll('./images/', '/images/')
    .replaceAll("'/images/", "'/images/")
    .replaceAll('href="/sato.html"', 'href="/Inside/"')
    .replaceAll("href='/sato.html'", "href='/Inside/'")
    .replaceAll('./education-bubbles.js', '/Inside/education-bubbles.js')
    .replaceAll('/education.html', '/Inside/education')
    .replaceAll('/campaigns.html', '/Inside/campaigns');
}

function injectNoIndex(html) {
  if (html.includes('name="robots"')) return html;
  return html.replace(/<head>/i, `<head>\n${NOINDEX}`);
}

function writePage(sourcePath, destPath, label) {
  if (!existsSync(sourcePath)) {
    console.warn(`Skip ${label}: missing ${sourcePath}`);
    return;
  }
  let html = readFileSync(sourcePath, 'utf8');
  html = injectNoIndex(rewriteAssetPaths(html));
  writeFileSync(destPath, html);
  console.log(`Synced ${label} → ${path.relative(root, destPath)}`);
}

if (!existsSync(bibleRoot)) {
  if (existsSync(path.join(outDir, 'index.html'))) {
    console.warn('Brand bible source not found — keeping existing public/Inside/');
    console.warn('Expected sibling folder:', bibleRoot);
    process.exit(0);
  }
  console.error('Brand bible not found at', bibleRoot);
  console.error('Expected sibling folder: sato-sato-codex-build-pack');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

writePage(
  path.join(bibleRoot, 'public', 'sato.html'),
  path.join(outDir, 'index.html'),
  'brand bible',
);

writePage(
  path.join(bibleRoot, 'public', 'education.html'),
  path.join(outDir, 'education.html'),
  'education',
);

writePage(
  path.join(bibleRoot, 'campaigns.html'),
  path.join(outDir, 'campaigns.html'),
  'campaigns',
);

const bubbles = path.join(bibleRoot, 'public', 'education-bubbles.js');
if (existsSync(bubbles)) {
  cpSync(bubbles, path.join(outDir, 'education-bubbles.js'));
  console.log('Synced education-bubbles.js');
}

console.log('Brand bible sync complete.');

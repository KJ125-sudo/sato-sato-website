import { cpSync, existsSync, lstatSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = path.join(root, 'public', 'images');
const brandImages = path.join(root, '..', 'sato-sato-codex-build-pack', 'public', 'images');
const distImages = path.join(root, 'dist', 'images');

function hasImages(dir) {
  return (
    existsSync(path.join(dir, 'can-range-original.png')) ||
    existsSync(path.join(dir, 'can-range-original.webp'))
  );
}

if (!hasImages(imagesDir) && hasImages(brandImages)) {
  console.log('Copying images from brand bible…');
  cpSync(brandImages, imagesDir, { recursive: true });
}

if (existsSync(path.join(root, 'dist')) && !hasImages(distImages) && hasImages(imagesDir)) {
  console.log('Copying images into dist…');
  cpSync(imagesDir, distImages, { recursive: true });
}

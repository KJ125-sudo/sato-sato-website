#!/usr/bin/env node
/**
 * Compress large images to WebP and re-encode videos for production.
 * Usage: node scripts/optimize-media.mjs [--dry-run] [--min-kb=400]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const SOURCE_GLOBS = [
  path.join(ROOT, 'public', 'Inside', 'index.html'),
  path.join(ROOT, 'public', 'Inside', 'education.html'),
  path.join(ROOT, 'index.html'),
  path.join(ROOT, 'src', 'flavours.js'),
  path.join(ROOT, 'src', 'styles'),
];

const dryRun = process.argv.includes('--dry-run');
const minKbArg = process.argv.find((a) => a.startsWith('--min-kb='));
const MIN_KB = minKbArg ? Number(minKbArg.split('=')[1]) : 400;

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp.png']);
const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm']);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

async function readTextFiles(dir) {
  const files = await walk(dir);
  return files.filter((f) => /\.(css|js|mjs)$/.test(f));
}

function collectReferencedImages(text) {
  const refs = new Set();
  const re = /\/images\/[^"'`\s)]+/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    refs.add(decodeURIComponent(match[0]));
  }
  return refs;
}

async function getReferencedImagePaths() {
  const refs = new Set();
  const htmlFiles = [
    path.join(ROOT, 'public', 'Inside', 'index.html'),
    path.join(ROOT, 'public', 'Inside', 'education.html'),
    path.join(ROOT, 'index.html'),
  ];
  const jsFiles = [path.join(ROOT, 'src', 'flavours.js'), ...(await readTextFiles(path.join(ROOT, 'src', 'styles')))];

  for (const file of [...htmlFiles, ...jsFiles]) {
    const text = await fs.readFile(file, 'utf8');
    for (const ref of collectReferencedImages(text)) refs.add(ref);
  }
  return refs;
}

function toDiskPath(ref) {
  return path.join(ROOT, 'public', ref.replace(/^\//, ''));
}

function webpRef(ref) {
  if (ref.endsWith('.webp.png')) return ref.replace(/\.webp\.png$/, '.webp');
  return ref.replace(/\.(png|jpe?g)$/i, '.webp');
}

function webpPath(diskPath) {
  if (diskPath.endsWith('.webp.png')) return diskPath.replace(/\.webp\.png$/, '.webp');
  return diskPath.replace(/\.(png|jpe?g)$/i, '.webp');
}

async function fileSizeKb(file) {
  const stat = await fs.stat(file);
  return stat.size / 1024;
}

async function optimizeImage(srcPath, ref) {
  const outPath = webpPath(srcPath);
  const outRef = webpRef(ref);
  if (srcPath.endsWith('.webp') || srcPath.endsWith('.svg')) return null;

  const srcKb = await fileSizeKb(srcPath);
  if (srcKb < MIN_KB) return null;

  const meta = await sharp(srcPath).metadata();
  const maxWidth = ref.includes('sky') || ref.includes('clouds') || ref.includes('landscape')
    ? 2160
    : ref.includes('product-card') || ref.includes('hero-can') || ref.includes('ticker')
      ? 900
      : ref.includes('bento')
        ? 1200
        : 1600;
  const quality = ref.includes('product-card') || ref.includes('ticker') ? 75 : 80;
  const width = meta.width && meta.width > maxWidth ? maxWidth : undefined;

  if (!dryRun) {
    await sharp(srcPath)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toFile(outPath);
  }

  const outKb = dryRun ? Math.round(srcKb * 0.2) : await fileSizeKb(outPath);
  return { ref, outRef, srcPath, outPath, srcKb: Math.round(srcKb), outKb: Math.round(outKb) };
}

async function optimizeVideo(srcPath, ref) {
  const base = srcPath.replace(/\.[^.]+$/, '');
  const outPath = `${base}.web.mp4`;
  const outRef = ref.replace(/\.[^.]+$/, '.web.mp4');
  const srcKb = await fileSizeKb(srcPath);
  if (srcKb < MIN_KB) return null;

  if (!ffmpegPath) throw new Error('ffmpeg-static binary not found');

  if (!dryRun) {
    await new Promise((resolve, reject) => {
      const args = [
        '-y',
        '-i', srcPath,
        '-vf', 'scale=1280:-2',
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '28',
        '-movflags', '+faststart',
        '-an',
        outPath,
      ];
      const proc = spawn(ffmpegPath, args, { stdio: 'inherit' });
      proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
    });
  }

  const outKb = dryRun ? Math.round(srcKb * 0.25) : await fileSizeKb(outPath);
  return { ref, outRef, srcPath, outPath, srcKb: Math.round(srcKb), outKb: Math.round(outKb) };
}

async function updateReferences(mapping) {
  const targets = [
    ...(await walk(path.join(ROOT, 'public'))).filter((f) => f.endsWith('.html')),
    ...(await walk(path.join(ROOT, 'src'))).filter((f) => /\.(js|css)$/.test(f)),
    path.join(ROOT, 'index.html'),
  ];

  const replacements = [];
  for (const [from, to] of mapping) {
    replacements.push([from, to]);
    replacements.push([encodeURI(from), encodeURI(to)]);
  }

  for (const file of targets) {
    let text = await fs.readFile(file, 'utf8');
    let changed = false;
    for (const [from, to] of replacements) {
      if (text.includes(from)) {
        text = text.split(from).join(to);
        changed = true;
      }
    }
    if (changed && !dryRun) await fs.writeFile(file, text);
  }
}

async function main() {
  const refs = await getReferencedImagePaths();
  const imageJobs = [];
  const videoJobs = [];

  for (const ref of refs) {
    const disk = toDiskPath(ref);
    try {
      await fs.access(disk);
    } catch {
      continue;
    }

    const ext = path.extname(disk).toLowerCase();
    if (VIDEO_EXT.has(ext)) videoJobs.push({ ref, disk });
    else if (IMAGE_EXT.has(ext) || disk.endsWith('.webp.png') || ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
      imageJobs.push({ ref, disk });
    }
  }

  console.log(`Optimizing ${imageJobs.length} images and ${videoJobs.length} videos (min ${MIN_KB}KB)${dryRun ? ' [dry run]' : ''}…`);

  const mapping = new Map();
  let savedKb = 0;

  for (const job of imageJobs) {
    const result = await optimizeImage(job.disk, job.ref);
    if (!result) continue;
    mapping.set(result.ref, result.outRef);
    savedKb += result.srcKb - result.outKb;
    console.log(`IMG  ${result.srcKb}KB → ${result.outKb}KB  ${path.basename(result.ref)}`);
  }

  for (const job of videoJobs) {
    const result = await optimizeVideo(job.disk, job.ref);
    if (!result) continue;
    mapping.set(result.ref, result.outRef);
    savedKb += result.srcKb - result.outKb;
    console.log(`VID  ${result.srcKb}KB → ${result.outKb}KB  ${path.basename(result.ref)}`);
  }

  if (mapping.size) {
    await updateReferences(mapping);
    console.log(`\nUpdated references in source files (${mapping.size} replacements).`);
  }

  console.log(`Estimated savings: ~${Math.round(savedKb / 1024)}MB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

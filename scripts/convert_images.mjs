import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import os from 'os';

const sourceDir = path.resolve('./public/img/lroma-images');
const tempDir = path.resolve('./public/img/lroma-images-temp');

// Reset tempDir
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

// Read and sort original JPG files
const files = fs.readdirSync(sourceDir)
  .filter(f => !f.startsWith('.') && !f.endsWith('.webp') && !f.endsWith('.avif'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

console.log(`Starting optimized conversion for ${files.length} images...`);

let totalOriginalBytes = 0;
let totalWebpBytes = 0;
let totalAvifBytes = 0;

let nextIdx = 0;
let completed = 0;
const concurrency = Math.min(8, os.cpus().length || 4);

async function worker() {
  while (true) {
    const current = nextIdx++;
    if (current >= files.length) break;

    const file = files[current];
    const num = current + 1;
    const inputPath = path.join(sourceDir, file);
    const outWebpPath = path.join(tempDir, `${num}.webp`);
    const outAvifPath = path.join(tempDir, `${num}.avif`);

    const stat = fs.statSync(inputPath);
    totalOriginalBytes += stat.size;

    // Process both formats in parallel for this image
    await Promise.all([
      sharp(inputPath)
        .rotate()
        .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outWebpPath),
      sharp(inputPath)
        .rotate()
        .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
        .avif({ quality: 75, effort: 2 })
        .toFile(outAvifPath)
    ]);

    totalWebpBytes += fs.statSync(outWebpPath).size;
    totalAvifBytes += fs.statSync(outAvifPath).size;

    completed++;
    if (completed % 10 === 0 || completed === files.length) {
      console.log(`Progress: ${completed}/${files.length} images converted`);
    }
  }
}

const startTime = Date.now();
await Promise.all(Array.from({ length: concurrency }, () => worker()));
const duration = ((Date.now() - startTime) / 1000).toFixed(1);

console.log(`\n--- Conversion Complete in ${duration}s ---`);
console.log(`Original total size: ${(totalOriginalBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`WebP total size:     ${(totalWebpBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`AVIF total size:     ${(totalAvifBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`Total savings:       ${((1 - (totalWebpBytes + totalAvifBytes) / (totalOriginalBytes * 2)) * 100).toFixed(1)}%`);

// Replace files in source directory
console.log('\nReplacing original files in public/img/lroma-images...');
for (const f of fs.readdirSync(sourceDir)) {
  fs.unlinkSync(path.join(sourceDir, f));
}

const convertedFiles = fs.readdirSync(tempDir);
for (const f of convertedFiles) {
  fs.renameSync(path.join(tempDir, f), path.join(sourceDir, f));
}

fs.rmSync(tempDir, { recursive: true, force: true });

console.log(`\nDone! Successfully placed ${convertedFiles.length} files (1.avif/webp through ${files.length}.avif/webp) in ${sourceDir}`);

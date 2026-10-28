#!/usr/bin/env node
/**
 * Restores the meal photos into public/images/meals/.
 *
 * The site works without these files (it falls back to the Pexels CDN), but
 * self-hosting them is faster and keeps the page independent of a third party.
 *
 * Usage:
 *   node scripts/fetch-meal-photos.mjs           # download any that are missing
 *   node scripts/fetch-meal-photos.mjs --force   # re-download everything
 *
 * The list of photos is read from src/content/meal-photos.ts so there is a
 * single source of truth. Photos are Pexels photographs (free licence).
 */

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = path.join(root, "src/content/meal-photos.ts");
const outDir = path.join(root, "public/images/meals");
const force = process.argv.includes("--force");

const source = await readFile(manifest, "utf8");
const photos = [...source.matchAll(/photo\("([a-z0-9-]+)",\s*(\d+),/g)].map(([, stem, id]) => ({ stem, id }));
if (photos.length === 0) {
  console.error(`No photos found in ${path.relative(root, manifest)}.`);
  process.exit(1);
}

let sharp = null;
try {
  sharp = (await import("sharp")).default; // installed with Next.js; optional here
} catch {
  /* fall back to saving the CDN file as-is */
}

await mkdir(outDir, { recursive: true });

async function exists(file) {
  try {
    return (await stat(file)).size > 0;
  } catch {
    return false;
  }
}

let downloaded = 0;
let skipped = 0;
for (const { stem, id } of photos) {
  const file = path.join(outDir, `${stem}.jpg`);
  if (!force && (await exists(file))) {
    skipped += 1;
    continue;
  }
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=900`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`✗ ${stem}: ${response.status} ${response.statusText}`);
    process.exitCode = 1;
    continue;
  }
  let buffer = Buffer.from(await response.arrayBuffer());
  if (sharp) {
    buffer = await sharp(buffer).rotate().jpeg({ quality: 78, mozjpeg: true, progressive: true }).toBuffer();
  }
  await writeFile(file, buffer);
  downloaded += 1;
  console.log(`✓ ${stem}.jpg (${Math.round(buffer.length / 1024)} KB)`);
}

console.log(`\nDone: ${downloaded} downloaded, ${skipped} already present → ${path.relative(root, outDir)}/`);

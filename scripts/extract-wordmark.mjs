/**
 * Extracts just the "NIRVANA" lettering from `nirvana_logo.jpg` — no icon,
 * subtitle, or wave line art — as a transparent PNG, for use as a wordmark on
 * its own (e.g. the Hero title).
 *
 * REGION was located once by scanning the source for horizontal bands of
 * brightness (the icon, the wordmark, the subtitle, and the waves are each
 * separated by near-black gaps) and taking the wordmark's band with a small
 * pad. If the source logo file changes, re-run that scan rather than
 * hand-adjusting these coordinates — the source PNG this produces is
 * `src/assets/nirvana-wordmark.png`; the crop region below is only valid for
 * the current `nirvana_logo.jpg`.
 *
 * Run with `node scripts/extract-wordmark.mjs`. Safe to re-run.
 */
import sharp from "sharp";

const REGION = { left: 210, top: 517, width: 708, height: 117 };
const OUT = "src/assets/nirvana-wordmark.png";

const { data, info } = await sharp("nirvana_logo.jpg")
  .extract(REGION)
  .raw()
  .ensureAlpha()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.alloc(width * height * 4);

for (let i = 0; i < width * height; i++) {
  const r = data[i * channels];
  const g = data[i * channels + 1];
  const b = data[i * channels + 2];
  const luminance = r * 0.299 + g * 0.587 + b * 0.114;
  out[i * 4] = 255;
  out[i * 4 + 1] = 255;
  out[i * 4 + 2] = 255;
  out[i * 4 + 3] = luminance;
}

await sharp(out, { raw: { width, height, channels: 4 } })
  .png()
  .trim()
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`written: ${OUT} (${meta.width}x${meta.height})`);

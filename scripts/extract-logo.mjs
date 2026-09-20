/**
 * Extracts the full logo lockup (icon + wordmark + subtitle + wave line art)
 * from the client-delivered `nirvana_logo.jpg` as a transparent PNG.
 *
 * The source is pure white line art on a black square; this keys the black
 * out by luminance (dark -> transparent, white -> opaque) rather than by an
 * exact color match, so JPEG compression noise near the edges doesn't leave a
 * visible fringe. RGB is forced to pure white for the same reason.
 *
 * Only safe to use on assets that are actually white-on-black like this one —
 * see `extract-wordmark.mjs` for pulling just the "NIRVANA" lettering out.
 *
 * Run with `node scripts/extract-logo.mjs`. Safe to re-run.
 */
import sharp from "sharp";

const SRC = "nirvana_logo.jpg";
const OUT = "src/assets/nirvana-logo.png";

const image = sharp(SRC);
const { data, info } = await image
  .raw()
  .ensureAlpha()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.alloc(width * height * 4);

for (let i = 0; i < width * height; i++) {
  const r = data[i * channels];
  const g = data[i * channels + 1];
  const b = data[i * channels + 2];
  // Luminance becomes alpha: black background -> fully transparent, white
  // line art -> fully opaque. RGB is forced to pure white so there's no gray
  // fringing from JPEG compression noise in the near-black background.
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

console.log(`written: ${OUT}`);

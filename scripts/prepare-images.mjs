/**
 * One-off asset pipeline.
 *
 * The client delivered 38 PNGs at ~2.5 MB each under opaque UUID filenames.
 * This maps them onto semantic names and re-encodes to WebP, which takes the
 * set from ~95 MB to roughly a tenth of that. next/image still resizes per
 * device from these; the point here is to stop shipping 5 MB PNGs as the
 * source of truth.
 *
 * Run with `node scripts/prepare-images.mjs`. Safe to re-run.
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(root, "pngs");
const OUT = path.join(root, "public", "images");

/** UUID prefix → semantic slug. Prefix only, so the full name isn't repeated. */
const NAMES = {
  "60276621": "pool-dusk",
  "84de5d04": "pool-villa-day",
  "652fae77": "pool-palapa",
  "9601d3c6": "terrace-pool",
  "12826b36": "pool-daybed",
  "75387f4f": "aerial-tamarindo",
  dd18cd17: "entrance-gate",
  deea4f2f: "entrance-sign",
  c9e9086c: "street-frontage",
  "74371cc9": "palm-walkway",
  e0b9753e: "palm-path",
  "2e68f119": "garden-path",
  "525f8d17": "villa-gate",
  b9090284: "bedroom-poolside",
  eea0e360: "bedroom-garden",
  "075dbd61": "bedroom-terrace",
  fbbd0e85: "bedroom-king",
  "15f90377": "bedroom-window-seat",
  "24403192": "bedroom-ensuite",
  "3cbae2ff": "bedroom-second",
  "1c7a5e3f": "bedroom-hall",
  "3c19082c": "living-room",
  a67dc2d1: "living-detail",
  "21d393d3": "living-dining",
  "1c3d3f45": "indoor-outdoor",
  c6376684: "kitchen",
  d1b882b1: "kitchen-open",
  "33722714": "kitchen-living",
  b8086ca8: "kitchen-detail",
  "130b8387": "bathroom-double",
  "8a1099ce": "bathroom-shower",
  "12ccef18": "shower-detail",
  "6600b704": "bathroom-guest",
  bb4107b2: "bathroom-vanity",
  c39f92f5: "desk-nook",
  "19c82148": "terrace-chairs",
  d30d567e: "terrace-seating",
  "36e804f9": "utility-laundry",
};

/** Cap the long edge. Beyond this is invisible on any real display. */
const MAX_EDGE = 2400;

async function main() {
  await mkdir(OUT, { recursive: true });

  const files = (await readdir(SOURCE)).filter((f) => f.endsWith(".png"));
  const manifest = [];

  for (const file of files) {
    const prefix = file.split("-")[0];
    const slug = NAMES[prefix];

    if (!slug) {
      console.warn(`  ! no name mapped for ${file} — skipped`);
      continue;
    }

    const image = sharp(path.join(SOURCE, file));
    const { width = 0, height = 0 } = await image.metadata();
    const landscape = width >= height;

    const output = await image
      .resize({
        [landscape ? "width" : "height"]: MAX_EDGE,
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 5 })
      .toFile(path.join(OUT, `${slug}.webp`));

    manifest.push({
      slug,
      width: output.width,
      height: output.height,
    });

    console.log(
      `  ${slug.padEnd(22)} ${output.width}x${output.height}  ` +
        `${(output.size / 1024).toFixed(0)} KB`,
    );
  }

  // Intrinsic dimensions, so components can set width/height without a static
  // import per image and without layout shift.
  manifest.sort((a, b) => a.slug.localeCompare(b.slug));
  await writeFile(
    path.join(root, "src", "content", "image-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  console.log(`\n${manifest.length} images written to public/images`);
}

await main();

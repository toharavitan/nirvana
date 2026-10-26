/**
 * Per-villa gallery pipeline.
 *
 * The client delivered one folder of web-sized HDR JPGs per villa (~1.5 MB
 * each). This re-encodes each set to WebP under public/images/villas/<slug>/
 * and writes a manifest (ordering + intrinsic dimensions) that the Gallery
 * reads, so next/image can reserve space without a static import per file.
 *
 * Source folders map to villa slugs by `SOURCES` below. Run with
 *   node scripts/prepare-villa-galleries.mjs <source-root>
 * where <source-root> holds the extracted folders. Safe to re-run.
 */
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_ROOT = process.argv[2];

if (!SOURCE_ROOT) {
  console.error("usage: node scripts/prepare-villa-galleries.mjs <source-root>");
  process.exit(1);
}

/** Source folder name (as delivered) → villa slug on the site. */
const SOURCES = [
  { dir: "casa 1 web", slug: "villa-01" },
  { dir: "2do complejo web", slug: "villa-02" },
  { dir: "3", slug: "villa-03" },
  { dir: "4", slug: "villa-04" },
  { dir: "5", slug: "villa-05" },
];

/** Cap the long edge. The sources are ~1620px already, so this rarely bites. */
const MAX_EDGE = 2000;

async function main() {
  const manifest = [];

  for (const { dir, slug } of SOURCES) {
    const srcDir = path.join(SOURCE_ROOT, dir);
    const outDir = path.join(root, "public", "images", "villas", slug);

    await rm(outDir, { recursive: true, force: true });
    await mkdir(outDir, { recursive: true });

    const files = (await readdir(srcDir))
      .filter((f) => /\.jpe?g$/i.test(f))
      .sort();

    const images = [];
    let index = 0;

    for (const file of files) {
      index += 1;
      const name = String(index).padStart(2, "0");

      const input = sharp(path.join(srcDir, file));
      const { width = 0, height = 0 } = await input.metadata();
      const landscape = width >= height;

      const output = await input
        .resize({
          [landscape ? "width" : "height"]: MAX_EDGE,
          withoutEnlargement: true,
        })
        .webp({ quality: 80, effort: 5 })
        .toFile(path.join(outDir, `${name}.webp`));

      images.push({
        src: `/images/villas/${slug}/${name}.webp`,
        width: output.width,
        height: output.height,
      });
    }

    manifest.push({ slug, images });
    const kb = images.length ? "ok" : "EMPTY";
    console.log(`  ${slug}  ${images.length} images  ${kb}`);
  }

  await writeFile(
    path.join(root, "src", "content", "villa-galleries.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  const total = manifest.reduce((n, v) => n + v.images.length, 0);
  console.log(`\n${total} images written to public/images/villas`);
}

await main();

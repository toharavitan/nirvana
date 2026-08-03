/**
 * Minimal MP4 atom walker.
 *
 * ffmpeg isn't on this machine and the two client videos arrived with opaque
 * names, so this reads the container directly: `mvhd` for duration, `tkhd` for
 * display dimensions, and `stss` to count sync samples — which is the number
 * that actually decides whether scroll-scrubbing will be smooth or stutter.
 */
import { open } from "node:fs/promises";

/** Atoms whose payload is a list of child atoms rather than data. */
const CONTAINERS = new Set([
  "moov",
  "trak",
  "mdia",
  "minf",
  "stbl",
  "edts",
  "udta",
]);

async function readAtoms(handle, start, end, depth, found) {
  let offset = start;

  while (offset < end - 8) {
    const header = Buffer.alloc(8);
    await handle.read(header, 0, 8, offset);

    let size = header.readUInt32BE(0);
    const type = header.toString("ascii", 4, 8);
    let headerSize = 8;

    if (size === 1) {
      // 64-bit extended size.
      const ext = Buffer.alloc(8);
      await handle.read(ext, 0, 8, offset + 8);
      size = Number(ext.readBigUInt64BE(0));
      headerSize = 16;
    } else if (size === 0) {
      size = end - offset;
    }

    if (size < headerSize) break;

    const bodyStart = offset + headerSize;
    const bodyEnd = offset + size;

    if (CONTAINERS.has(type)) {
      await readAtoms(handle, bodyStart, bodyEnd, depth + 1, found);
    } else if (type === "mvhd") {
      const body = Buffer.alloc(Math.min(32, bodyEnd - bodyStart));
      await handle.read(body, 0, body.length, bodyStart);
      const version = body.readUInt8(0);
      if (version === 1) {
        found.timescale = body.readUInt32BE(20);
        found.duration = Number(body.readBigUInt64BE(24));
      } else {
        found.timescale = body.readUInt32BE(12);
        found.duration = body.readUInt32BE(16);
      }
    } else if (type === "tkhd") {
      const body = Buffer.alloc(Math.min(96, bodyEnd - bodyStart));
      await handle.read(body, 0, body.length, bodyStart);
      const version = body.readUInt8(0);
      // Offsets measured from the version byte: the 36-byte display matrix sits
      // immediately before width/height, and the v1 header carries 64-bit
      // creation/modification/duration fields, pushing everything 12 bytes on.
      const base = version === 1 ? 88 : 76;
      if (body.length >= base + 8) {
        // 16.16 fixed point.
        const w = body.readUInt32BE(base) / 65536;
        const h = body.readUInt32BE(base + 4) / 65536;
        if (w > 0 && h > 0) {
          found.width = Math.round(w);
          found.height = Math.round(h);
        }
      }
    } else if (type === "stss") {
      const body = Buffer.alloc(8);
      await handle.read(body, 0, 8, bodyStart);
      found.syncSamples = body.readUInt32BE(4);
    } else if (type === "stsz") {
      const body = Buffer.alloc(12);
      await handle.read(body, 0, 12, bodyStart);
      const count = body.readUInt32BE(8);
      if (count > (found.sampleCount ?? 0)) found.sampleCount = count;
    }

    offset = bodyEnd;
  }
}

for (const file of process.argv.slice(2)) {
  const handle = await open(file, "r");
  const { size } = await handle.stat();
  const found = {};

  await readAtoms(handle, 0, size, 0, found);
  await handle.close();

  const seconds = found.duration / found.timescale;
  const fps = found.sampleCount ? found.sampleCount / seconds : 0;

  console.log(`\n${file}`);
  console.log(`  size        ${(size / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  resolution  ${found.width}x${found.height}`);
  console.log(`  duration    ${seconds.toFixed(2)}s`);
  console.log(`  frames      ${found.sampleCount ?? "?"}  (~${fps.toFixed(1)} fps)`);
  console.log(
    `  keyframes   ${found.syncSamples ?? "every frame (no stss = all sync)"}`,
  );
  if (found.syncSamples && found.sampleCount) {
    const gop = found.sampleCount / found.syncSamples;
    console.log(
      `  GOP         ~${gop.toFixed(0)} frames between keyframes ` +
        `(${(gop / fps).toFixed(2)}s)`,
    );
  }
  console.log(`  bitrate     ${((size * 8) / seconds / 1e6).toFixed(1)} Mbps`);
}

/**
 * Video pipeline for the scroll-scrubbed journey.
 *
 * The two source clips — the drone descent and the walk through the gate —
 * were shot as one continuous camera move, and the site plays them as one:
 * a single pinned section scrubs a single file. So they are concatenated
 * here, at encode time, rather than stitched visually at runtime where the
 * seam between two <video> elements could never be frame-accurate.
 *
 * The sources are 30–54 Mbps with a ~18-frame GOP. That encoding is fine for
 * linear playback and bad for scrubbing: seeking to an arbitrary currentTime
 * forces the decoder back to the last keyframe and forward again, which is
 * exactly the stutter people blame on "scroll video being janky". So the
 * output is re-encoded all-intra (`-g 1`) — every frame is a seek target and
 * scrubbing is frame-exact. That costs bitrate, which is why the output is
 * also scaled down.
 *
 * Both sources carry a generator watermark in the bottom-right, removed by
 * cropping the lower edge. The two clips have different aspect ratios after
 * that crop; both are scale-filled and centre-cropped onto the walkway
 * clip's aspect, which only ever renders full-bleed under object-cover.
 *
 * Run with `node scripts/prepare-videos.mjs`. Safe to re-run.
 */
import { execFile } from "node:child_process";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "public", "videos");

const FFMPEG =
  process.env.FFMPEG_PATH ??
  path.join(
    process.env.LOCALAPPDATA ?? "",
    "Microsoft/WinGet/Packages",
    "Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe",
    "ffmpeg-8.1.2-full_build/bin/ffmpeg.exe",
  );

/** Fraction of height trimmed from the bottom to drop the watermark. */
const WATERMARK_TRIM = 0.08;

/**
 * In story order, all 24 fps. One frame is dropped at each seam — the shots
 * overlap where they meet, and holding near-duplicate frames across a cut
 * reads as a hiccup when scrubbing over it. 117 + 117 + 120 × 6 = 954
 * frames, with seams at ≈0.12, ≈0.25, ≈0.37, ≈0.50, ≈0.62, ≈0.75 and ≈0.87
 * of the playhead.
 */
const SOURCES = [
  // descent to the gate — drop its final frame
  { file: "drone .mp4", width: 2903, height: 2176, trim: "end_frame=117" },
  // through it, down the walkway — drop its first frame
  { file: "indoor.mp4", width: 2155, height: 1440, trim: "start_frame=1" },
  // along the walkway to the villa's own gate — portrait, centre-cropped;
  // the path and door hold the middle of the frame so the crop is safe
  { file: "3.mp4", width: 1176, height: 1764, trim: "start_frame=1" },
  // through the private gate to the pool and terrace — the reveal
  { file: "5.mp4", width: 1764, height: 1176, trim: "start_frame=1" },
  // from the terrace through the glass doors into the living room — home
  { file: "6.mp4", width: 1764, height: 1176, trim: "start_frame=1" },
  // across the living room to the kitchen
  { file: "7.mp4", width: 1760, height: 1176, trim: "start_frame=1" },
  // and through to the bedroom
  { file: "8.mp4", width: 1764, height: 1176, trim: "start_frame=1" },
  // back out through the sliding doors, ending wide on the pool and palapa
  // — the walk goes in and comes back to the water it started for
  { file: "9.mp4", width: 1764, height: 1176, trim: "start_frame=1" },
];

/**
 * Output canvas aspect = the walkway clip's post-crop aspect (2155×1325).
 * The drone clip loses a little top and bottom to match; at full bleed the
 * difference is invisible.
 */
const ASPECT = 2155 / 1325;

/**
 * Rendition widths. Mobile exists so phones don't pull the desktop file.
 *
 * The CRF values look high for a hero asset, but all-intra changes the maths:
 * with no inter-frame prediction there is nothing for artifacts to accumulate
 * across, and every frame is refreshed from scratch.
 */
const RENDITIONS = [
  // 1920 at CRF 23: the clip renders full-bleed on 2.5K displays, where the
  // previous 1600/27 encode read as soft and blocky in the palm fronds.
  { suffix: "desktop", width: 1920, crf: 23 },
  { suffix: "mobile", width: 1080, crf: 26 },
];

/** ffmpeg needs even dimensions for yuv420p. */
const even = (n) => Math.floor(n / 2) * 2;

/** Per-source chain: seam trim → watermark crop → fill the canvas → centre crop. */
function chain(source, w, h) {
  const cropH = even(Math.round(source.height * (1 - WATERMARK_TRIM)));
  const trim = source.trim ? `trim=${source.trim},setpts=PTS-STARTPTS,` : "";
  return (
    trim +
    `crop=${source.width}:${cropH}:0:0,` +
    `scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,` +
    `crop=${w}:${h},setsar=1`
  );
}

async function encodeJourney() {
  const inputs = SOURCES.flatMap((s) => ["-i", path.join(root, s.file)]);

  for (const r of RENDITIONS) {
    const w = r.width;
    const h = even(Math.round(w / ASPECT));
    const out = path.join(OUT, `journey-${r.suffix}.mp4`);

    const chains = SOURCES.map(
      (s, i) => `[${i}:v]${chain(s, w, h)}[v${i}]`,
    ).join(";");
    const labels = SOURCES.map((_, i) => `[v${i}]`).join("");
    const filter = `${chains};${labels}concat=n=${SOURCES.length}:v=1:a=0[v]`;

    await run(FFMPEG, [
      "-v", "error",
      "-y",
      ...inputs,
      "-filter_complex", filter,
      "-map", "[v]",
      "-an",                        // no audio track — nothing to hear, and it
                                    // only complicates seeking
      "-c:v", "libx264",
      "-profile:v", "high",
      "-pix_fmt", "yuv420p",
      // All-intra: every frame is its own seek target, which is what makes
      // scrubbing frame-exact rather than lumpy.
      //
      // A 4-frame GOP was measured as an alternative and saved only 6%
      // (80.6 → 75.4 MB): the camera moves continuously through the whole
      // journey, so consecutive frames share almost nothing and predicted
      // frames come out nearly as large as keyframes. Not worth giving up
      // exact seeking for. If this file has to get smaller, the lever is
      // CRF or width below — not the GOP.
      "-g", "1",
      "-bf", "0",                   // no B-frames: they reorder decode, which
                                    // is exactly what makes seeking lumpy
      "-crf", String(r.crf),
      "-preset", "slower",          // 954 frames — spend the time on quality
      "-movflags", "+faststart",
      out,
    ]);

    const { size } = await stat(out);
    console.log(
      `  journey-${r.suffix}.mp4`.padEnd(32) +
        `${w}x${h}  ${(size / 1024 / 1024).toFixed(1)} MB`,
    );
  }

  // First frame, for the poster and the reduced-motion still.
  const posterW = 1920;
  const posterH = even(Math.round(posterW / ASPECT));
  const poster = path.join(OUT, "journey-poster.webp");

  await run(FFMPEG, [
    "-v", "error",
    "-y",
    "-i", path.join(root, SOURCES[0].file),
    "-vf", chain(SOURCES[0], posterW, posterH),
    "-frames:v", "1",
    "-quality", "80",
    poster,
  ]);

  const { size } = await stat(poster);
  console.log(
    `  journey-poster.webp`.padEnd(32) +
      `${posterW}x${posterH}  ${(size / 1024).toFixed(0)} KB`,
  );
}

async function main() {
  await mkdir(OUT, { recursive: true });

  console.log(`\njourney  (${SOURCES.map((s) => s.file).join(" + ")})`);
  await encodeJourney();

  const total = (
    await Promise.all(
      (await readdir(OUT)).map(async (f) => (await stat(path.join(OUT, f))).size),
    )
  ).reduce((a, b) => a + b, 0);

  console.log(`\ntotal ${(total / 1024 / 1024).toFixed(1)} MB in public/videos`);
}

await main();

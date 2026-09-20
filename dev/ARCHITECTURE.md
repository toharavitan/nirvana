# Nirvana — Tamarindo Boutique Villas
## Technical Architecture · v1 (Phase 2)
*Defines contracts and structure. No implementation in this phase.*

Companion to `EXPERIENCE-BLUEPRINT.md` (approved v1).

---

## 1. Stack & ground rules

- Next.js (App Router) · React · TypeScript · Tailwind CSS · `next/image`.
- `@leadstrikes/motion-engine` installed per skill setup
  (`file:../../leadstrikes-motion-engine`, `turbopack.root` pinned two levels up).
- Single-page site v1 → `SmoothScrollProvider` only, **no**
  `PageTransitionProvider` (added only if the site grows routes).
- Forbidden anywhere in `src/`: `gsap.registerPlugin`, `new Lenis`,
  `ScrollTrigger.create/config/defaults`, engine provider internals.
  Verified pre-delivery with the skill's grep.
- All motion values via tokens (`DURATION`, `EASING`, `STAGGER`, `DISTANCE`).
  Site-wide tuning only through `configureMotion()` in the root layout —
  never by editing the engine.

---

## 2. Directory structure

```
src/
├── app/
│   ├── layout.tsx              SmoothScrollProvider, fonts, metadata
│   ├── page.tsx                Act sequence (server component shell)
│   └── globals.css             Tailwind, design tokens as CSS vars
│
├── components/
│   ├── sections/               One component per act — "use client"
│   │   ├── Approach.tsx        Act I    hero ScrollVideo
│   │   ├── Path.tsx            Act II   parallax palm corridor
│   │   ├── Reveal.tsx          Act III  pool ScrollVideo
│   │   ├── Villa.tsx           Act IV   interior chapters
│   │   ├── Rituals.tsx         Act V    palapa & details
│   │   ├── Tamarindo.tsx       Act VI   context + stats
│   │   └── Return.tsx          Act VII  booking CTA + footer
│   │
│   ├── media/
│   │   ├── ScrollVideo.tsx     THE custom component (pinned scrub)
│   │   ├── CinematicImage.tsx  still + one engine treatment
│   │   └── ParallaxLayers.tsx  stacked depth scene (Act II)
│   │
│   └── ui/
│       ├── Container.tsx       max-width + gutter variants
│       ├── Headline.tsx        typographic scale + optional textReveal
│       ├── Eyebrow.tsx         small caps label
│       ├── Copy.tsx            body text block, reveal-on-scroll
│       ├── StatTrio.tsx        Act VI count-up numbers
│       ├── ScrollCue.tsx       breathing line (hero)
│       ├── CircleMask.tsx      porthole motif wrapper
│       └── Button.tsx          primary / ghost
│
├── content/
│   ├── media.ts                typed asset map (single source of truth)
│   └── copy.ts                 all site text, per act
│
├── config/
│   └── site.ts                 name, contact, booking URL, socials, stats
│
└── lib/
    └── video.ts                scrub math helpers (lerp, seek throttling)

public/assets/
├── videos/                     arrival.mp4  arrival-720.mp4
│                               pool-reveal.mp4  pool-reveal-720.mp4
└── images/                     semantic-named AVIF/WebP + poster frames
```

Server/client split: `page.tsx` and layout stay server components; each
section is a client component owning its own `useGSAPAnimation` scope.
No global animation context at site level — the engine provider is the only
provider.

---

## 3. Media data structure — `content/media.ts`

Single source of truth. Sections never hardcode paths; future asset
replacement = edit this file only.

```ts
export type ScrollVideoAsset = {
  kind: "scroll-video";
  id: "arrival" | "poolReveal";
  src: string;            // desktop encode, dense keyframes
  srcMobile: string;      // 720p encode
  poster: string;         // first-frame still (AVIF)
  posterEnd: string;      // last-frame still (cross-fade out + fallback)
  duration: number;       // seconds, measured at encode time
  aspect: [number, number];
};

export type ImageAsset = {
  kind: "image";
  id: string;             // "entrance-gate", "pool-wide", …
  src: string;            // handled by next/image
  alt: string;            // real descriptions — a11y is content
  aspect: [number, number];
  act: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  role: "hero" | "scene" | "grid" | "detail";
};

export const media = {
  videos: { arrival: {...}, poolReveal: {...} },
  images: {
    approach: ImageAsset[],   // grouped by act for direct section access
    path: ImageAsset[],
    villa: { live: ImageAsset[]; cook: ImageAsset[]; rest: ImageAsset[] },
    rituals: ImageAsset[],
    tamarindo: ImageAsset[],
  },
} as const;
```

`copy.ts` mirrors the act structure (`copy.approach.headline`, …) so copy
edits never touch components.

---

## 4. Scene component APIs

### 4.1 `ScrollVideo` — the one custom media component

Scroll-scrubbed, pinned video. Used exactly twice (Acts I, III).

```ts
type ScrollVideoProps = {
  asset: ScrollVideoAsset;
  pinLength?: number;          // vh of scroll while pinned; default 150 (100 mobile)
  overlay?: React.ReactNode;   // headline / CTA layer above the video
  overlayTiming?: { showAt: number; hideAt?: number }; // progress 0..1
  onProgress?: (p: number) => void;  // ref-safe consumer, optional
  className?: string;
};
```

**Internal contract (engine usage, defined here, built in Phase 3):**

1. `useGSAPAnimation(() => { ... }, { scope })` wraps everything.
2. `pinSection(scope.current, { length: pinLength })` holds the frame.
3. `watchScrollProgress(scope.current, cb)` supplies raw progress —
   **stored in a ref**. No state updates per frame, ever.
4. A single `requestAnimationFrame` loop (started on mount inside the same
   callback, cleaned up on return) lerps `displayed → target` progress
   (factor ~0.12) and writes `video.currentTime = displayed * duration`.
   Lerp lives at the site layer because scrub smoothing is a *content*
   decision; easing token `EASING.none` applies to the scrub mapping itself.
5. Seek throttling (`lib/video.ts`): skip writes when
   `|delta| < 1/(2·fps)`; never await `seeked` — last-write-wins.
6. Cleanup function returned from the callback (engine requirement).

**Loading states:** `poster` renders immediately (`next/image`, priority for
Act I). Video element mounts with `preload="metadata"`; upgraded to full
buffer when the section is ≤ 1 viewport away (engine `watchPageScrollProgress`
or a plain IntersectionObserver — observer preferred: it's not scroll motion,
it's loading logic). `muted`, `playsInline`, no controls.

**Fallbacks (decided states, not improvisation):**

| Condition | Behavior |
|---|---|
| `useReducedMotion()` true | static `poster` + overlay, video never mounts |
| Video fails to load/decode | `poster` → `posterEnd` cross-fade tied to same progress ref |
| Mobile jank (device test fails) | `mobileStrategy: "timed"` — plays 4s once on section enter, pin shortened |

### 4.2 `CinematicImage`

Every still on the page goes through this — one image, one treatment.

```ts
type CinematicImageProps = {
  asset: ImageAsset;
  treatment: "reveal" | "zoom" | "settle" | "parallax" | "none";
  // maps 1:1 → imageReveal | imageZoom | scaleImage | parallax
  speed?: number;         // parallax only, clamped ≤ 0.4 (halved on mobile)
  priority?: boolean;     // next/image priority (Act I poster only)
  mask?: "circle" | "none";   // porthole motif via CircleMask
  className?: string;
};
```

One `useGSAPAnimation` per instance, scoped to its own wrapper. Treatment
prop is the *entire* animation surface — sections cannot pass raw tweens,
which keeps the motion language consistent by construction.

### 4.3 `ParallaxLayers` (Act II)

```ts
type ParallaxLayersProps = {
  base: ImageAsset;                 // full-bleed background
  layers?: { asset: ImageAsset; speed: number; position: string }[];
  children?: React.ReactNode;       // floating copy between scenes
};
```

Internally: `imageReveal` on the base, `parallax` per layer. Max 2 overlay
layers per scene — depth reads with two; three costs fps for nothing.

### 4.4 `Headline` / `Copy`

```ts
type HeadlineProps = {
  as?: "h1" | "h2" | "h3";
  split?: "chars" | "words" | "lines" | "none";  // → textReveal
  children: string;
};
```

`textReveal` returns a cleanup — `Headline` owns returning it from its
callback. Mobile automatically degrades `chars → words` (see §7); sections
don't handle this themselves.

### 4.5 Section contract

Every `sections/*.tsx` follows the canonical shape: one `scope` ref, one
`useGSAPAnimation`, tokens only, media via `media.<act>`, copy via
`copy.<act>`. Sections compose `media/` + `ui/` components and add only
layout. A section never touches `video.currentTime`, never imports gsap
directly unless building a scrubbed `pinSection` timeline (Act IV does not
need one).

---

## 5. Engine API usage map

| Act | Engine APIs |
|---|---|
| 00 Preloader | `textReveal` (chars, `EASING.premium`), `fadeOut` |
| I Approach | `pinSection` + `watchScrollProgress` (via ScrollVideo), `textReveal`, `fadeIn` scroll cue |
| II Path | `imageReveal`, `parallax` (≤0.3), `imageZoom`, `textReveal` (lines) |
| III Reveal | ScrollVideo (as Act I), overlay `fadeIn` at progress ≥ 0.8 |
| IV Villa | `imageReveal`, `scaleImage`, `reveal` (copy), `batchReveal` (amenities grid) |
| V Rituals | `imageZoom`, `batchReveal` (`STAGGER.loose`), `textReveal` (words) |
| VI Tamarindo | `parallax` bg, `reveal`, count-up via `useGSAPAnimation` tween of a ref'd number (scroll: true) |
| VII Return | `fadeIn` only |

Escape hatch policy: `createScrollAnimation` is available but v1 needs it
nowhere — if an implementation step reaches for it, that's a design smell to
revisit first. No engine extension requests anticipated.

---

## 6. Performance strategy

**Budgets (mobile, 4G, mid-tier Android):**
- First paint ≤ 1.5s; above-fold transfer ≤ 3 MB (poster + fonts + JS, video
  buffers after first paint); CLS ≈ 0 (all media boxes sized via `aspect`);
  steady 60fps scroll.

**Video:** re-encode both clips — H.264 High, `-g 8` (or all-intra if size
allows), no audio track, ~3 Mbps desktop / ~1.5 Mbps 720p mobile, faststart.
Poster + posterEnd extracted at encode time. Buffer upgrade one viewport
early; `preload="metadata"` until then. Only two video elements on the page,
never more.

**Images:** AVIF with WebP fallback via `next/image`; explicit `sizes` per
role (`hero` 100vw, `grid` 33vw…); lazy below fold; Act I poster is the only
`priority` asset. Source PNGs (1–5.7 MB) never ship.

**JS/motion:** transform + opacity only; progress through refs (engine
contract); `batchReveal` for every grid; single rAF loop per ScrollVideo
(max two concurrent, and they're never both pinned at once); no
scroll-linked React state anywhere. Fonts: `next/font`, two families max,
`display: swap` — `textReveal` already waits for fonts.

**Verification gate (pre-delivery):** `tsc --noEmit`, lint, build, forbidden-
calls grep, Lighthouse mobile ≥ 90 perf, manual scrub test on a real iOS
Safari and mid-tier Android device.

---

## 7. Mobile behavior (adapt, not strip)

Breakpoint policy: one `md` (768px) motion boundary; layout uses Tailwind
defaults. Motion adaptation is centralized — `config/site.ts` exposes
`motionProfile` consumed by media/ui components, so sections stay
breakpoint-free:

| Concern | Desktop | Mobile |
|---|---|---|
| ScrollVideo pin | 150vh | 100vh, `srcMobile` encode |
| ScrollVideo strategy | scrub | scrub → auto-fallback `"timed"` if device test fails |
| Parallax speed | as authored (≤0.4) | halved |
| Text splits | chars/lines | words/lines |
| Act II layers | base + 2 | base + 1 |
| Amenity grid | 3-col batchReveal | 2-col, `STAGGER.tight` |
| Hover states | full | replaced by in-view states |

Touch/Lenis: engine owns it — no site-level touch handling. Reduced motion:
engine collapses essential motion; site layer only swaps markup where needed
(`ScrollVideo` → poster, count-ups render final numbers).

---

## 8. Open items carried into Phase 3

1. Verify both videos' subjects, then lock `arrival` / `poolReveal` ids and
   re-encode (needs ffmpeg — install or encode elsewhere).
2. Booking mechanism decision (external engine vs. inquiry form → webhook
   vs. WhatsApp) — shapes `Return.tsx` and whether the
   `contact-form-webhook` flow is pulled in.
3. Real stats for `StatTrio` (beach distance, villa count, capacity).
4. Grade remaining ~24 stills into `media.ts` groups during the asset pass.
5. Font pairing selection (ui-ux-pro-max reference pass) before `layout.tsx`.

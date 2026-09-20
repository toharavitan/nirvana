# Nirvana — Tamarindo Boutique Villas
## Experience Blueprint · v1
*Creative direction document. No code until this is approved.*

---

## 1. What we are selling

Not rooms. **Deceleration.**

Nirvana is a walled tropical compound in Tamarindo, Costa Rica: black slatted
gates, a palm-colonnade walkway, L-shaped villas of teak, terrazzo and white stucco
wrapped around a turquoise pool with a palapa daybed. The architecture already
performs a ritual — street → gate → corridor of palms → private water. The
website's job is to reproduce that ritual as a scroll journey, so that by the
time the visitor reaches the booking CTA they have *already arrived* once.

**Positioning:** boutique, adults-calm, design-literate. Closer to a small
Tulum/Uluwatu design hotel than a resort. The visitor we optimize for books
on feeling first, amenities second.

**Emotional target, in order:** intrigue → immersion → exhale → desire → trust → act.

**Conversion goal:** direct booking / inquiry (bypassing OTA commission).

---

## 2. The story: "The Walk In"

The entire page is one continuous physical movement through the property.
Scroll = walking. Every section is a place, not a topic.

```
ACT I    THE APPROACH      street, gate, the name          (intrigue)
ACT II   THE PATH          palm corridor, dappled light    (immersion)
ACT III  THE REVEAL        pool courtyard opens up         (exhale — the money moment)
ACT IV   THE VILLA         living, kitchen, bedrooms       (desire — "I live here")
ACT V    THE RITUALS       palapa, daybed, details         (texture, lifestyle)
ACT VI   TAMARINDO         beach, surf, sunset context     (justification)
ACT VII  THE RETURN        booking — "stay"                (act)
```

---

## 3. Media map

### Videos (both ~4s @ 24fps — ideal scrub length, ~100 frames)

| File | Working name | Assigned role | Status |
|---|---|---|---|
| `6a6e3cd4…279.mp4` (31.5 MB) | `arrival.mp4` | **Act I–II — Hero scroll-scrub.** Scroll drives playback through the entrance/approach. | ⚠ content unverified — confirm subject before final placement |
| `6a6e3dce…954.mp4` (17.7 MB) | `pool-reveal.mp4` | **Act III — Pool reveal scroll-scrub**, pinned section. | ⚠ content unverified — if it's the drone shot, swap the two |

> Both videos must be re-encoded for scrubbing before build: H.264, high
> keyframe density (`-g 8` or all-intra), muted, `playsinline`, ~2–4 Mbps,
> plus a 720p mobile variant. Scrubbing chokes on sparse-keyframe encodes.

### Images (38 stills, verified subjects)

| Group | Representative files | Role |
|---|---|---|
| **Entrance / gate + NIRVANA sign** | `b9090284` | Act I anchor still (also fallback poster for hero video) |
| **Palm walkway** | `74371cc9`, `2e68f119`, `c39f92f5`, `525f8d17` (gate detail) | Act II — layered parallax corridor |
| **Pool + villa wide** | `84de5d04`, `652fae77`, `12826b36` (palapa daybed) | Act III reveal + Act V rituals |
| **Living / kitchen** | `21d393d3`, `3c19082c`, `e0b9753e` (surfboard detail), `9601d3c6` (porthole vanity) | Act IV interiors |
| **Bedrooms** | `075dbd61`, `dd18cd17`, `15f90377` | Act IV — rest chapter |
| Remaining ~24 stills | to be graded into groups during build | supporting grids, gallery, texture cuts |

All PNGs (1–5.7 MB each) get converted to AVIF/WebP via `next/image`;
originals stay as source only. Files move to `public/assets/videos/` and
`src/assets/images/` with semantic names (`entrance-gate.avif`, …) — a
`content/media.ts` map keeps filenames swappable (future-replacement
requirement).

---

## 4. Scroll choreography — section by section

Engine only. No raw ScrollTrigger, no second Lenis. Scroll-video scrub is
built as a site-level component on `watchScrollProgress` (ref-based, no
setState per frame) + `pinSection`.

### 00 · Preloader / first paint
- **Purpose:** set tone in 1s; buy time for hero video buffering.
- **Motion:** wordmark `textReveal` (chars, `EASING.premium`), then curtain
  lifts. No spinner.

### 01 · THE APPROACH — Hero (pinned, ~150vh of scroll)
- **Purpose:** first emotional impression; establish scroll = movement.
- **Media:** `arrival.mp4` scroll-scrubbed 0→100%.
- **Motion:** section pinned via `pinSection`; scroll progress → `currentTime`
  with lerped smoothing (`EASING.none` on the scrub itself).
  Overlaid: "NIRVANA" `textReveal`, then a second line — *"Tamarindo
  Boutique Villas"* — fades as scrolling starts (teaches the mechanic).
  Scroll cue: thin vertical line, breathing loop.
- **Transition out:** final video frame cross-fades into the Act II first
  still (match-cut on the walkway if footage allows).

### 02 · THE PATH — Palm corridor (~200vh)
- **Purpose:** immersion; the compound closes around you.
- **Media:** 3–4 walkway stills as full-bleed layered scenes.
- **Motion:** `imageReveal` wipes for each scene entrance; foreground fronds
  as `parallax` layers (speed ≤ 0.3) to create depth-between-palms;
  `imageZoom` slow push-in on the long corridor shot. Short copy lines
  (`textReveal`, lines) float between scenes: *"Past the gate, the world
  gets quieter."*
- **Transition out:** last corridor image scales up and brightens — you're
  stepping into the light of the courtyard.

### 03 · THE REVEAL — Pool courtyard (pinned, ~150vh) — **the money moment**
- **Purpose:** exhale; the postcard. This is the frame people book.
- **Media:** `pool-reveal.mp4` scroll-scrubbed; wide pool still as poster.
- **Motion:** `pinSection` + scrub identical to hero. At scrub ≥ 80%, UI
  fades in: property one-liner + soft "Explore the villas ↓". Deliberately
  the *only* pinned video after the hero — scarcity keeps both special.

### 04 · THE VILLA — Interiors (~300vh, flowing, un-pinned)
- **Purpose:** desire; project yourself into daily life.
- **Structure:** three chapters — **Live** (living/surfboard/portholes),
  **Cook & gather** (kitchen island), **Rest** (bedrooms).
- **Motion:** editorial rhythm — alternating full-bleed and inset images with
  `imageReveal` + `scaleImage`; `reveal` on copy blocks; `batchReveal` on a
  small amenity grid (AC, fast wifi, king beds, outdoor shower…). Porthole
  windows in the photos become a recurring circular motif in layout accents.
- **Pace note:** this act intentionally scrolls *normally* — after two pinned
  experiences, unrestricted scroll here feels like freedom, not filler.

### 05 · THE RITUALS — Palapa & details (~150vh)
- **Purpose:** texture; the small luxuries that justify "boutique".
- **Media:** palapa daybed, outdoor shower, lounge, detail crops.
- **Motion:** slow `imageZoom` on the daybed hero; a horizontal-feeling
  staggered gallery (`batchReveal`, `STAGGER.loose`); micro-copy in
  `textReveal` words: *"Morning coffee. Afternoon salt. Evening quiet."*

### 06 · TAMARINDO — Context (~100vh)
- **Purpose:** trust/justification; minutes from surf, restaurants, sunset.
- **Media:** warmest exterior stills (no location footage in assets — v1 uses
  property shots + typographic treatment; client beach footage is a v2 slot).
- **Motion:** `parallax` background, `reveal` stat trio (X min to beach,
  villas count, guests) — numbers count up on enter.

### 07 · THE RETURN — Booking CTA (100vh)
- **Purpose:** conversion. One decision, zero noise.
- **Media:** dusk-feel still (or hero video final frame, static).
- **Motion:** near-still. `fadeIn` of a single centered block: *"Stay at
  Nirvana"* → date/inquiry CTA → WhatsApp/direct contact secondary. The
  page's stillness here *is* the design — after 1200vh of motion, calm
  reads as confidence.
- Footer: minimal — address, IG, policies.

---

## 5. Visual direction

- **Palette (from the property itself):** bone/limestone `#EDE8E0`,
  charcoal-black `#111312` (gates/fences), teak amber `#B77A3F`,
  pool turquoise `#2FB6C9` (accent only), palm green kept photographic.
- **Type:** display serif or high-contrast sans with wide tracking for
  wordmark moments (NIRVANA in caps, airy); humanist sans for body. Final
  pairing chosen at build with ui-ux-pro-max reference.
- **Layout motifs:** the circle (porthole windows) as image mask/accent;
  generous whitespace; thin 1px rules echoing the gate slats.
- **Tone of copy:** short, sensory, second person. No resort clichés
  ("escape", "paradise") — the imagery already says it.

## 6. Architecture

```
src/
├── app/                    layout.tsx (SmoothScrollProvider), page.tsx
├── components/
│   ├── sections/           Approach.tsx  Path.tsx  Reveal.tsx  Villa.tsx
│   │                       Rituals.tsx  Tamarindo.tsx  Return.tsx
│   ├── media/              ScrollVideo.tsx   ← the one custom component
│   └── ui/                 Container, Eyebrow, Headline, ScrollCue, Button
├── content/                copy.ts  media.ts (semantic asset map)
└── config/                 site.ts (contact, links)
```

`ScrollVideo.tsx`: `pinSection` for the hold + `watchScrollProgress` →
smoothed `video.currentTime`; `preload="auto"` triggered when section is one
viewport away; `poster` = first-frame still; respects `useReducedMotion`
(reduced → static poster + caption, video skipped).

## 7. Mobile & performance

- Scrub retained on mobile but pin ranges shortened (~100vh) and the 720p
  encodes served; if iOS scrubbing janks in testing, fallback is timed
  playback triggered at section entry — decided by device test, not guess.
- Parallax speeds halved on mobile; `textReveal` drops chars → words.
- Images: AVIF/WebP via `next/image`, lazy below the fold; videos
  lazy-loaded; total above-fold budget < 3 MB.
- 60fps rule: all motion transform/opacity only; progress via refs.

## 8. Open items (pre-build)

1. **Creative brief text** — arrived empty; fold in when provided.
2. **Verify video subjects** (need ffmpeg or manual view) → confirm
   hero vs. pool-reveal assignment; re-encode both for scrubbing.
3. Booking mechanism: external engine link, inquiry form (→ webhook), or
   WhatsApp-first? Affects Act VII only.
4. Real facts for the stat trio (distance to beach, villa count, capacity).
5. Grade remaining ~24 stills into the act groups during asset pass.

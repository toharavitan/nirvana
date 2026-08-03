# @leadstrikes/motion-engine

Internal motion framework for LeadStrikes premium websites.

Smooth scrolling, scroll-driven storytelling, and a shared motion language built
on GSAP + Lenis. Consumed as a dependency by client projects — **never copied
into them, never edited by them.**

---

## Install

The engine is not published to npm. Client projects reference it by path:

```bash
npm install file:../../leadstrikes-motion-engine
npm install gsap lenis @gsap/react
```

GSAP, Lenis and React are **peer dependencies**. This is deliberate: two copies
of GSAP in one app means plugins get registered on an instance the site is not
using, and nothing animates. The site owns exactly one copy.

`next` is an **optional** peer — required only for page transitions, which
import `next/navigation` and `next/link`. Everything else is router-agnostic.

### Turbopack resolution

`file:` installs symlink out to a sibling directory. If the consuming site pins
`turbopack.root` to its own folder, the engine falls outside that root and
Turbopack reports `Module not found` — even though `tsc` resolves it fine. Point
the root at the shared parent instead:

```ts
// next.config.ts
turbopack: { root: path.resolve(__dirname, "../..") },  // the leadstrikes/ folder
```

---

## Setup

Wrap the root layout once. Every page below it gets smooth scroll.

```tsx
// src/app/layout.tsx
import { SmoothScrollProvider } from "@leadstrikes/motion-engine";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
```

That is the entire installation. Plugin registration, the GSAP/Lenis ticker
bridge, and reduced-motion handling are all internal.

---

## Page transitions

The App Router unmounts the outgoing page the moment navigation commits, so
there is no window in which to animate it out. The engine creates that window
with an overlay: cover the viewport, navigate behind it, uncover.

```tsx
<SmoothScrollProvider>
  <PageTransitionProvider variant="curtain" color="#0a0a0a">
    {children}
  </PageTransitionProvider>
</SmoothScrollProvider>
```

Then navigate with `TransitionLink` (a drop-in `next/link`) or
`useTransitionRouter()`:

```tsx
<TransitionLink href="/work">Work</TransitionLink>

const router = useTransitionRouter();
router.push("/work");           // also .replace(), .back(), .isTransitioning
```

A plain `next/link` still works — it just navigates instantly, skipping the
transition.

Variants: `curtain` (panel up from the bottom, away off the top), `slide` (panel
passes through in one direction), `fade` (safest over busy imagery).

Handled for you on every route change: scroll reset (including Lenis's own
position, which Next does not touch), `ScrollTrigger.refresh()` after the new
page lays out, and input blocking so a second click cannot interrupt a
transition mid-flight. Browser back/forward does **not** cover, so history scroll
restoration keeps working. Under reduced motion navigation is immediate and the
overlay never appears.

---

## Using it in a component

```tsx
"use client";

import {
  useGSAPAnimation,
  reveal,
  parallax,
  STAGGER,
} from "@leadstrikes/motion-engine";
import { useRef } from "react";

export function Hero() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAPAnimation(
    () => {
      reveal(".headline", { direction: "up", scroll: true });
      reveal(".stat", { stagger: STAGGER.base, scroll: true });
      parallax(".backdrop", { speed: 0.25 });
    },
    { scope },
  );

  return (
    <section ref={scope}>
      <div className="backdrop" />
      <h1 className="headline">…</h1>
    </section>
  );
}
```

Three rules:

1. **Always use `useGSAPAnimation`**, never a raw `useEffect`. It reverts every
   animation and ScrollTrigger on unmount and survives React Strict Mode's
   double-invoke without duplicating triggers.
2. **Always pass `scope`.** Without it, `".headline"` matches headlines in other
   components too.
3. **Always use the tokens.** Never type a raw duration or ease.

---

## The motion language

The tokens are the point of the engine. A site that pulls every timing from
`DURATION` and every curve from `EASING` reads as one designed system.

| `DURATION` | s | Use |
|---|---|---|
| `fast` | 0.4 | Hovers, button states, cursor feedback |
| `base` | 0.8 | Default for most UI transitions |
| `slow` | 1.2 | Deliberate, weighty section changes |
| `reveal` | 1.6 | Hero and headline entrances |

| `EASING` | GSAP | Use |
|---|---|---|
| `soft` | `power2.out` | Gentle settle, small UI moves |
| `premium` | `expo.out` | The signature curve — fast out, long arrival |
| `dramatic` | `power4.inOut` | Cinematic, full-section and pinned transitions |
| `smooth` | `power1.inOut` | Symmetrical; loops and continuous motion |
| `none` | `none` | **Required** for anything scrubbed to scroll |

Also `STAGGER` (`tight` / `base` / `loose`) and `DISTANCE` (`sm` / `md` / `lg`).

---

## API

### Animation primitives

All take `(target, options)`. `target` accepts a selector, an element, or a
React ref directly. All accept `scroll` — `true` for sensible reveal defaults,
or an object to customise the range.

| | |
|---|---|
| `fadeIn` / `fadeOut` | Opacity, via `autoAlpha` so hidden elements stop catching clicks |
| `reveal` | Slide + fade. The default section entrance |
| `textReveal` / `splitTextAnimation` | Per line, word, or character via SplitText. Waits for fonts. Returns a cleanup function |
| `parallax` | Scroll-rate offset, in percent of the element's own size |
| `scaleImage` | Settles from a larger scale as it enters |
| `imageZoom` | Continuous scale across the scroll range |
| `imageReveal` | `clip-path` wipe with a counter-scale |
| `pinSection` | Holds a section fixed, optionally scrubbing a timeline |
| `batchReveal` | Grid/list reveals. One batched trigger instead of N |

### Page transitions

`PageTransitionProvider`, `TransitionLink`, `useTransitionRouter`,
`TRANSITION_DEFAULTS`. See the section above.

### Scroll utilities

`createScrollAnimation` (the escape hatch for anything the primitives don't
express), `watchScrollProgress`, `watchPageScrollProgress`,
`getPageScrollProgress`, `refreshScrollTriggers`, `killScrollTriggers`.

### Hooks

`useGSAPAnimation`, `useLenis`, `useLenisScroll`, `useScrollTo`,
`useScrollProgress`, `usePageScrollProgress`, `useParallax`, `useReducedMotion`.

Progress hooks report through a **ref, not state** — a scroll handler that calls
`setState` re-renders every frame and will not hold 60fps.

### Escape hatch

`gsap`, `ScrollTrigger` and `SplitText` are re-exported. A site needing
something bespoke uses these directly rather than editing the engine.

---

## Accessibility

`prefers-reduced-motion` is honoured automatically, and the engine draws a
distinction that matters:

- **Essential** motion carries content into view (`reveal`, `fadeIn`,
  `textReveal`, `scaleImage`). Under reduced motion the timings collapse to
  zero — the content still arrives, it just does not travel. Skipping these
  would leave the page blank.
- **Decorative** motion has no destination; the movement *is* the effect
  (`parallax`, `imageZoom`, `pinSection`). Under reduced motion it is not
  created at all. Pinning in particular is a usability problem, not a
  decoration.

Smooth scrolling is disabled entirely; native scrolling takes over.

Progress observers keep running — reading scroll position is measurement, not
motion, so a reading-progress bar still works.

---

## Performance

- Transform and opacity only. No animated `top`/`left`/`width`, so nothing
  triggers layout.
- `force3D: "auto"` GPU-promotes elements only while they animate, so long-lived
  compositing layers do not leave text blurry after a tween settles.
- One rAF loop. GSAP's ticker drives Lenis; `lagSmoothing(0)` stops GSAP
  fast-forwarding scroll after a dropped frame.
- `batchReveal` for lists — 40 individual ScrollTriggers means 40 sets of
  start/end calculations on every refresh.
- Everything reverts on unmount via `useGSAPAnimation`.

---

## Configuration

The supported way to change engine behaviour. Call once at startup — client
projects should never need to edit engine source.

```ts
import { configureMotion } from "@leadstrikes/motion-engine";

configureMotion({
  markers: process.env.NODE_ENV === "development", // ScrollTrigger markers
  defaultDuration: 1,
  defaultEase: "power3.out",
  respectReducedMotion: true, // do not disable
});
```

Markers are forced off in production builds regardless of this setting.

---

## Development

```bash
npm run typecheck   # strict tsc, no emit
npm run build       # tsup -> dist (ESM + CJS + .d.ts)
npm run dev         # watch mode
```

Notes for anyone changing the build:

- `treeshake` is **off** on purpose. tsup's treeshake runs the bundle through
  rollup, which strips module-level directives and silently drops the
  `"use client"` banner — breaking the package in the Next.js App Router.
  Consumers tree-shake via `sideEffects: false`.
- Peers must stay in `external`. See the note under Install.

---

## Versioning

Semver. The public surface is **only** what `src/index.ts` exports; anything
else is internal and may change in a patch.

- **patch** — fixes, tuning that does not change an API
- **minor** — new primitives, hooks, or options
- **major** — changed signatures, or retuned tokens (a token change alters the
  feel of every site consuming it — treat it as breaking)

Bump `version` in `package.json` and tag before client projects re-install.

### Changelog

- **0.2.0** — Page transitions: `PageTransitionProvider`, `TransitionLink`,
  `useTransitionRouter`. Adds `next` as an optional peer dependency.
- **0.1.0** — Initial: smooth scroll, 9 motion primitives, scroll utilities,
  React hooks, reduced-motion policy.

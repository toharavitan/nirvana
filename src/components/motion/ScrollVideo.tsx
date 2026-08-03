"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";

import {
  EASING,
  createScrollAnimation,
  gsap,
  pinSection,
  useGSAPAnimation,
  useReducedMotion,
} from "@leadstrikes/motion-engine";

import type { ScrollVideoSource } from "@/content/media";

interface ScrollVideoProps {
  source: ScrollVideoSource;
  /**
   * How much scroll the clip is stretched across, as a ScrollTrigger end value.
   * Longer feels slower and more deliberate; shorter feels urgent.
   */
  scrollLength?: string;
  /**
   * Overlay content. Pinned with the section, so it travels with the frame.
   *
   * Two marker attributes choreograph copy against the playhead:
   *
   * - `data-overlay-out` — present on entry, clears as the camera starts to
   *   move. For a title that should not follow you down.
   * - `data-overlay-in` — arrives once the camera is inside (after the seam
   *   at 0.5). For copy that is a response to what you have just watched.
   *
   * Unmarked children are simply held for the whole range.
   */
  children?: ReactNode;
  /** Darkens the footage so overlaid type stays legible. */
  scrim?: boolean;
  className?: string;
}

/**
 * A clip whose playhead is driven by scroll position rather than by time.
 *
 * The section pins, and the distance scrolled across that pin maps onto the
 * video's `currentTime`. Scrolling back runs the camera backwards. The effect
 * is that the visitor is moving the camera themselves.
 *
 * Built on `pinSection` and `createScrollAnimation` — the engine's own
 * primitives. Nothing here registers a plugin, constructs a ScrollTrigger
 * directly, or touches Lenis.
 *
 * Three things make this smooth rather than stuttery:
 *
 * 1. The clips are re-encoded all-intra by `scripts/prepare-videos.mjs`, so any
 *    `currentTime` is a keyframe and seeking is effectively free.
 * 2. Seeks are skipped while one is already in flight — assigning `currentTime`
 *    mid-seek is silently dropped by some browsers, which reads as a freeze.
 * 3. The file only begins downloading a viewport before it is needed, so the
 *    top of the page is not competing with a 31 MB request.
 */
export function ScrollVideo({
  source,
  scrollLength = "+=200%",
  children,
  scrim = true,
  className = "",
}: ScrollVideoProps) {
  const scope = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAPAnimation(
    () => {
      const video = videoRef.current;
      const section = scope.current;
      if (!video || !section) return;

      // The rendition is chosen here rather than with <source media="…">
      // because browsers only honour media queries on <source> inside
      // <picture> — inside <video> the attribute is ignored and the first
      // playable file wins, which would hand desktops the mobile encode.
      if (!video.src) {
        video.src = window.matchMedia("(max-width: 768px)").matches
          ? source.mobile
          : source.desktop;
      }

      // Start fetching one viewport out. `preload="none"` in the markup keeps
      // this off the critical path until the visitor is actually heading here.
      createScrollAnimation({
        trigger: section,
        start: "top bottom+=100%",
        end: "bottom top",
        once: true,
        onEnter: () => {
          video.preload = "auto";
          video.load();
        },
      });

      // Half a frame at 24fps. Below this the seek is imperceptible and only
      // costs a decode.
      const MIN_STEP = 1 / 48;

      const playhead = { time: 0 };

      const seek = () => {
        if (video.seeking || video.readyState < 2) return;

        const duration = Number.isFinite(video.duration)
          ? video.duration
          : source.duration;
        const target = Math.min(playhead.time, duration - MIN_STEP);

        if (Math.abs(video.currentTime - target) > MIN_STEP) {
          video.currentTime = target;
        }
      };

      const timeline = gsap.timeline({ paused: true });
      timeline.to(playhead, {
        time: source.duration,
        duration: 1,
        ease: EASING.none,
        onUpdate: seek,
      });

      // The video only produces 24 discrete frames a second, but a transform
      // interpolates at display refresh rate. Drifting the layer's scale
      // across the whole range means something is always moving smoothly
      // between frame steps — the camera reads as gliding, not ticking. The
      // move mirrors the footage: settling out of the descent, then a slow
      // push forward once the walk begins. Transform-only, so it stays on
      // the compositor.
      timeline.fromTo(
        video,
        { scale: 1.12, transformOrigin: "50% 40%" },
        { scale: 1, duration: 0.5, ease: EASING.none },
        0,
      );
      timeline.to(
        video,
        { scale: 1.08, transformOrigin: "50% 50%", duration: 0.5, ease: EASING.none },
        0.5,
      );

      // Overlays ride the same timeline rather than getting triggers of their
      // own. A second trigger on a pinned element measures against a position
      // GSAP is already controlling, and the two drift apart.
      //
      // Timing is written against the concatenated clip: descent 0–0.12,
      // walkway 0.12–0.25, approach to the villa door 0.25–0.37, pool
      // reveal 0.37–0.50, living room 0.50–0.62, kitchen 0.62–0.75,
      // bedroom 0.75–0.87, back out to the pool 0.87–1. The title clears
      // while the camera is still high; the copy arrives once the visitor
      // is through the main gate and clears again before the private gate
      // opens — everything from the pool inward plays wordless, because
      // the payoff needs no caption.
      const out = section.querySelector("[data-overlay-out]");
      if (out) {
        timeline.fromTo(
          out,
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -60, duration: 0.18, ease: EASING.none },
          0.06,
        );
      }

      const arriving = section.querySelector("[data-overlay-in]");
      if (arriving) {
        timeline.fromTo(
          arriving,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.07, ease: EASING.none },
          0.16,
        );
        timeline.to(
          arriving,
          { autoAlpha: 0, y: -40, duration: 0.06, ease: EASING.none },
          0.33,
        );
      }

      pinSection(section, {
        animation: timeline,
        start: "top top",
        end: scrollLength,
        // Catch-up smooths the mapping without the playhead ever feeling
        // detached from the scroll. A full second of lag also absorbs the
        // discrete wheel steps a desktop mouse produces, which otherwise
        // read as the video ticking forward.
        scrub: 1,
      });
    },
    { scope, dependencies: [reducedMotion, scrollLength] },
  );

  return (
    <section
      ref={scope}
      className={`relative h-svh w-full overflow-hidden bg-ink ${className}`}
    >
      {reducedMotion ? (
        // Motion is the entire point of this section, so there is nothing to
        // collapse to a shorter duration — the honest fallback is the frame
        // itself, with the copy still fully present over it.
        <Image
          src={source.poster}
          alt={source.description}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover will-change-transform [filter:saturate(1.07)_contrast(1.04)]"
          poster={source.poster}
          preload="none"
          muted
          playsInline
          disablePictureInPicture
          aria-label={source.description}
        />
      )}

      {scrim ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/20 to-ink/65"
        />
      ) : null}

      {/*
        The grade. A soft edge vignette and a static grain field, both cheap
        composited layers. The grain matters more than it looks like it
        should: dithering breaks up the flat gradients where H.264 banding
        and macroblocking live, so the footage reads as filmic rather than
        compressed.
      */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 115% at 50% 45%, transparent 60%, rgba(20,25,26,0.45) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
      />

      {children ? (
        <div className="relative h-full w-full">{children}</div>
      ) : null}
    </section>
  );
}

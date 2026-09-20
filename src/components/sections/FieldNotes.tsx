"use client";

import Image from "next/image";
import { useRef } from "react";

import {
  DURATION,
  EASING,
  STAGGER,
  parallax,
  reveal,
  scaleImage,
  textReveal,
  useGSAPAnimation,
} from "@leadstrikes/motion-engine";

import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline, Lead } from "@/components/ui/Typography";
import { fieldNotes } from "@/content/site";

import costaRicaMap from "@/assets/decor/costa-rica-map.png";
import orchid from "@/assets/decor/orchid.png";

/**
 * A short aside on the region rather than the property.
 *
 * Two images sit fully on-screen at the outer margins of a centered text
 * column — the orchid on the left, paired with the guaria morada paragraph;
 * the 1880s survey on the right, paired with the boundary paragraph. Both
 * settle into place on entrance, then drift upward on their own scroll rate,
 * behind the content rather than competing with it.
 *
 * Deliberately transform-only, and deliberately restrained: only two elements
 * carry `will-change`, because a promoted compositor layer has a real memory
 * cost and this section doesn't need six of them. Nothing here writes to the
 * DOM on scroll — parallax and reveal both animate compositor properties
 * (transform, opacity) through GSAP's own ticker, not React state, so
 * scrolling never triggers a re-render or a layout pass.
 */
export function FieldNotes() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAPAnimation(() => {
    const cleanup = textReveal(".fieldnotes-headline", {
      split: "lines",
      scroll: true,
    });

    reveal(".fieldnotes-body", { stagger: STAGGER.base, scroll: true });

    // Entrance: settles into place from a slightly larger scale, the same
    // treatment the site already uses on photography (see Essence, Location).
    // Essential motion — collapses to the end state under reduced motion
    // rather than disappearing.
    scaleImage(".fieldnotes-side", {
      from: 1.15,
      duration: DURATION.reveal,
      ease: EASING.premium,
      scroll: true,
    });

    // Continuous drift once in view — decorative, skipped under reduced
    // motion. Different speeds so the two planes read as depth rather than
    // moving together as one flat background.
    parallax(".fieldnotes-side-left", { speed: 0.22 });
    parallax(".fieldnotes-side-right", { speed: 0.15 });

    return cleanup;
  }, { scope });

  return (
    <section
      ref={scope}
      className="relative isolate overflow-hidden bg-sand py-32 sm:py-48"
      id="notes"
    >
      {/*
        Background layer, behind the text (z-0). Vertical centering is done
        with flex on a static wrapper rather than a transform, so it never
        fights the GSAP-driven transform on the child — GSAP owns that
        element's transform outright and setting yPercent would silently wipe
        out any CSS translate placed on the same node.
      */}
      {/*
        Hidden below lg: at narrower widths there isn't enough margin outside
        the text column for either image to sit purely in the background —
        they'd overlap the copy instead of framing it. Same call this site
        already makes for Essence's porthole accent.

        Fully inset from the viewport edge at every breakpoint (no negative
        left/right offset) so the whole image is on-screen — sizes were
        recalculated against the actual measured text-column position
        (Container "narrow" = max-w-2xl, centered, plus its own px-10 padding)
        with margin to spare at each breakpoint's own lower bound, not just
        eyeballed to look right at one width.
      */}
      <div
        className="pointer-events-none absolute inset-y-0 left-8 z-0 hidden w-40 items-center lg:flex xl:left-12 xl:w-64 2xl:left-16 2xl:w-80"
        aria-hidden
      >
        <div className="fieldnotes-side fieldnotes-side-left will-change-transform">
          <Image
            src={orchid}
            alt=""
            sizes="(min-width: 1536px) 20rem, (min-width: 1280px) 16rem, 10rem"
            className="w-full"
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 right-8 z-0 hidden w-40 items-center lg:flex xl:right-12 xl:w-64 2xl:right-16 2xl:w-80"
        aria-hidden
      >
        <div className="fieldnotes-side fieldnotes-side-right will-change-transform">
          <Image
            src={costaRicaMap}
            alt=""
            sizes="(min-width: 1536px) 20rem, (min-width: 1280px) 16rem, 10rem"
            className="w-full"
          />
        </div>
      </div>

      <Container width="narrow" className="relative z-10">
        <Eyebrow index="06" className="text-clay">
          {fieldNotes.eyebrow}
        </Eyebrow>

        <Headline accent={2} className="fieldnotes-headline mt-6 text-ink">
          {fieldNotes.headline}
        </Headline>

        <div className="mt-8 space-y-6">
          {fieldNotes.body.map((paragraph) => (
            <Lead key={paragraph.slice(0, 24)} className="fieldnotes-body text-clay">
              {paragraph}
            </Lead>
          ))}
        </div>

        <p className="mt-10 border-t hairline pt-6 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-stone">
          {fieldNotes.caption}
        </p>
      </Container>
    </section>
  );
}

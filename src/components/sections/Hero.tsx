"use client";

import { useRef } from "react";

import {
  DURATION,
  EASING,
  STAGGER,
  fadeIn,
  textReveal,
  useGSAPAnimation,
  useScrollTo,
} from "@leadstrikes/motion-engine";

import { ScrollVideo } from "@/components/motion/ScrollVideo";
import { Container } from "@/components/ui/Container";
import { VIDEO } from "@/content/media";
import { hero, threshold } from "@/content/site";

/**
 * The opening move, unbroken.
 *
 * One pinned section scrubs the full journey clip: the camera descends over
 * the bay, past the rooftops, lands at the gate — and keeps going, through it
 * and down the palm walkway. The wordmark holds for the first moment of the
 * descent and then clears, because the arrival is the content and the type is
 * only the introduction to it. Once the camera is inside, the copy arrives as
 * a reaction to the quiet.
 */
export function Hero() {
  const scope = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo();

  useGSAPAnimation(() => {
    // Entrance only — the scroll-linked behaviour belongs to ScrollVideo.
    const cleanup = textReveal(".hero-title", {
      split: "chars",
      duration: DURATION.reveal,
      stagger: STAGGER.tight,
      ease: EASING.dramatic,
    });

    fadeIn(".hero-meta", {
      duration: DURATION.slow,
      delay: 0.7,
      stagger: STAGGER.base,
    });

    return cleanup;
  }, { scope });

  return (
    <ScrollVideo source={VIDEO.journey} scrollLength="+=1700%">
      <div ref={scope} className="h-full w-full">
        {/*
          The plate frame: a hairline inset that holds through the whole
          journey. It turns the footage from a background into a mounted
          print, and it costs one border.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-4 hidden border border-bone/15 sm:block"
        />

        <span className="hero-meta absolute left-8 bottom-8 hidden font-sans text-[0.6rem] tracking-[0.3em] text-bone/40 sm:block">
          {hero.coordinates}
        </span>

        <div
          data-overlay-out
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          {/*
            A pool of shade behind the wordmark. The footage under the title
            is bright rooftops and white buildings; without this the type
            dissolves into them. It fades out with the title, so the footage
            is never darkened once the words are gone.
          */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(52%_42%_at_50%_48%,rgba(20,25,26,0.5),transparent_72%)]"
          />

          <p
            className="hero-meta relative font-sans text-[0.7rem] font-medium uppercase tracking-[0.34em] text-bone/80 [text-shadow:0_1px_24px_rgba(20,25,26,0.8)]"
            data-reveal
          >
            {hero.eyebrow}
          </p>

          <h1 className="hero-title relative mt-6 font-display text-[length:var(--text-display)] font-light leading-[0.9] tracking-[0.06em] text-bone uppercase [text-shadow:0_2px_60px_rgba(20,25,26,0.7)]">
            {hero.title}
          </h1>

          <p
            className="hero-meta relative mt-6 max-w-md font-sans text-base font-light leading-relaxed text-bone/85 text-pretty [text-shadow:0_1px_20px_rgba(20,25,26,0.8)]"
            data-reveal
          >
            {hero.subtitle}
          </p>

          <button
            type="button"
            onClick={() => scrollTo("#villas")}
            className="hero-meta relative mt-10 cursor-pointer border border-bone/40 px-8 py-3.5 font-sans text-[0.68rem] uppercase tracking-[0.28em] text-bone transition-all duration-300 hover:border-teak-light hover:bg-teak-light hover:text-ink"
            data-reveal
          >
            {hero.cta}
          </button>

          <span
            className="hero-meta absolute bottom-10 font-sans text-[0.65rem] uppercase tracking-[0.3em] text-bone/50"
            data-reveal
          >
            {hero.scrollHint}
          </span>
        </div>

        <div
          data-overlay-in
          className="absolute inset-0 flex items-end pb-24 sm:items-center sm:pb-0"
        >
          <Container width="wide">
            <div className="max-w-xl">
              <p className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.28em] text-bone/60">
                {threshold.eyebrow}
              </p>

              <h2 className="mt-5 font-display text-[length:var(--text-headline)] font-light leading-[1.05] text-bone text-balance">
                {threshold.headline}
              </h2>

              <p className="mt-6 font-sans text-base font-light leading-[1.75] text-bone/75 text-pretty">
                {threshold.body}
              </p>
            </div>
          </Container>
        </div>
      </div>
    </ScrollVideo>
  );
}

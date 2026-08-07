"use client";

import Image from "next/image";
import { useRef } from "react";

import {
  DURATION,
  EASING,
  STAGGER,
  fadeIn,
  reveal,
  useGSAPAnimation,
  useScrollTo,
} from "@leadstrikes/motion-engine";

import { ScrollVideo } from "@/components/motion/ScrollVideo";
import { Container } from "@/components/ui/Container";
import { VIDEO } from "@/content/media";
import { hero, threshold } from "@/content/site";

import nirvanaWordmark from "@/assets/nirvana-wordmark.png";

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
    // The wordmark is now the logo's own artwork rather than live text, so it
    // can't be split into characters; a single rise-and-fade stands in for
    // the previous per-letter cascade.
    reveal(".hero-title", {
      direction: "up",
      distance: 24,
      duration: DURATION.reveal,
      ease: EASING.dramatic,
    });

    fadeIn(".hero-meta", {
      duration: DURATION.slow,
      delay: 0.7,
      stagger: STAGGER.base,
    });
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

          {/*
            The logo's own wordmark artwork rather than live text set in the
            site's serif — matches the mark exactly rather than approximating
            its (likely bespoke) lettering with a web font. Sized against the
            same clamp() the live text used, so it holds the same responsive
            scale the design already tuned. The tight drop-shadow (in addition
            to the shade pool behind it) is deliberately closer and darker
            than the site's usual text-shadow: these are hairline strokes, and
            a soft wide shadow alone wasn't enough to hold them against bright
            footage.
          */}
          <h1 className="hero-title relative mt-6">
            <Image
              src={nirvanaWordmark}
              alt={hero.title}
              priority
              className="h-[clamp(3rem,11vw,10rem)] w-auto [filter:drop-shadow(0_2px_50px_rgba(20,25,26,0.75))_drop-shadow(0_0_14px_rgba(20,25,26,0.65))]"
            />
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

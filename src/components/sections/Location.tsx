"use client";

import Image from "next/image";
import { useRef } from "react";

import {
  STAGGER,
  imageZoom,
  reveal,
  textReveal,
  useGSAPAnimation,
} from "@leadstrikes/motion-engine";

import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline, Lead } from "@/components/ui/Typography";
import { image } from "@/content/media";
import { location } from "@/content/site";

/**
 * Where it actually is.
 *
 * The aerial is the one photograph that answers the question every enquiry
 * asks — how far is the beach — so it runs full-bleed and holds a slow zoom
 * across its whole scroll range, pulling the visitor gently toward the bay in
 * the background.
 */
export function Location() {
  const scope = useRef<HTMLDivElement>(null);
  const aerial = image("aerial-tamarindo");

  useGSAPAnimation(() => {
    // Continuous across the section rather than a one-shot entrance: the drift
    // is what makes a static aerial feel like a camera still moving.
    imageZoom(".location-image", { from: 1.05, to: 1.22 });

    const cleanup = textReveal(".location-headline", { split: "lines", scroll: true });
    reveal(".location-copy", { scroll: true });
    reveal(".location-distance", { stagger: STAGGER.tight, scroll: true });

    return cleanup;
  }, { scope });

  return (
    <section ref={scope} className="relative isolate bg-ink" id="location">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={aerial.src}
          alt={aerial.alt}
          fill
          sizes="100vw"
          className="location-image object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-ink/65" />
      </div>

      <Container width="wide" className="relative py-32 sm:py-48">
        <div className="max-w-2xl">
          <Eyebrow index="05" className="text-bone/60">
            {location.eyebrow}
          </Eyebrow>

          <Headline accent={4} className="location-headline mt-6 text-bone">
            {location.headline}
          </Headline>

          <Lead className="location-copy mt-8 text-bone/75" data-reveal>
            {location.body}
          </Lead>
        </div>

        <dl className="mt-20 grid gap-x-10 gap-y-10 border-t border-bone/15 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {location.distances.map((entry) => (
            <div key={entry.label} className="location-distance" data-reveal>
              <dt className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-bone/50">
                {entry.label}
              </dt>
              <dd className="mt-3 font-display text-4xl font-light text-bone sm:text-5xl">
                {entry.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

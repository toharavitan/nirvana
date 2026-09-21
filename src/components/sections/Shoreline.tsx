"use client";

import Image from "next/image";
import { useRef } from "react";

import {
  reveal,
  textReveal,
  useGSAPAnimation,
} from "@leadstrikes/motion-engine";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Typography";

import tamarindoShore from "@/assets/darcy-calvin-AHhpyT3fFkU-unsplash.jpg";

/**
 * The shoreline — its own section. A few words, then the aerial of Playa
 * Tamarindo beneath them: the beach the whole stay is built around.
 */
export function Shoreline() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAPAnimation(() => {
    const cleanup = textReveal(".shore-headline", { split: "lines", scroll: true });
    reveal(".shore-copy", { scroll: true });
    return cleanup;
  }, { scope });

  return (
    <section ref={scope} className="bg-bone py-24 sm:py-32" id="shoreline">
      <Container width="wide">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text — left */}
          <div className="max-w-xl">
            <Eyebrow index="—">The shoreline</Eyebrow>
            <h2 className="shore-headline mt-6 font-rector text-4xl font-normal leading-[1.12] text-ink text-balance sm:text-5xl">
              The Pacific, a short walk from the gate.
            </h2>
            <p className="shore-copy mt-8 font-sans text-base font-light leading-[1.8] text-clay text-pretty" data-reveal>
              Playa Tamarindo curves for two kilometres along the bay — the
              town&rsquo;s surf break, calm swimming water, and a sunset over the
              ocean most evenings. From Nirvana it is a short, shaded walk: leave
              the villa in flip&#8209;flops and you are on the sand before the
              ice in your glass has melted.
            </p>
          </div>

          {/* Image — right. 16:9 to match the photo's native ratio, so the
              green shoreline isn't cropped away by a narrower frame. */}
          <figure className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={tamarindoShore}
              alt="Aerial view of Playa Tamarindo — the bay, golden sand and the Pacific"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="shore-image object-cover"
            />
          </figure>
        </div>
      </Container>
    </section>
  );
}

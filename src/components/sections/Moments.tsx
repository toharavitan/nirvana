"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";

import {
  STAGGER,
  batchReveal,
  textReveal,
  useGSAPAnimation,
} from "@leadstrikes/motion-engine";

import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline } from "@/components/ui/Typography";

import signpost from "@/assets/decor/cr-signpost.jpg";
import sloth from "@/assets/decor/cr-sloth.jpg";
import waterfall from "@/assets/decor/cr-waterfall.jpg";
import surfboards from "@/assets/decor/cr-surfboards.jpg";
import beach from "@/assets/decor/cr-beach.jpg";

const PHOTOS: { src: StaticImageData; caption: string }[] = [
  { src: signpost, caption: "In town" },
  { src: sloth, caption: "The wildlife" },
  { src: waterfall, caption: "Waterfalls" },
  { src: surfboards, caption: "The surf" },
  { src: beach, caption: "The Pacific" },
];

/**
 * A horizontal strip of Tamarindo moments — a breath of the place between the
 * introduction and the map. Scrolls sideways on narrow screens.
 */
export function Moments() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAPAnimation(() => {
    const cleanup = textReveal(".moments-headline", { split: "lines", scroll: true });
    batchReveal(".moment-tile", { stagger: STAGGER.tight });
    return cleanup;
  }, { scope });

  return (
    <section ref={scope} className="bg-bone py-24 sm:py-32">
      <Container width="wide">
        <div className="max-w-2xl">
          <Eyebrow index="—">Tamarindo</Eyebrow>
          <Headline accent={2} className="moments-headline mt-6 text-ink">
            A few moments.
          </Headline>
        </div>
      </Container>

      {/* Full-bleed strip: padded to the container on the left, running off the
          right edge to invite the sideways scroll. */}
      <div className="mt-12 overflow-x-auto sm:mt-16">
        <ul className="flex gap-3 px-6 sm:gap-4 sm:px-10 lg:px-[max(2.5rem,calc((100vw-100rem)/2+2.5rem))]">
          {PHOTOS.map((photo) => (
            <li
              key={photo.caption}
              className="moment-tile group relative aspect-[3/4] w-56 shrink-0 overflow-hidden bg-limestone sm:w-64 lg:w-72"
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                fill
                sizes="288px"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent"
              />
              <span className="absolute bottom-4 left-4 font-sans text-[0.62rem] uppercase tracking-[0.22em] text-bone">
                {photo.caption}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useRef } from "react";

import {
  STAGGER,
  imageReveal,
  parallax,
  reveal,
  textReveal,
  useGSAPAnimation,
} from "@leadstrikes/motion-engine";

import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline, Lead } from "@/components/ui/Typography";
import { image, type ImageKey } from "@/content/media";
import { villa } from "@/content/site";

interface ChapterProps {
  index: number;
  title: string;
  body: string;
  imageKey: ImageKey;
  detailKey: ImageKey;
}

/**
 * Each chapter pairs its photograph with a smaller detail plate from the same
 * room, offset over the corner — the way an architecture monograph sets a
 * material close-up against the elevation it belongs to.
 */
const DETAILS: Record<string, ImageKey> = {
  "bedroom-poolside": "bedroom-hall",
  "living-room": "living-detail",
  kitchen: "kitchen-detail",
  "pool-palapa": "pool-daybed",
};

/**
 * One room, one photograph, one thought.
 *
 * Chapters alternate sides down the page. The alternation is what stops four
 * near-identical blocks from reading as a list — the eye is handed across the
 * page rather than dropped down a column.
 */
function Chapter({ index, title, body, imageKey, detailKey }: ChapterProps) {
  const scope = useRef<HTMLDivElement>(null);
  const photo = image(imageKey);
  const detail = image(detailKey);
  const flipped = index % 2 === 1;
  const numeral = String(index + 1).padStart(2, "0");

  useGSAPAnimation(() => {
    imageReveal(".chapter-image", {
      direction: flipped ? "right" : "left",
      scroll: true,
    });
    parallax(".chapter-image", { speed: 0.1 });

    // The detail plate drifts faster than the photograph beneath it; the
    // numeral slower. Three rates, three planes.
    reveal(".chapter-detail", { direction: "up", scroll: true });
    parallax(".chapter-detail", { speed: 0.2 });
    parallax(".chapter-numeral", { speed: 0.14 });

    const cleanup = textReveal(".chapter-title", { split: "lines", scroll: true });
    reveal(".chapter-copy", { stagger: STAGGER.base, scroll: true });

    return cleanup;
  }, { scope });

  return (
    <div
      ref={scope}
      className="grid items-center gap-10 lg:grid-cols-12 lg:gap-20"
    >
      <div
        className={`relative lg:col-span-7 ${flipped ? "lg:order-2" : "lg:order-1"}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-limestone">
          <div className="chapter-image absolute inset-x-0 -inset-y-[7%]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        </div>

        <div
          className={`chapter-detail absolute -bottom-10 hidden w-36 ring-8 ring-sand lg:block xl:w-44 ${
            flipped ? "-left-8 xl:-left-12" : "-right-8 xl:-right-12"
          }`}
          data-reveal
        >
          <div className="relative aspect-square overflow-hidden bg-limestone">
            <Image
              src={detail.src}
              alt={detail.alt}
              fill
              sizes="11rem"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div
        className={`relative lg:col-span-5 ${flipped ? "lg:order-1" : "lg:order-2"}`}
      >
        <span
          aria-hidden
          className="ghost-numeral chapter-numeral absolute -top-16 -left-4 sm:-top-20"
        >
          {numeral}
        </span>

        <div className="relative">
          <span className="font-sans text-[0.7rem] uppercase tracking-[0.28em] text-teak">
            {numeral}
          </span>

          <h3 className="chapter-title mt-4 font-display text-[length:var(--text-title)] font-light leading-tight text-ink">
            {title}
          </h3>

          <Lead className="chapter-copy mt-5" data-reveal>
            {body}
          </Lead>
        </div>
      </div>
    </div>
  );
}

export function Villas() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAPAnimation(() => {
    const cleanup = textReveal(".villas-headline", { split: "lines", scroll: true });
    reveal(".villas-eyebrow", { scroll: true });
    return cleanup;
  }, { scope });

  return (
    <section ref={scope} className="bg-sand py-28 sm:py-40" id="villas">
      <Container width="wide">
        <header className="max-w-2xl">
          <Eyebrow index="02" className="villas-eyebrow" data-reveal>
            {villa.eyebrow}
          </Eyebrow>
          <Headline accent={2} className="villas-headline mt-6 text-ink">
            {villa.headline}
          </Headline>
        </header>

        <div className="mt-24 space-y-32 sm:mt-32 sm:space-y-44">
          {villa.chapters.map((chapter, index) => (
            <Chapter
              key={chapter.title}
              index={index}
              title={chapter.title}
              body={chapter.body}
              imageKey={chapter.image}
              detailKey={DETAILS[chapter.image] ?? chapter.image}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

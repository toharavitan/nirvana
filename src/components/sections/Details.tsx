"use client";

import { useRef } from "react";

import {
  STAGGER,
  batchReveal,
  textReveal,
  useGSAPAnimation,
} from "@leadstrikes/motion-engine";

import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline } from "@/components/ui/Typography";
import { details } from "@/content/site";

/**
 * The practical section — set on the dark ground so it reads as a change of
 * register after the warmth of the villa chapters.
 *
 * Batched rather than eight individual triggers: one set of start/end
 * calculations per refresh instead of eight, and the stagger actually reads
 * across the grid rather than firing row by row.
 */
export function Details() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAPAnimation(() => {
    const cleanup = textReveal(".details-headline", { split: "lines", scroll: true });
    batchReveal(".detail-item", { stagger: STAGGER.tight });
    return cleanup;
  }, { scope });

  return (
    <section ref={scope} className="bg-ink py-28 text-bone sm:py-40" id="details">
      <Container width="wide">
        <header className="relative max-w-2xl">
          <span aria-hidden className="ghost-numeral ghost-numeral--light absolute -top-14 -left-6">
            03
          </span>
          <div className="relative">
            <Eyebrow index="03" className="text-stone">
              {details.eyebrow}
            </Eyebrow>
            <Headline className="details-headline mt-6 text-bone">
              {details.headline}
            </Headline>
          </div>
        </header>

        <ul className="mt-20 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {details.items.map((item, index) => (
            <li
              key={item.title}
              className="detail-item group border-t border-bone/15 pt-6 transition-colors duration-500 hover:border-teak-light/60"
            >
              <span className="font-sans text-[0.65rem] tracking-[0.22em] text-teak-light/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-2xl font-light text-bone">
                {item.title}
              </h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-bone/60 text-pretty">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useRef } from "react";

import {
  EASING,
  STAGGER,
  createScrollAnimation,
  gsap,
  imageReveal,
  parallax,
  reveal,
  textReveal,
  useGSAPAnimation,
} from "@leadstrikes/motion-engine";

import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline, Lead } from "@/components/ui/Typography";
import { image } from "@/content/media";
import { essence } from "@/content/site";

/**
 * The first moment of stillness after the scroll-driven arrival.
 *
 * Deliberately quiet: generous whitespace, a single tall photograph, and the
 * only hard numbers on the page. The porthole inset and the outline numeral
 * layer the plane without raising its volume — depth, not noise.
 */
export function Essence() {
  const scope = useRef<HTMLDivElement>(null);
  const walkway = image("palm-walkway");
  const porthole = image("entrance-sign");

  useGSAPAnimation(() => {
    const cleanup = textReveal(".essence-headline", {
      split: "lines",
      scroll: true,
    });

    reveal(".essence-body", { stagger: STAGGER.base, scroll: true });
    reveal(".essence-stat", { stagger: STAGGER.tight, scroll: true });

    // Both target the same layer: imageReveal owns clip-path and scale,
    // parallax owns y, so they compose rather than fight. The layer is inset
    // beyond the frame on both edges to give the drift somewhere to go.
    imageReveal(".essence-image", { direction: "bottom", scroll: true });
    parallax(".essence-image", { speed: 0.12 });

    // The inset and the numeral drift at different rates than the plate they
    // sit against — three planes moving apart is what reads as depth.
    reveal(".essence-porthole", { direction: "up", scroll: true });
    parallax(".essence-porthole", { speed: 0.22 });
    parallax(".essence-numeral", { speed: 0.15 });

    // The numbers count up as they arrive. Server HTML carries the final
    // values; the tween only rewinds them once the visitor is here to watch.
    scope.current
      ?.querySelectorAll<HTMLElement>("[data-count]")
      .forEach((el) => {
        const target = Number(el.dataset.count);
        if (!Number.isFinite(target)) return;

        // Integers tick whole numbers; the rating counts through hundredths.
        const decimals = target % 1 === 0 ? 0 : 2;

        createScrollAnimation({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            const counter = { n: 0 };
            gsap.to(counter, {
              n: target,
              duration: 1.4,
              ease: EASING.premium,
              onUpdate: () => {
                el.textContent = counter.n.toFixed(decimals);
              },
            });
          },
        });
      });

    return cleanup;
  }, { scope });

  return (
    <section ref={scope} className="bg-bone py-28 sm:py-40" id="story">
      <Container width="wide">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="relative lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <span
              aria-hidden
              className="ghost-numeral essence-numeral absolute -top-14 -left-6 sm:-top-20"
            >
              01
            </span>

            <div className="relative">
              <Eyebrow index="01" data-reveal>
                {essence.eyebrow}
              </Eyebrow>

              <Headline accent={3} className="essence-headline mt-6 text-ink">
                {essence.headline}
              </Headline>

              <div className="mt-8 space-y-6">
                {essence.body.map((paragraph) => (
                  <Lead key={paragraph.slice(0, 24)} className="essence-body" data-reveal>
                    {paragraph}
                  </Lead>
                ))}
              </div>

              <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 border-t hairline pt-10">
                {essence.stats.map((stat) => {
                  const parts = stat.value.match(/^([\d.]+)\s*(.*)$/);

                  return (
                  <div key={stat.label} className="essence-stat" data-reveal>
                    <dt className="font-display text-4xl font-light text-teak sm:text-5xl">
                      {parts ? (
                        <>
                          <span data-count={parts[1]}>{parts[1]}</span>
                          {parts[2] ? ` ${parts[2]}` : null}
                        </>
                      ) : (
                        stat.value
                      )}
                    </dt>
                    <dd className="mt-2 font-sans text-[0.7rem] uppercase tracking-[0.2em] text-stone">
                      {stat.label}
                    </dd>
                  </div>
                  );
                })}
              </dl>
            </div>
          </div>

          <figure className="lg:col-span-7">
            <div className="relative">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-limestone sm:aspect-[4/5] lg:aspect-[3/4]">
                <div className="essence-image absolute inset-x-0 -inset-y-[8%]">
                  <Image
                    src={walkway.src}
                    alt={walkway.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/*
                The porthole: the architecture's circular window, borrowed as
                an inset. Ringed in the page ground so it reads as punched
                through the photograph rather than pasted on it.
              */}
              <div
                className="essence-porthole absolute -bottom-10 -left-6 hidden size-40 overflow-hidden rounded-full ring-8 ring-bone lg:block xl:size-48 xl:-left-12"
                data-reveal
              >
                <Image
                  src={porthole.src}
                  alt={porthole.alt}
                  fill
                  sizes="12rem"
                  className="object-cover"
                />
              </div>
            </div>

            <figcaption className="mt-4 flex items-baseline justify-between gap-6 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-stone">
              <span>{essence.caption}</span>
              <span aria-hidden className="hidden sm:block">
                Fig. 01
              </span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}

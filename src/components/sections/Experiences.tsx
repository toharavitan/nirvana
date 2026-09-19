"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

import {
  STAGGER,
  parallax,
  reveal,
  textReveal,
  useGSAPAnimation,
} from "@leadstrikes/motion-engine";

import { Container } from "@/components/ui/Container";
import { Botanical } from "@/components/ui/Botanical";
import { Eyebrow, Headline, Lead } from "@/components/ui/Typography";
import { experiences, guide, site } from "@/content/site";

// The flip engine touches the DOM at load, so the book is client-only and
// mounted only once opened.
const GuideBook = dynamic(
  () => import("@/components/ui/GuideBook").then((m) => m.GuideBook),
  { ssr: false },
);

import costaRicaMap from "@/assets/decor/costa-rica-map.png";
import botanicalMonstera from "@/assets/decor/botanical-monstera.jpg";
import botanicalVine from "@/assets/decor/botanical-vine.jpg";

/**
 * The experiences page: the Nirvana Concierge introduces itself, then the
 * offering is set out as a menu of categories — each a label against the
 * activities it holds — closing on the ask, with a link out to the full
 * concierge guide and a direct line to the concierge.
 *
 * Top padding clears the fixed header, which sits solid on this route (there is
 * no dark hero here for it to whisper over).
 */
export function Experiences() {
  const scope = useRef<HTMLDivElement>(null);

  // The guide book: null when closed, otherwise the 0-based page to open on.
  const [bookPage, setBookPage] = useState<number | null>(null);
  // `page` in the data is 1-based; the book is 0-based.
  const openGuide = (page: number) => setBookPage(page - 1);

  // The concierge is the working planning channel, so "contact" opens WhatsApp
  // pre-filled — the same number the floating action uses.
  const waNumber = site.contact.whatsapp.replace(/\D/g, "");
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "Hello! We'd love the Nirvana Concierge's help planning experiences for our stay.",
  )}`;

  useGSAPAnimation(() => {
    const cleanup = textReveal(".concierge-headline", { split: "lines", scroll: true });
    reveal(".concierge-body", { stagger: STAGGER.base, scroll: true });

    textReveal(".experiences-headline", { split: "lines", scroll: true });
    reveal(".experiences-intro", { scroll: true });
    reveal(".experiences-category", { stagger: STAGGER.base, scroll: true });

    // The Costa Rica map floats: it drifts upward, faster than the page, as
    // the visitor scrolls past it.
    parallax(".experiences-map", { speed: 0.28 });

    textReveal(".experiences-closing-headline", { split: "lines", scroll: true });
    reveal(".experiences-closing-body", { scroll: true });

    return cleanup;
  }, { scope });

  return (
    <div ref={scope} className="bg-bone text-ink">
      {/* Concierge introduction ------------------------------------------ */}
      <section className="relative overflow-hidden pt-40 sm:pt-52">
        <Botanical
          src={botanicalVine}
          className="left-[-3%] top-28 hidden w-64 lg:block xl:w-80"
          opacity={0.7}
        />
        <Botanical
          src={botanicalMonstera}
          className="bottom-4 right-[-3%] hidden w-56 lg:block xl:w-72"
          opacity={0.65}
        />
        <Container width="wide" className="relative z-10">
          <div className="relative mx-auto max-w-3xl text-center">
            <span
              aria-hidden
              className="ghost-numeral absolute -top-16 left-1/2 -translate-x-1/2 sm:-top-24"
            >
              05
            </span>
            <div className="relative">
              <Eyebrow className="justify-center">
                {experiences.concierge.eyebrow}
              </Eyebrow>
              <Headline
                accent={4}
                className="concierge-headline mx-auto mt-6 text-ink"
              >
                {experiences.concierge.headline}
              </Headline>
              <div className="mx-auto mt-8 max-w-2xl space-y-6">
                {experiences.concierge.body.map((paragraph) => (
                  <Lead
                    key={paragraph.slice(0, 24)}
                    className="concierge-body"
                    data-reveal
                  >
                    {paragraph}
                  </Lead>
                ))}
              </div>
              <p
                className="concierge-body mt-10 font-display text-2xl font-light italic text-teak sm:text-3xl"
                data-reveal
              >
                {experiences.concierge.tagline}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Experiences menu ------------------------------------------------ */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <Container width="wide" className="relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <header className="max-w-2xl lg:col-span-5">
              <Eyebrow index="06">{experiences.eyebrow}</Eyebrow>
              <Headline accent={2} className="experiences-headline mt-6 text-ink">
                {experiences.headline}
              </Headline>
              <Lead className="experiences-intro mt-8" data-reveal>
                {experiences.intro}
              </Lead>
            </header>

            {/* The 1889 map of Costa Rica, set beside the invitation to
                explore it — larger, and drifting up on scroll (see parallax
                above). */}
            <figure className="experiences-map will-change-transform lg:col-span-7 lg:-my-8 lg:justify-self-end">
              <Image
                src={costaRicaMap}
                alt="Map of the Republic of Costa Rica, drawn in 1889"
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="h-auto w-full shadow-[0_28px_70px_rgba(20,25,26,0.18)]"
              />
            </figure>
          </div>

          <div className="mt-16 flex flex-col sm:mt-24">
            {experiences.menu.map((group) => (
              <div
                key={group.category}
                className="experiences-category grid gap-6 border-t hairline py-10 lg:grid-cols-12 lg:gap-16"
                data-reveal
              >
                <h2 className="font-display text-3xl font-light text-ink sm:text-4xl lg:col-span-4">
                  {group.category}
                </h2>

                <ul className="flex flex-wrap gap-3 lg:col-span-8">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      {/* Opens the concierge guide straight to this experience. */}
                      <button
                        type="button"
                        onClick={() => openGuide(item.page)}
                        aria-label={`${item.name} — open in the guide`}
                        className="cursor-pointer rounded-full border border-ink/15 px-5 py-2.5 font-sans text-[0.7rem] uppercase tracking-[0.18em] text-clay transition-colors duration-300 hover:border-teak hover:bg-teak hover:text-bone"
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Closing ask + concierge guide ----------------------------------- */}
      <section className="bg-ink py-28 text-bone sm:py-36">
        <Container width="wide">
          <div className="max-w-2xl">
            <Headline
              accent={3}
              className="experiences-closing-headline text-bone"
            >
              {experiences.closing.headline}
            </Headline>
            <p
              className="experiences-closing-body mt-6 font-sans text-lg font-light leading-relaxed text-bone/60"
              data-reveal
            >
              {experiences.closing.body}
            </p>

            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              {/* Opens the guide as an on-site page-flip magazine, at the cover. */}
              <button
                type="button"
                onClick={() => openGuide(1)}
                className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-bone px-8 py-4 font-sans text-[0.7rem] uppercase tracking-[0.24em] text-ink transition-colors duration-300 hover:bg-teak hover:text-bone"
              >
                {experiences.closing.guideLabel}
                <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
                  <path
                    d="M12 6c-1.8-1.2-4-1.5-6-1v11c2-.5 4.2-.2 6 1 1.8-1.2 4-1.5 6-1V5c-2-.5-4.2-.2-6 1Zm0 0v12"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-sans text-[0.7rem] uppercase tracking-[0.24em] text-teak-light transition-colors hover:text-bone"
              >
                {experiences.closing.contactLabel}
                <span aria-hidden className="h-px w-10 bg-current opacity-60" />
              </a>
            </div>
          </div>
        </Container>
      </section>

      {bookPage !== null ? (
        <GuideBook
          book={guide}
          initialPage={bookPage}
          onClose={() => setBookPage(null)}
        />
      ) : null}
    </div>
  );
}

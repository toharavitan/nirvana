import type { Metadata } from "next";
import Image from "next/image";

import { Details } from "@/components/sections/Details";
import { Gallery } from "@/components/sections/Gallery";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { Villas } from "@/components/sections/Villas";
import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline, Lead } from "@/components/ui/Typography";
import { Decor } from "@/components/ui/Decor";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SiteNav } from "@/components/ui/SiteNav";
import { image } from "@/content/media";
import { villas } from "@/content/site";

import decorBlossom from "@/assets/art-background-blossom-svgrepo-com.svg";

export const metadata: Metadata = {
  title: "Villas in Tamarindo",
  description:
    "The six private villas of Nirvana Tamarindo — each with its own pool, " +
    "three bedrooms and a short walk to Playa Tamarindo, Guanacaste, Costa Rica.",
  alternates: { canonical: "/villas" },
};

/**
 * The villas, all on one page (shrunk site — no per-villa pages).
 *
 * The grid shows the whole collection at a glance, then the room chapters,
 * the practical details and the gallery describe what a stay is actually like.
 */
export default function VillasPage() {
  return (
    <>
      <SiteNav />

      <main>
        <section className="relative overflow-hidden bg-bone pb-16 pt-36 sm:pb-20 sm:pt-52">
          <Decor
            src={decorBlossom}
            className="-right-24 -top-16 size-[540px] rotate-3 sm:size-[640px]"
            color="var(--color-teak)"
            opacity={0.06}
          />
          <Container width="wide" className="relative z-10">
            <div className="max-w-3xl">
              <Eyebrow index="—">The villas</Eyebrow>
              <Headline accent={1} className="mt-6 text-ink">
                Six private villas.
              </Headline>
              <Lead className="mt-8 max-w-2xl">
                A family-owned collection in the heart of Tamarindo — each villa
                completely private, with its own pool, three bedrooms and a
                short walk to the beach.
              </Lead>
            </div>
          </Container>
        </section>

        <section className="bg-bone pb-24 sm:pb-32">
          <Container width="wide">
            <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {villas.map((villa) => {
                const photo = image(villa.image);
                return (
                  <li key={villa.slug}>
                    <figure className="group relative aspect-[4/5] w-full overflow-hidden bg-limestone">
                      <Image
                        src={photo.src}
                        alt={`${villa.name} — ${photo.alt}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent"
                      />
                      <span
                        className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink/45 px-3 py-1.5 font-sans text-[0.68rem] uppercase tracking-[0.18em] text-bone backdrop-blur-sm"
                        title={`Sleeps ${villa.guests} guests`}
                      >
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          className="size-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        {villa.guests}
                      </span>
                      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-bone">
                        <span className="font-display text-3xl font-light leading-none">
                          {villa.name}
                        </span>
                        <span className="font-sans text-[0.65rem] uppercase tracking-[0.22em] text-bone/70">
                          {villa.number}
                        </span>
                      </figcaption>
                    </figure>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>

        {/* The descriptive content that used to live on the per-villa pages,
            now shown once on the single villas page. */}
        <Villas />
        <Details />
        <Gallery />
      </main>

      <SiteFooter />
      <FloatingActions />
    </>
  );
}

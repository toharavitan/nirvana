import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/sections/SiteFooter";
import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline, Lead } from "@/components/ui/Typography";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SiteNav } from "@/components/ui/SiteNav";
import { image } from "@/content/media";
import { villas } from "@/content/site";

export const metadata: Metadata = {
  title: "Villas in Tamarindo",
  description:
    "The six private villas of Nirvana Tamarindo — each with its own pool, " +
    "three bedrooms and a short walk to Playa Tamarindo, Guanacaste, Costa Rica.",
  alternates: { canonical: "/villas" },
};

/**
 * The villas index: an overview of the collection, each villa a card into its
 * own page. Gives the "Villas" nav a landing and a strong page for search.
 */
export default function VillasIndexPage() {
  return (
    <>
      <SiteNav />

      <main>
        <section className="bg-bone pb-16 pt-36 sm:pb-20 sm:pt-52">
          <Container width="wide">
            <div className="max-w-3xl">
              <Eyebrow index="—">The villas</Eyebrow>
              <Headline accent={1} className="mt-6 text-ink">
                Six private villas.
              </Headline>
              <Lead className="mt-8 max-w-2xl">
                A family-owned collection in the heart of Tamarindo — each villa
                completely private, with its own pool, three bedrooms and a
                short walk to the beach. Step into any of them below.
              </Lead>
            </div>
          </Container>
        </section>

        <section className="bg-bone pb-28 sm:pb-40">
          <Container width="wide">
            <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {villas.map((villa) => {
                const photo = image(villa.image);
                return (
                  <li key={villa.slug}>
                    <Link
                      href={`/villas/${villa.slug}`}
                      className="group block"
                    >
                      <figure className="relative aspect-[4/5] w-full overflow-hidden bg-limestone">
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
                        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-bone">
                          <span className="font-display text-3xl font-light leading-none">
                            {villa.name}
                          </span>
                          <span className="font-sans text-[0.65rem] uppercase tracking-[0.22em] text-bone/70">
                            {villa.number}
                          </span>
                        </figcaption>
                      </figure>

                      <span className="mt-4 inline-flex items-center gap-2 font-sans text-[0.68rem] uppercase tracking-[0.24em] text-clay transition-colors group-hover:text-teak">
                        Explore
                        <span
                          aria-hidden
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      </main>

      <SiteFooter />
      <FloatingActions />
    </>
  );
}

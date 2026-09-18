import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Details } from "@/components/sections/Details";
import { Gallery } from "@/components/sections/Gallery";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { Villas } from "@/components/sections/Villas";
import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline } from "@/components/ui/Typography";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SiteNav } from "@/components/ui/SiteNav";
import { villas } from "@/content/site";

export function generateStaticParams() {
  return villas.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const villa = villas.find((v) => v.slug === slug);
  if (!villa) return { title: "Villas" };
  const description =
    `${villa.name} — a private luxury villa at Nirvana Tamarindo, with its own ` +
    `pool, three bedrooms and a short walk to Playa Tamarindo, Guanacaste, Costa Rica.`;
  return {
    title: `${villa.name} — Villa in Tamarindo`,
    description,
    alternates: { canonical: `/villas/${villa.slug}` },
    openGraph: {
      title: `${villa.name} — Nirvana Tamarindo`,
      description,
      url: `/villas/${villa.slug}`,
      type: "website",
    },
  };
}

/**
 * One villa, its own page. The hero names the villa; the rest of the page
 * reuses the shared room, amenity and gallery sections until each villa gets
 * its own copy and photography (see TODO in content/site.ts).
 */
export default async function VillaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const villa = villas.find((v) => v.slug === slug);
  if (!villa) notFound();

  return (
    <>
      <SiteNav />

      <main>
        <section className="bg-bone pb-16 pt-36 sm:pb-24 sm:pt-52">
          <Container width="wide">
            <Link
              href="/#villas"
              className="inline-flex items-center gap-2 font-sans text-[0.65rem] uppercase tracking-[0.24em] text-stone transition-colors hover:text-teak"
            >
              <span aria-hidden>←</span> All villas
            </Link>

            <div className="relative mt-8">
              <span
                aria-hidden
                className="ghost-numeral absolute -top-14 -left-5 sm:-top-20"
              >
                {villa.number}
              </span>
              <div className="relative">
                <Eyebrow index={villa.number}>Nirvana Villas</Eyebrow>
                <Headline accent={1} className="mt-6 text-ink">
                  {villa.name}
                </Headline>
              </div>
            </div>
          </Container>
        </section>

        <Villas />
        <Details />
        <Gallery />
      </main>

      <SiteFooter />
      <FloatingActions />
    </>
  );
}

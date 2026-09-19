import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Details } from "@/components/sections/Details";
import { Gallery } from "@/components/sections/Gallery";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { Villas } from "@/components/sections/Villas";
import { Botanical } from "@/components/ui/Botanical";
import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline } from "@/components/ui/Typography";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SiteNav } from "@/components/ui/SiteNav";
import { reviews, site, villas } from "@/content/site";

import butterfly from "@/assets/decor/butterfly.jpeg";

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

  const url = `${site.url}/villas/${villa.slug}`;
  const villaJsonLd = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "@id": `${url}#villa`,
    name: `${villa.name} — Nirvana Tamarindo`,
    url,
    image: `${site.url}/images/${villa.image}.webp`,
    description:
      `${villa.name}, a private luxury villa at Nirvana Tamarindo — its own ` +
      `pool, three bedrooms and a short walk to Playa Tamarindo.`,
    numberOfBedrooms: 3,
    numberOfBathroomsTotal: 3,
    occupancy: { "@type": "QuantitativeValue", maxValue: 6, unitText: "guests" },
    floorSize: { "@type": "QuantitativeValue", value: 240, unitCode: "MTK" },
    petsAllowed: false,
    smokingAllowed: false,
    containedInPlace: { "@id": `${site.url}/#lodging` },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.location.street,
      addressLocality: site.location.town,
      addressRegion: site.location.province,
      addressCountry: site.location.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.location.latitude,
      longitude: site.location.longitude,
    },
    amenityFeature: [
      "Private pool",
      "Air conditioning",
      "Free high-speed WiFi",
      "Fully equipped kitchen",
      "Washer & dryer",
    ].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviews.rating,
      reviewCount: reviews.count,
      bestRating: "5",
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Villas", item: `${site.url}/villas` },
      { "@type": "ListItem", position: 3, name: villa.name, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([villaJsonLd, breadcrumbJsonLd]),
        }}
      />
      <SiteNav />

      <main>
        <section className="relative overflow-hidden bg-bone pb-16 pt-36 sm:pb-24 sm:pt-52">
          <Botanical
            src={butterfly}
            className="right-[-6%] top-24 w-64 sm:top-28 sm:w-80 lg:w-[26rem]"
            opacity={0.7}
          />
          <Container width="wide" className="relative z-10">
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

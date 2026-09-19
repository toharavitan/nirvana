import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";

import { SmoothScrollProvider } from "@leadstrikes/motion-engine";

import { reviews, site, villas } from "@/content/site";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

// Poppins stands in for Sendero's body face (Sofia Pro) — a warm geometric
// sans that carries the same airy, light-weight register. Weights kept lean to
// match the delicate feel the design already leans on (font-light everywhere).
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const ogImage = "/images/pool-dusk.webp";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName} — Luxury Villas in ${site.location.town}, ${site.location.country}`,
    template: `%s — ${site.name} Tamarindo`,
  },
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.fullName} — Luxury Villas in ${site.location.town}`,
    description: site.description,
    url: site.url,
    siteName: site.fullName,
    type: "website",
    locale: "en_US",
    images: [{ url: ogImage, alt: `${site.fullName}, Tamarindo, Costa Rica` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.fullName} — Luxury Villas in ${site.location.town}`,
    description: site.description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Classic geo tags — help local/GEO discovery pin the site to Tamarindo.
  other: {
    "geo.region": site.location.regionCode,
    "geo.placename": `${site.location.town}, ${site.location.province}, ${site.location.country}`,
    "geo.position": `${site.location.latitude};${site.location.longitude}`,
    ICBM: `${site.location.latitude}, ${site.location.longitude}`,
  },
};

/**
 * schema.org LodgingBusiness/Resort — the structured record that ties the site
 * to Tamarindo (address + geo coordinates), to villas and to the hotel/lodging
 * category, with the real Airbnb rating. Rendered as JSON-LD on every page.
 */
const lodgingJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Resort", "LodgingBusiness"],
  "@id": `${site.url}/#lodging`,
  name: site.fullName,
  alternateName: "Nirvana Villas Tamarindo",
  description: site.description,
  url: site.url,
  image: [`${site.url}${ogImage}`],
  email: site.contact.email,
  telephone: site.contact.phone,
  priceRange: "$$$",
  currenciesAccepted: "USD",
  knowsLanguage: ["en", "es"],
  numberOfRooms: villas.length,
  checkinTime: "15:00",
  checkoutTime: "10:00",
  petsAllowed: false,
  smokingAllowed: false,
  slogan: "Your home in paradise.",
  keywords: site.keywords.join(", "),
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
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.location.mapQuery)}`,
  areaServed: `${site.location.town}, ${site.location.province}, ${site.location.country}`,
  amenityFeature: [
    "Private pool",
    "Air conditioning",
    "Free high-speed WiFi",
    "Fully equipped kitchen",
    "Beach access",
    "Daily housekeeping",
    "Concierge service",
    "Private parking",
  ].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: reviews.rating,
    reviewCount: reviews.count,
    bestRating: "5",
  },
  review: reviews.items.slice(0, 3).map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    datePublished: r.date,
    reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    reviewBody: r.text,
  })),
  containsPlace: villas.map((v) => ({
    "@type": "Accommodation",
    name: v.name,
    url: `${site.url}/villas/${v.slug}`,
    accommodationCategory: "Villa",
    numberOfBedrooms: 3,
    occupancy: { "@type": "QuantitativeValue", maxValue: 6, unitText: "guests" },
  })),
  potentialAction: {
    "@type": "ReserveAction",
    target: `${site.url}/reservation`,
    name: "Book your stay",
  },
  sameAs: [site.contact.airbnb],
};

// The site itself, for sitelinks/search understanding.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.fullName,
  alternateName: site.name,
  description: site.description,
  inLanguage: "en",
  publisher: { "@id": `${site.url}/#lodging` },
};

export const viewport: Viewport = {
  themeColor: "#14191a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${poppins.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Entrance animations start from opacity 0. Without this the server HTML
          paints at full opacity for a frame before GSAP takes over, which reads
          as a flash. Setting the flag here — synchronously, before first paint —
          lets globals.css hide those elements, and the class is only ever added
          when scripting is available, so content can never be stranded hidden.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
        {/* Structured data: the website and the local lodging business. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([websiteJsonLd, lodgingJsonLd]),
          }}
        />
      </head>
      <body className="bg-bone text-ink">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

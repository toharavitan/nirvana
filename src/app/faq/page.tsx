import type { Metadata } from "next";

import { SiteFooter } from "@/components/sections/SiteFooter";
import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline, Lead } from "@/components/ui/Typography";
import { Decor } from "@/components/ui/Decor";
import { Botanical } from "@/components/ui/Botanical";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SiteNav } from "@/components/ui/SiteNav";
import { reviews, site } from "@/content/site";

import decorDrawing from "@/assets/decor-decoration-drawing-svgrepo-com.svg";
import botanicalLeaf from "@/assets/decor/botanical-banana-leaf.jpg";
import botanicalBranch from "@/assets/decor/leaf_right.jpeg";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about staying at Nirvana Villas Tamarindo — " +
    "location, villas and pools, check-in times, booking, amenities, the " +
    "concierge, getting here from Liberia airport, and house policies.",
  alternates: { canonical: "/faq" },
  robots: { index: true, follow: true },
};

/**
 * The FAQ. Written as plain question/answer pairs so the same source feeds
 * both the visible page and the FAQPage structured data below — answers are
 * kept to clean prose (no markup) because that is what search engines and
 * AI crawlers ingest verbatim. Every answer is grounded in the real property
 * facts held in content/site.ts; nothing here invents a price or a policy.
 */
const FAQS: { q: string; a: string }[] = [
  {
    q: "Where is Nirvana Villas Tamarindo located?",
    a:
      `Nirvana Villas is in the heart of ${site.location.town}, ` +
      `${site.location.province}, ${site.location.country}, at ` +
      `${site.location.address}. The property sits a few quiet streets back ` +
      "from Playa Tamarindo, a short walk from the beach, restaurants and the " +
      "town centre.",
  },
  {
    q: "How many villas are there, and how many guests can each one sleep?",
    a:
      "There are six private villas. Five of them — Villa 01 through Villa 05 " +
      "— each sleep up to 6 guests, with three bedrooms and three bathrooms. " +
      "The largest, Almendro, sleeps up to 8 guests. The whole collection can " +
      "be booked together for larger groups and events.",
  },
  {
    q: "Does each villa have its own private pool?",
    a:
      "Yes. Every villa has its own private pool, surrounded by lush tropical " +
      "gardens, so your outdoor space is never shared with other guests.",
  },
  {
    q: "What are the check-in and check-out times?",
    a:
      "Check-in is from 3:00 PM and check-out is by 10:00 AM. If you need an " +
      "early check-in or late check-out, ask our concierge in advance and we " +
      "will do our best to accommodate it around other stays.",
  },
  {
    q: "How do I book a stay at Nirvana Villas?",
    a:
      "You can request dates through the reservation page on this website, " +
      `book directly on our Airbnb listing, email us at ${site.contact.email}, ` +
      `or message us on WhatsApp at ${site.contact.phone}. We are happy to ` +
      "help you choose the right villa for your group.",
  },
  {
    q: "How far is the beach?",
    a:
      "Playa Tamarindo is a short walk away — just a few streets from the " +
      "property gate. It is one of Guanacaste's best-known surf and swimming " +
      "beaches, with sunsets over the Pacific most evenings.",
  },
  {
    q: "How do I get to Nirvana Villas from the airport?",
    a:
      "The nearest international airport is Daniel Oduber Quirós International " +
      "Airport (LIR) in Liberia, roughly a 75-minute drive away. Juan " +
      "Santamaría International Airport (SJO) near San José is about four to " +
      "five hours by road. Our concierge can arrange a private airport " +
      "transfer so a driver is waiting for you on arrival.",
  },
  {
    q: "Is the property good for families with children?",
    a:
      "Very much so. Nirvana is a family-owned collection designed for " +
      "families, with spacious villas, private pools and a gated, car-free " +
      "walkway through the property. Children must be supervised by an adult " +
      "at all times in and around the pools.",
  },
  {
    q: "What amenities are included in each villa?",
    a:
      "Each villa includes a private pool, air conditioning, free high-speed " +
      "WiFi, a fully equipped kitchen, a washer and dryer, and one designated " +
      "parking space within the property. Daily housekeeping, concierge " +
      "service and beach access are part of every stay.",
  },
  {
    q: "Is daily housekeeping included?",
    a:
      "Yes. A daily cleaning service is provided between 9:00 AM and 12:00 PM. " +
      "The team refreshes the bedrooms and bathrooms, tidies the living spaces " +
      "and kitchen, washes any dishes left in the sink, removes the trash and " +
      "lightly cleans the villa each day. Additional cleaning can be arranged " +
      "during your stay whenever possible, and extra fees may apply depending " +
      "on the request.",
  },
  {
    q: "Is there a cleaning fee?",
    a:
      "Yes. A one-time $95 cleaning fee is added to each reservation. It " +
      "supports the daily housekeeping that keeps your villa fresh, clean and " +
      "comfortable throughout your stay.",
  },
  {
    q: "Is parking available?",
    a:
      "Yes. Each villa comes with one designated parking space within the " +
      "gated property.",
  },
  {
    q: "Is the WiFi fast enough to work remotely?",
    a:
      "Yes. Every villa has free high-speed WiFi suitable for remote work and " +
      "video calls, making Nirvana a comfortable base for a longer working " +
      "stay in Tamarindo.",
  },
  {
    q: "Can the concierge arrange activities and tours?",
    a:
      "Yes. Our concierge can arrange the full range of Guanacaste " +
      "experiences — surfing lessons, catamaran and yacht days, snorkelling " +
      "and scuba, horseback riding, ATV tours, ziplining, wildlife and sloth " +
      "spotting, hot springs, waterfalls and more — and can book them before " +
      "or during your stay. The on-site Experiences guide has the full list.",
  },
  {
    q: "What languages does your team speak?",
    a: "Our team speaks both English and Spanish.",
  },
  {
    q: "Are pets allowed?",
    a:
      "No. Pets are not permitted anywhere on the property. Unauthorised pets " +
      "may result in a $500 fee.",
  },
  {
    q: "Is smoking allowed?",
    a:
      "No. Smoking, candles and incense are strictly prohibited inside the " +
      "villas. Smoking indoors results in a $500 fee and immediate " +
      "termination of the stay.",
  },
  {
    q: "Are parties or events allowed?",
    a:
      "No. Parties, events and large gatherings are strictly prohibited, and " +
      "only guests registered on the reservation are permitted on the " +
      "property. Quiet hours run from 10:00 PM to 7:00 AM out of respect for " +
      "other guests and neighbours.",
  },
  {
    q: "When is the best time of year to visit Tamarindo?",
    a:
      "Tamarindo is warm and tropical year-round. The dry season runs roughly " +
      "December to April with the most sunshine, while the green season from " +
      "May to November brings lush landscapes, fewer crowds and short " +
      "afternoon showers. The surf is good in every season.",
  },
  {
    q: "How well reviewed is Nirvana Villas?",
    a:
      `Guests rate Nirvana Villas ${reviews.rating} out of 5 across ` +
      `${reviews.count} stays, consistently praising the privacy, the pools, ` +
      "the cleanliness and the walkable location near the beach.",
  },
];

/**
 * FAQPage structured data. Built from the same FAQS array the page renders,
 * so the visible copy and the machine-readable answers can never drift apart.
 * This is the schema Google reads for FAQ rich results and that answer engines
 * parse when citing the property.
 */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${site.url}/faq#faqpage`,
  name: `${site.fullName} — Frequently Asked Questions`,
  url: `${site.url}/faq`,
  inLanguage: "en",
  about: { "@id": `${site.url}/#lodging` },
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "FAQ", item: `${site.url}/faq` },
  ],
};

/**
 * Frequently asked questions, on their own page. Answers are shown in full
 * (not collapsed) so the content is directly visible to visitors and crawlers
 * alike — the safest form for search and AI indexing.
 */
export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqJsonLd, breadcrumbJsonLd]),
        }}
      />
      <SiteNav />

      <main>
        <section className="relative overflow-hidden bg-bone pb-16 pt-36 text-center sm:pb-20 sm:pt-52">
          <Decor
            src={decorDrawing}
            className="-right-24 -top-16 size-[520px] rotate-6 sm:size-[620px]"
            color="var(--color-teak)"
            opacity={0.06}
          />
          <Container width="default" className="relative z-10">
            <Eyebrow index="—" className="justify-center">
              Good to know
            </Eyebrow>
            <Headline as="h1" className="mt-6 text-ink">
              Frequently Asked Questions
            </Headline>
            <Lead className="mx-auto mt-8 max-w-2xl">
              Everything guests usually ask before a stay — where we are, how
              the villas work, and what to expect once you arrive.
            </Lead>
          </Container>
        </section>

        <section className="relative overflow-hidden bg-bone pb-28 sm:pb-40">
          <Botanical
            src={botanicalBranch}
            className="top-[42%] right-[-3%] hidden w-52 lg:block xl:w-64"
            opacity={0.55}
          />
          <Botanical
            src={botanicalLeaf}
            className="bottom-16 left-[-4%] hidden w-56 lg:block xl:w-72"
            opacity={0.6}
          />
          <Container width="default" className="relative z-10">
            <ol className="flex flex-col gap-12 sm:gap-14">
              {FAQS.map((item, index) => (
                <li
                  key={item.q}
                  className="grid gap-x-10 gap-y-3 border-t hairline pt-8 sm:grid-cols-12"
                >
                  <div className="flex gap-4 sm:col-span-5">
                    <span className="mt-1 font-sans text-[0.65rem] tracking-[0.22em] text-teak/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-2xl font-light text-ink sm:text-[1.75rem]">
                      {item.q}
                    </h2>
                  </div>
                  <p className="font-sans text-[0.95rem] font-light leading-relaxed text-clay text-pretty sm:col-span-7">
                    {item.a}
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-16 border-t hairline pt-10 font-display text-xl font-light italic leading-relaxed text-teak sm:text-2xl">
              Still have a question? Write to us at {site.contact.email} — we
              answer personally.
            </p>
          </Container>
        </section>
      </main>

      <SiteFooter />
      <FloatingActions />
    </>
  );
}

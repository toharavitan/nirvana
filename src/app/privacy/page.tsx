import type { Metadata } from "next";

import { SiteFooter } from "@/components/sections/SiteFooter";
import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline, Lead } from "@/components/ui/Typography";
import { Decor } from "@/components/ui/Decor";
import { Botanical } from "@/components/ui/Botanical";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SiteNav } from "@/components/ui/SiteNav";
import { site } from "@/content/site";

import decorLeaf from "@/assets/leaf-minimalism-modern-svgrepo-com.svg";
import botanicalBlossoms from "@/assets/decor/botanical-blossoms.jpg";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Nirvana Villas Tamarindo collects, uses and protects the information " +
    "you share when enquiring about a stay.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    heading: "Who we are",
    body:
      "Nirvana Villas Tamarindo (“Nirvana”, “we”, “us”) operates this website " +
      "to present our villas and to receive reservation enquiries. This policy " +
      "explains what information we collect and how we handle it. " +
      "TODO(client): add the legal entity name and registered address.",
  },
  {
    heading: "Information we collect",
    body:
      "When you send a reservation enquiry we collect the details you provide " +
      "in the form: your name, email address, the villa you're interested in, " +
      "your arrival and departure dates, the number of guests, and any message " +
      "you add. We do not ask for payment details on this website.",
  },
  {
    heading: "How we use your information",
    body:
      "We use these details only to respond to your enquiry, check " +
      "availability, and help arrange your stay. We do not sell or rent your " +
      "personal information to anyone.",
  },
  {
    heading: "How it's shared",
    body:
      "Enquiries are delivered to our own booking and concierge team through a " +
      "secured connection. We share your information with service providers " +
      "only as needed to respond to you and manage your stay, and only to the " +
      "extent required to do so.",
  },
  {
    heading: "Third-party services",
    body:
      "Some links and features take you to services with their own privacy " +
      "policies — booking on Airbnb, messaging us on WhatsApp, and the guide " +
      "hosted on Google Drive. The site also uses Google Fonts for typography " +
      "and is served through our hosting provider. We don't control how those " +
      "third parties process data on their platforms.",
  },
  {
    heading: "Cookies & analytics",
    body:
      "This website does not set advertising or cross-site tracking cookies. " +
      "Your browser may store small preferences needed for the site to work. " +
      "TODO(client): update this section if analytics or marketing tools are " +
      "added later.",
  },
  {
    heading: "Data retention",
    body:
      "We keep enquiry details for as long as needed to respond to you and to " +
      "keep a record of bookings, then delete or anonymise them. " +
      "TODO(client): confirm a specific retention period.",
  },
  {
    heading: "Your rights",
    body:
      "You may ask us to access, correct, or delete the personal information " +
      "you've shared with us. Contact us at the email below and we'll help.",
  },
  {
    heading: "Children's privacy",
    body:
      "This website is intended for adults planning a stay. We do not knowingly " +
      "collect personal information from children.",
  },
  {
    heading: "Changes to this policy",
    body:
      "We may update this policy from time to time. Any changes will be posted " +
      "on this page.",
  },
] as const;

/**
 * Privacy policy. Written to this site's actual data flow (the reservation
 * enquiry form), with TODO(client) markers where a legal specific is needed.
 */
export default function PrivacyPage() {
  return (
    <>
      <SiteNav />

      <main>
        <section className="relative overflow-hidden bg-bone pb-16 pt-36 sm:pb-20 sm:pt-52">
          <Decor
            src={decorLeaf}
            className="-right-20 -top-12 size-[460px] sm:size-[560px]"
            color="var(--color-teak)"
            opacity={0.06}
          />
          <Container width="default" className="relative z-10">
            <Eyebrow index="—">Legal</Eyebrow>
            <Headline as="h1" className="mt-6 text-ink">
              Privacy Policy
            </Headline>
            <Lead className="mt-8 max-w-2xl">
              What we collect when you enquire about a stay, and how we look
              after it.
            </Lead>
          </Container>
        </section>

        <section className="relative overflow-hidden bg-bone pb-28 sm:pb-40">
          <Botanical
            src={botanicalBlossoms}
            className="bottom-20 right-[-4%] hidden w-56 lg:block xl:w-72"
            opacity={0.55}
          />
          <Container width="default" className="relative z-10">
            <ol className="flex flex-col gap-12 sm:gap-14">
              {SECTIONS.map((section, index) => (
                <li
                  key={section.heading}
                  className="grid gap-x-10 gap-y-3 border-t hairline pt-8 sm:grid-cols-12"
                >
                  <div className="flex items-baseline gap-4 sm:col-span-5">
                    <span className="font-sans text-[0.65rem] tracking-[0.22em] text-teak/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-2xl font-light text-ink sm:text-[1.75rem]">
                      {section.heading}
                    </h2>
                  </div>
                  <p className="font-sans text-[0.95rem] font-light leading-relaxed text-clay text-pretty sm:col-span-7">
                    {section.body}
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-16 border-t hairline pt-10 font-sans text-[0.95rem] font-light leading-relaxed text-clay">
              Questions about your privacy? Write to us at{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-teak underline decoration-teak/30 underline-offset-4 transition-colors hover:text-ink"
              >
                {site.contact.email}
              </a>
              .
            </p>
          </Container>
        </section>
      </main>

      <SiteFooter />
      <FloatingActions />
    </>
  );
}

import type { Metadata } from "next";

import { SiteFooter } from "@/components/sections/SiteFooter";
import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline, Lead } from "@/components/ui/Typography";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SiteNav } from "@/components/ui/SiteNav";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Guest policies and house rules for a stay at Nirvana Villas Tamarindo.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    heading: "Smoking, candles & incense",
    body:
      "Smoking, candles, and incense are strictly prohibited inside the villa. " +
      "Smoking inside the villa will result in a $500 fee and immediate " +
      "termination of the stay.",
  },
  {
    heading: "Pets",
    body:
      "Pets are not permitted on the property. Unauthorized pets may result in " +
      "a $500 fee.",
  },
  {
    heading: "Quiet hours",
    body:
      "Quiet hours are from 10:00 PM to 7:00 AM. Please be considerate of other " +
      "guests and our neighbors by keeping noise and music at a respectful " +
      "level.",
  },
  {
    heading: "Parties & events",
    body:
      "Parties, events, and large gatherings are strictly prohibited. Violation " +
      "of this policy will result in immediate termination of the stay.",
  },
  {
    heading: "Registered guests only",
    body:
      "Only guests registered on the reservation are permitted on the property. " +
      "Outside visitors and unregistered guests are not allowed. This policy is " +
      "in place for the safety, privacy, and comfort of everyone staying at " +
      "Nirvana Villas.",
  },
  {
    heading: "Towels & linens",
    body:
      "Bath towels and linens must remain inside the villa. Pool/beach towels " +
      "are provided for use during your stay. A $25 replacement fee will apply " +
      "for each lost or damaged towel.",
  },
  {
    heading: "Damages",
    body:
      "Any damage to the villa must be reported to the Nirvana Villas team " +
      "immediately.",
  },
  {
    heading: "Illegal activity",
    body:
      "Illegal activity of any kind is strictly prohibited on the property and " +
      "will result in immediate termination of the stay.",
  },
  {
    heading: "Air conditioning",
    body:
      "Please turn off the air conditioning when leaving the villa and keep " +
      "doors and windows closed while the AC is in use.",
  },
  {
    heading: "Pool safety",
    body:
      "Use of the pool is at your own risk. Glass is not permitted in or around " +
      "the pool area. Children must be supervised by an adult at all times " +
      "while using or being near the pool.",
  },
  {
    heading: "Septic system",
    body:
      "Our villas use a septic system. Please do not flush toilet paper, wipes, " +
      "feminine hygiene products, or any other sanitary products down the " +
      "toilets. Please dispose of these items in the waste bins provided in " +
      "each bathroom.",
  },
] as const;

const CLOSING =
  "Thank you for helping us care for our villas and for respecting the comfort " +
  "and privacy of everyone at Nirvana Villas.";

/**
 * Guest policies / house rules, on their own page.
 */
export default function TermsPage() {
  return (
    <>
      <SiteNav />

      <main>
        <section className="bg-bone pb-16 pt-36 text-center sm:pb-20 sm:pt-52">
          <Container width="default">
            <Eyebrow index="—" className="justify-center">
              Guest policies
            </Eyebrow>
            <Headline as="h1" className="mt-6 text-ink">
              Terms and Conditions
            </Headline>
            <Lead className="mx-auto mt-8 max-w-2xl">
              A few house rules that keep every villa — and every stay — as
              peaceful and private as it should be.
            </Lead>
          </Container>
        </section>

        <section className="bg-bone pb-28 sm:pb-40">
          <Container width="default">
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

            <p className="mt-16 border-t hairline pt-10 font-display text-xl font-light italic leading-relaxed text-teak sm:text-2xl">
              {CLOSING}
            </p>
          </Container>
        </section>
      </main>

      <SiteFooter />
      <FloatingActions />
    </>
  );
}

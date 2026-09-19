import type { Metadata } from "next";
import Image from "next/image";

import { SiteFooter } from "@/components/sections/SiteFooter";
import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline, Lead } from "@/components/ui/Typography";
import { Decor } from "@/components/ui/Decor";
import { Botanical } from "@/components/ui/Botanical";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SiteNav } from "@/components/ui/SiteNav";
import { site } from "@/content/site";

import decorBotanic from "@/assets/beautiful-beauty-botanic-svgrepo-com.svg";
import botanicalVine from "@/assets/decor/botanical-vine.jpg";
import accessEntrance from "@/assets/decor/access-entrance.webp";
import accessPath from "@/assets/decor/access-path.webp";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Our commitment to keeping the Nirvana Villas Tamarindo website usable for " +
    "everyone, and how to reach us if something gets in your way.",
  alternates: { canonical: "/accessibility" },
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    heading: "Our commitment",
    body:
      "We want everyone to be able to explore our villas and plan a stay, " +
      "whatever device or assistive technology they use. We aim to meet the " +
      "spirit of the WCAG 2.1 AA guidelines and to keep improving.",
  },
  {
    heading: "What we've done",
    body:
      "The site is built with meaningful headings and landmarks, is navigable " +
      "by keyboard, and gives images descriptive alternative text. Colours are " +
      "chosen for readable contrast, and the layout adapts to small screens " +
      "and to zooming in.",
  },
  {
    heading: "Motion & animation",
    body:
      "If your device is set to reduce motion, the site honours that — " +
      "scroll-driven and decorative animations are eased off so the content " +
      "stays calm and still.",
  },
  {
    heading: "Known limitations",
    body:
      "A few features rely on visuals: the concierge guide is presented as a " +
      "page-turning book, so a plain PDF version is linked alongside it, and " +
      "some external tools (such as Airbnb) follow their own accessibility " +
      "standards once you leave our site.",
  },
  {
    heading: "Need a hand?",
    body:
      "If anything on this site gets in your way, or you'd like help planning " +
      "a reservation another way, please contact us — we're glad to assist by " +
      "email, phone or WhatsApp.",
  },
  {
    heading: "Ongoing work",
    body:
      "Accessibility is never finished. We review the site as we add to it and " +
      "welcome feedback that helps us do better.",
  },
] as const;

/**
 * Accessibility statement. Describes measures the site genuinely takes
 * (semantics, keyboard use, alt text, reduced-motion support, responsive
 * zoom) and how to get help.
 */
export default function AccessibilityPage() {
  return (
    <>
      <SiteNav />

      <main>
        <section className="relative overflow-hidden bg-bone pb-16 pt-36 sm:pb-20 sm:pt-52">
          <Decor
            src={decorBotanic}
            className="-right-20 -top-12 size-[460px] sm:size-[560px]"
            color="var(--color-teak)"
            opacity={0.06}
          />
          <Container width="default" className="relative z-10">
            <Eyebrow index="—">Legal</Eyebrow>
            <Headline as="h1" className="mt-6 text-ink">
              Accessibility
            </Headline>
            <Lead className="mt-8 max-w-2xl">
              Keeping this site usable for everyone — and how to reach us if it
              falls short.
            </Lead>
          </Container>
        </section>

        <section className="bg-bone pb-20 sm:pb-28">
          <Container width="default">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <figure>
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-limestone">
                  <Image
                    src={accessEntrance}
                    alt="A tape measure showing the width of the guest entrance threshold"
                    fill
                    sizes="(max-width: 640px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-stone">
                  Guest entrance wider than 32 inches
                </figcaption>
              </figure>

              <figure>
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-limestone">
                  <Image
                    src={accessPath}
                    alt="A lit, level paved path leading to the guest entrance"
                    fill
                    sizes="(max-width: 640px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-stone">
                  A lit, level path to the guest entrance
                </figcaption>
              </figure>
            </div>
          </Container>
        </section>

        <section className="relative overflow-hidden bg-bone pb-28 sm:pb-40">
          <Botanical
            src={botanicalVine}
            className="bottom-16 right-[-4%] hidden w-60 lg:block xl:w-72"
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
              Reach us at{" "}
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

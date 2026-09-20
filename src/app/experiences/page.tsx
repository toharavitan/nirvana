import type { Metadata } from "next";

import { Experiences } from "@/components/sections/Experiences";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SiteNav } from "@/components/ui/SiteNav";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "The Nirvana Concierge — ocean, adventure, nature, volcano, wellness and " +
    "more, arranged across Tamarindo and beyond so your stay feels effortless.",
};

/**
 * A second page, off the single-scroll home. The shared chrome — nav, footer,
 * the floating WhatsApp and availability actions — wraps a menu of what there
 * is to do within reach of the villas.
 */
export default function ExperiencesPage() {
  return (
    <>
      <SiteNav />

      <main>
        <Experiences />
      </main>

      <SiteFooter />
      <FloatingActions />
    </>
  );
}

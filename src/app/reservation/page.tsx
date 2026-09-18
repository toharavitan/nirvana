import type { Metadata } from "next";

import { Inquiry } from "@/components/sections/Inquiry";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SiteNav } from "@/components/ui/SiteNav";

export const metadata: Metadata = {
  title: "Reservation",
  description:
    "Reserve your stay at Nirvana Villas Tamarindo — tell us your dates and " +
    "party size and we'll come back with availability and rates.",
  alternates: { canonical: "/reservation" },
};

/**
 * The reservation form, on its own page. Lifted out of every other page so the
 * ask lives in one place, reached from the "Reservation" nav item.
 */
export default function ReservationPage() {
  return (
    <>
      <SiteNav />

      <main>
        <Inquiry />
      </main>

      <SiteFooter />
      <FloatingActions />
    </>
  );
}

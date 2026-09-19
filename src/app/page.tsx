import { Essence } from "@/components/sections/Essence";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { LocationMap } from "@/components/sections/LocationMap";
import { Moments } from "@/components/sections/Moments";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SiteNav } from "@/components/ui/SiteNav";

/**
 * One page, read top to bottom as a single arrival.
 *
 *   Hero        one unbroken scroll-scrubbed move: over the bay, down to the
 *               gate, through it and along the palm walkway
 *   Essence     the introduction — welcome, and what the place is
 *   Moments     a horizontal strip of Tamarindo photographs
 *   Location    the aerial: how close the beach actually is
 *   LocationMap a live Google map, with a Street View toggle
 *
 * Each individual villa lives on its own page (/villas/<slug>), reached from
 * the Villas dropdown in the nav, and the reservation form lives on
 * /reservation — so the home stays a lean introduction.
 *
 * The two source clips were shot as one continuous camera move, and the site
 * plays them as one: they are concatenated at encode time and a single pinned
 * section scrubs the whole journey.
 */
export default function Home() {
  return (
    <>
      <SiteNav />

      <main>
        <Hero />
        <Essence />
        <Moments />
        <Location />
        <LocationMap />
      </main>

      <SiteFooter />
      <FloatingActions />
    </>
  );
}

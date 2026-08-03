import { Details } from "@/components/sections/Details";
import { Essence } from "@/components/sections/Essence";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Inquiry } from "@/components/sections/Inquiry";
import { Location } from "@/components/sections/Location";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { Villas } from "@/components/sections/Villas";
import { AvailabilityButton } from "@/components/ui/AvailabilityButton";
import { SiteNav } from "@/components/ui/SiteNav";

/**
 * One page, read top to bottom as a single arrival.
 *
 *   Hero        one unbroken scroll-scrubbed move: over the bay, down to the
 *               gate, through it and along the palm walkway
 *   Essence     the first still moment — what the place is, and why it's small
 *   Villas      four rooms, four photographs, alternating down the page
 *   Details     the practical answers, on the dark ground
 *   Gallery     everything the narrative didn't have room for
 *   Location    the aerial: how close the beach actually is
 *   Inquiry     the ask, at dusk
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
        <Villas />
        <Details />
        <Gallery />
        <Location />
        <Inquiry />
      </main>

      <SiteFooter />
      <AvailabilityButton />
    </>
  );
}

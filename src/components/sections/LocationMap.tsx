"use client";

import { useRef, useState } from "react";

import { reveal, textReveal, useGSAPAnimation } from "@leadstrikes/motion-engine";

import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline } from "@/components/ui/Typography";
import { site } from "@/content/site";

// The property's address (Plus Code + street), pinned by Google, plus its
// decoded coordinates — Street View needs coordinates, not an address query.
const QUERY = encodeURIComponent(site.location.mapQuery);
const { latitude: LAT, longitude: LNG } = site.location;

// Classic Google Maps embeds — no API key required.
const MAP_SRC = `https://maps.google.com/maps?q=${QUERY}&z=17&hl=en&output=embed`;
const STREETVIEW_SRC = `https://maps.google.com/maps?layer=c&cbll=${LAT},${LNG}&cbp=11,0,0,0,0&output=svembed`;
const OPEN_IN_MAPS = `https://www.google.com/maps/search/?api=1&query=${QUERY}`;

type View = "map" | "street";

/**
 * The location, on a live Google map — with a toggle to drop into Street View.
 * Uses the key-free classic embeds. TODO(client): once the villas' exact
 * coordinates are set in site.ts, both views update automatically.
 */
export function LocationMap() {
  const scope = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>("map");

  useGSAPAnimation(() => {
    const cleanup = textReveal(".map-headline", { split: "lines", scroll: true });
    reveal(".map-frame", { scroll: true });
    return cleanup;
  }, { scope });

  return (
    <section ref={scope} className="bg-bone py-24 sm:py-32" id="map">
      <Container width="wide">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <Eyebrow index="—">Find us</Eyebrow>
            <Headline accent={1} className="map-headline mt-6 text-ink">
              On the map.
            </Headline>
          </div>

          {/* View toggle */}
          <div
            role="tablist"
            aria-label="Map view"
            className="inline-flex shrink-0 self-start border hairline sm:self-auto"
          >
            {(
              [
                ["map", "Map"],
                ["street", "Street View"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={view === value}
                onClick={() => setView(value)}
                className={`px-5 py-3 font-sans text-[0.65rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                  view === value
                    ? "bg-ink text-bone"
                    : "text-clay hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="map-frame mt-10 overflow-hidden border hairline bg-limestone" data-reveal>
          <div className="relative aspect-[16/10] w-full sm:aspect-[16/7]">
            <iframe
              key={view}
              title={
                view === "map"
                  ? "Map of Nirvana Villas, Tamarindo"
                  : "Street view near Nirvana Villas, Tamarindo"
              }
              src={view === "map" ? MAP_SRC : STREETVIEW_SRC}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>

        <a
          href={OPEN_IN_MAPS}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-teak transition-colors hover:text-ink"
        >
          Open in Google Maps
          <span aria-hidden>↗</span>
        </a>
      </Container>
    </section>
  );
}

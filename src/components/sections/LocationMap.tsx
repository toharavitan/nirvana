"use client";

import { useEffect, useRef, useState } from "react";

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

// Remember the visitor's "load the map" consent so they aren't asked again on
// return visits. Loading Google Maps can set Google's own cookies, so the
// embed stays off until the visitor explicitly opts in (cookie-consent
// compliant by default — no third-party cookies drop before this click).
const CONSENT_KEY = "nirvana:maps-consent";

type View = "map" | "street";

/**
 * The location, on a live Google map — with a toggle to drop into Street View.
 * Uses the key-free classic embeds, fully interactive (zoom/pan), with Google's
 * own marker. A custom branded pin isn't possible on the classic embed without
 * the keyed Maps JavaScript API, so this keeps Google's default marker.
 *
 * The Google embed is deferred behind an explicit "load the map" click so no
 * third-party (Google) cookies are set until the visitor consents — this keeps
 * the site free of a sitewide cookie banner for its own, cookieless analytics.
 */
export function LocationMap() {
  const scope = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>("map");
  const [loaded, setLoaded] = useState(false);

  // Restore a previously-given consent (stored per browser).
  useEffect(() => {
    try {
      if (localStorage.getItem(CONSENT_KEY) === "1") setLoaded(true);
    } catch {
      // localStorage can throw in private mode — fall back to asking.
    }
  }, []);

  const loadMap = () => {
    setLoaded(true);
    try {
      localStorage.setItem(CONSENT_KEY, "1");
    } catch {
      // Ignore storage failures; the map still loads for this visit.
    }
  };

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

          {/* View toggle — only meaningful once the map is loaded. */}
          {loaded ? (
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
          ) : null}
        </div>

        <div className="map-frame mt-10 overflow-hidden border hairline bg-limestone" data-reveal>
          <div className="relative aspect-[16/10] w-full sm:aspect-[16/7]">
            {loaded ? (
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
            ) : (
              // Consent placeholder — no Google request is made until the click.
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
                <p className="max-w-md font-sans text-[0.78rem] leading-relaxed tracking-[0.04em] text-clay">
                  The interactive map is served by Google Maps, which may set its
                  own cookies. Load it to see the location on the map.
                </p>
                <button
                  type="button"
                  onClick={loadMap}
                  className="inline-flex items-center gap-2 bg-ink px-6 py-3 font-sans text-[0.65rem] uppercase tracking-[0.2em] text-bone transition-opacity hover:opacity-90"
                >
                  Load the map
                </button>
                <a
                  href={OPEN_IN_MAPS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-teak transition-colors hover:text-ink"
                >
                  Or open in Google Maps ↗
                </a>
              </div>
            )}
          </div>
        </div>

        {loaded ? (
          <a
            href={OPEN_IN_MAPS}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-teak transition-colors hover:text-ink"
          >
            Open in Google Maps
            <span aria-hidden>↗</span>
          </a>
        ) : null}
      </Container>
    </section>
  );
}

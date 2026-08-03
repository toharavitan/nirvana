/**
 * The media map.
 *
 * Every asset the site uses is declared here once, with its intrinsic size and
 * its alt text, so sections reference a key rather than a path. Swapping a
 * photograph — or replacing a video with a re-shot one — is a change in this
 * file and nowhere else.
 *
 * Dimensions come from `scripts/prepare-images.mjs`, which writes the manifest
 * as it encodes. They are needed so next/image can reserve space and avoid
 * layout shift without a static import per file.
 */
import manifest from "./image-manifest.json";

export type ImageKey =
  | "aerial-tamarindo"
  | "bathroom-double"
  | "bathroom-guest"
  | "bathroom-shower"
  | "bathroom-vanity"
  | "bedroom-ensuite"
  | "bedroom-garden"
  | "bedroom-hall"
  | "bedroom-king"
  | "bedroom-poolside"
  | "bedroom-second"
  | "bedroom-terrace"
  | "bedroom-window-seat"
  | "desk-nook"
  | "entrance-gate"
  | "entrance-sign"
  | "garden-path"
  | "indoor-outdoor"
  | "kitchen"
  | "kitchen-detail"
  | "kitchen-living"
  | "kitchen-open"
  | "living-detail"
  | "living-dining"
  | "living-room"
  | "palm-path"
  | "palm-walkway"
  | "pool-daybed"
  | "pool-dusk"
  | "pool-palapa"
  | "pool-villa-day"
  | "shower-detail"
  | "street-frontage"
  | "terrace-chairs"
  | "terrace-pool"
  | "terrace-seating"
  | "villa-gate";

export interface SiteImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** Alt text is descriptive rather than decorative — these carry the story. */
const ALT: Record<ImageKey, string> = {
  "aerial-tamarindo":
    "Aerial view of the villas' tiled roofs and pools with Tamarindo bay and the Pacific beyond",
  "bathroom-double":
    "Bathroom with a double marble vanity, walk-in stone shower and teak ceiling",
  "bathroom-guest": "Guest bathroom with a glass walk-in shower and stone tile",
  "bathroom-shower": "Walk-in rain shower clad in warm stone with a built-in bench",
  "bathroom-vanity": "Marble vanity and mirror against a polished plaster wall",
  "bedroom-ensuite": "Bedroom in teak and white linen opening to its own ensuite",
  "bedroom-garden": "Bedroom with sliding glass doors opening onto the pool terrace",
  "bedroom-hall": "Hallway of built-in teak joinery leading through to the bedroom",
  "bedroom-king": "King bedroom with teak headboard and a clerestory window of palms",
  "bedroom-poolside":
    "Bedroom under a teak ceiling with glass doors sliding open to the private pool",
  "bedroom-second": "Second bedroom with teak desk and full-height wardrobes",
  "bedroom-terrace": "Bedroom opening onto a shaded terrace and tropical planting",
  "bedroom-window-seat":
    "Bedroom window seat framing a fan palm in the courtyard beyond",
  "desk-nook": "Marble writing desk beneath two circular porthole windows",
  "entrance-gate":
    "The Nirvana entrance: a dark timber gate set into a stucco wall beneath palms",
  "entrance-sign": "Weathered timber Nirvana Tamarindo Boutique Villas sign on stucco",
  "garden-path": "Planted path running between the villas beneath young palms",
  "indoor-outdoor":
    "View from inside a villa through open sliding doors to the pool terrace",
  kitchen: "Open kitchen with marble island, teak cabinetry and a rattan pendant",
  "kitchen-detail": "Marble island, woven barstools and open teak shelving",
  "kitchen-living": "Kitchen and living space beneath a full teak ceiling",
  "kitchen-open": "Kitchen island and dining seating open to the living room",
  "living-detail": "Live-edge coffee table, surfboard and porthole windows",
  "living-dining": "Living and dining room opening to the pool terrace",
  "living-room":
    "Living room under a teak ceiling with porthole windows and polished floors",
  "palm-path": "Paved path between black slatted walls and dense palms",
  "palm-walkway":
    "Palm-lined walkway running the length of the property toward the villas",
  "pool-daybed": "Thatched palapa and daybed at the edge of a private pool",
  "pool-dusk": "A private pool lit from within at dusk, the villa glowing behind it",
  "pool-palapa": "Private pool and terrace framed by a teak soffit and palms",
  "pool-villa-day":
    "Private pool under blue sky with the villa's glass doors folded open",
  "shower-detail": "Rain shower head and stone bench in a walk-in shower",
  "street-frontage": "The property's stucco frontage and covered parking from the lane",
  "terrace-chairs": "Two woven chairs on a limestone terrace beside teak screening",
  "terrace-pool": "Covered terrace with lounge seating running alongside the pool",
  "terrace-seating": "Woven armchairs and a low table on a shaded private terrace",
  "villa-gate": "A villa's private gate in dark slatted timber, set among fan palms",
};

const DIMENSIONS = new Map(
  (manifest as { slug: string; width: number; height: number }[]).map((entry) => [
    entry.slug,
    entry,
  ]),
);

/** Resolves a key to everything next/image needs. Throws early on a typo. */
export function image(key: ImageKey): SiteImage {
  const dimensions = DIMENSIONS.get(key);

  if (!dimensions) {
    throw new Error(
      `Image "${key}" is missing from the manifest. ` +
        `Re-run scripts/prepare-images.mjs.`,
    );
  }

  return {
    src: `/images/${key}.webp`,
    width: dimensions.width,
    height: dimensions.height,
    alt: ALT[key],
  };
}

// ---------------------------------------------------------------------------
// Scroll-scrubbed video
// ---------------------------------------------------------------------------

export interface ScrollVideoSource {
  /** Full-size rendition. */
  desktop: string;
  /** Narrower, lower-bitrate rendition served to phones. */
  mobile: string;
  /** First frame. Shown while loading and in place of video under reduced motion. */
  poster: string;
  /** Source duration in seconds — used to size the scroll range against the cut. */
  duration: number;
  /** Describes the shot for assistive technology. */
  description: string;
}

/**
 * The eight source clips are one continuous camera move — a descent from
 * above Tamarindo that lands at the gate, through it and down the walkway,
 * along the path to a villa's own door, through that door past the pool,
 * off the terrace into the living room, across to the kitchen, through to
 * the bedroom, and back out to finish wide on the pool.
 * `scripts/prepare-videos.mjs` concatenates them into this single file so
 * one pinned section scrubs the whole move; the cuts land on frame
 * boundaries at ≈0.12, ≈0.25, ≈0.37, ≈0.50, ≈0.62, ≈0.75 and ≈0.87 of the
 * playhead, which ScrollVideo's overlay timing is written against.
 */
export const VIDEO: Record<"journey", ScrollVideoSource> = {
  journey: {
    desktop: "/videos/journey-desktop.mp4",
    mobile: "/videos/journey-mobile.mp4",
    poster: "/videos/journey-poster.webp",
    duration: 39.75,
    description:
      "Aerial descent over Tamarindo, coming to rest at the Nirvana gate — then moving through it, down the palm-lined walkway, up to a villa's private gate, past the pool, inside through the living room and kitchen to the bedroom, and back out to the pool and palapa",
  },
};

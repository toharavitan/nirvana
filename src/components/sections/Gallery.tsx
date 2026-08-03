"use client";

import NextImage from "next/image";
import { useRef, useState } from "react";

import {
  STAGGER,
  batchReveal,
  textReveal,
  useGSAPAnimation,
} from "@leadstrikes/motion-engine";

import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline } from "@/components/ui/Typography";
import { image, type ImageKey, type SiteImage } from "@/content/media";

/**
 * Two side columns that scroll past a sticky centre column — the third
 * column holds its frame while the other two carry on. `position: sticky`
 * does the whole effect; it needs no scroll library of its own and rides
 * whatever the page's scroll container already is, which is the engine's
 * Lenis instance. A second Lenis here would fight that one for control of
 * the scroll — see `ScrollVideo`'s doc comment for the same rule.
 *
 * The sticky slot is reserved for the three images worth lingering on —
 * everything else moves at normal reading pace either side of it.
 */
const LEFT: ImageKey[] = [
  "bedroom-garden",
  "shower-detail",
  "living-dining",
  "garden-path",
  "bathroom-double",
  "kitchen-open",
  "desk-nook",
  "terrace-chairs",
];

const STICKY: ImageKey[] = ["pool-villa-day", "bedroom-poolside", "pool-palapa"];

const RIGHT: ImageKey[] = [
  "terrace-pool",
  "palm-path",
  "bedroom-king",
  "indoor-outdoor",
  "bathroom-shower",
  "living-detail",
  "bedroom-window-seat",
];

export function Gallery() {
  const scope = useRef<HTMLDivElement>(null);

  const left = LEFT.map((key) => image(key));
  const sticky = STICKY.map((key) => image(key));
  const right = RIGHT.map((key) => image(key));

  useGSAPAnimation(() => {
    const cleanup = textReveal(".gallery-headline", { split: "lines", scroll: true });
    batchReveal(".gallery-tile", { stagger: STAGGER.tight, batchMax: 6 });
    return cleanup;
  }, { scope });

  return (
    <section ref={scope} id="gallery">
      <header className="bg-bone py-28 sm:py-40">
        <Container width="wide">
          <div className="max-w-2xl">
            <Eyebrow index="04">The property</Eyebrow>
            <Headline accent={2} className="gallery-headline mt-6 text-ink">
              A closer look.
            </Headline>
          </div>
        </Container>
      </header>

      <div className="bg-ink px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-12">
          <div className="col-span-2 grid gap-2 sm:gap-4 lg:col-span-4">
            {left.map((photo) => (
              <GalleryTile key={photo.src} photo={photo} />
            ))}
          </div>

          {/*
            Hidden below lg: three stacked images sticking one at a time
            reads as a stutter on a phone-height viewport — the effect needs
            room to breathe that only a wide screen has. Mobile gets the
            photos folded into the two scrolling columns instead, further
            down this file.
          */}
          <div className="col-span-4 top-4 hidden h-[calc(100svh-2rem)] grid-rows-3 gap-4 sm:top-6 sm:h-[calc(100svh-3rem)] lg:sticky lg:grid">
            {sticky.map((photo) => (
              <GalleryTile key={photo.src} photo={photo} fill />
            ))}
          </div>

          <div className="col-span-2 grid gap-2 sm:gap-4 lg:col-span-4">
            {right.map((photo) => (
              <GalleryTile key={photo.src} photo={photo} />
            ))}
            {/* The trio only the sticky column shows on large screens. */}
            <div className="grid gap-2 sm:gap-4 lg:hidden">
              {sticky.map((photo) => (
                <GalleryTile key={`m-${photo.src}`} photo={photo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * One frame. Reserved at its native ratio so the column never shifts, and the
 * photograph itself only fades up once it has actually decoded — the reveal
 * animates the frame, the load animates the print into it.
 *
 * `fill` drops the aspect-ratio reservation in favour of stretching to the
 * parent's height — used only inside the sticky column, whose rows are
 * already sized by the grid.
 */
function GalleryTile({ photo, fill = false }: { photo: SiteImage; fill?: boolean }) {
  const [loaded, setLoaded] = useState(false);

  // The first clause of the alt text doubles as a plate caption —
  // content-true, and written once.
  const caption = photo.alt.split(/[,—]/)[0];

  return (
    <figure
      className={`gallery-tile group relative overflow-hidden rounded-lg border border-bone/10 bg-ink-soft ${fill ? "h-full w-full" : "w-full"}`}
      style={fill ? undefined : { aspectRatio: `${photo.width} / ${photo.height}` }}
    >
      <NextImage
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(max-width: 1024px) 50vw, 33vw"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={
          "object-cover transition-all duration-1000 ease-in-out will-change-transform group-hover:scale-[1.03] " +
          (loaded ? "opacity-100" : "opacity-0")
        }
      />
      {/*
        Hover-revealed on a precise pointer, but a coarse pointer (touch) has
        no hover state to reveal it with — so on touch devices the caption is
        simply always on. Below the "Hover vs Tap" rule: a caption is
        informational, not a primary action, so "always visible" is the
        correct touch fallback rather than a tap handler.
      */}
      <figcaption
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-5 pb-4 pt-14 font-sans text-[0.65rem] uppercase tracking-[0.2em] text-bone opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      >
        {caption}
      </figcaption>
    </figure>
  );
}

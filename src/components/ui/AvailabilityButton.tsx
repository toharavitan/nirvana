"use client";

import { useRef } from "react";

import {
  DURATION,
  EASING,
  fadeIn,
  reveal,
  useGSAPAnimation,
  useScrollTo,
} from "@leadstrikes/motion-engine";

/**
 * The one persistent action on the page: a calendar that takes the visitor
 * to the inquiry form. Ink and bone rather than a third-party green — it
 * belongs to the house, not to a messaging app. The label slides in a beat
 * after the icon, the way a concierge waits for you to look up.
 */
export function AvailabilityButton() {
  const scope = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo();

  useGSAPAnimation(() => {
    fadeIn(".avail-icon", {
      duration: DURATION.slow,
      delay: 2.2,
      ease: EASING.soft,
    });

    reveal(".avail-label", {
      direction: "right",
      duration: DURATION.base,
      delay: 3.2,
      ease: EASING.premium,
    });
  }, { scope });

  return (
    <div ref={scope} className="fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8">
      <button
        type="button"
        onClick={() => scrollTo("#inquire")}
        aria-label="Check availability"
        className="group flex cursor-pointer items-center gap-3"
      >
        <span
          className="avail-label hidden rounded-full border border-ink/10 bg-bone py-3 px-5 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-ink shadow-[0_8px_30px_rgba(20,25,26,0.18)] transition-transform duration-300 group-hover:-translate-x-0.5 sm:block"
          data-reveal
        >
          Check availability
        </span>

        <span
          className="avail-icon flex size-14 items-center justify-center rounded-full border border-bone/20 bg-ink text-bone shadow-[0_8px_30px_rgba(20,25,26,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:bg-teak group-hover:text-ink"
          data-reveal
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden
            className="size-6"
          >
            <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
            <path d="M16 3v4M8 3v4M3.5 11h17" />
          </svg>
        </span>
      </button>
    </div>
  );
}

"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";

import { reviews } from "@/content/site";

/** A row of five filled marks, the rating rendered rather than described. */
function Stars({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`tracking-[0.15em] ${className}`}>
      {"★★★★★"}
    </span>
  );
}

/**
 * The reviews pop-up.
 *
 * A button that opens an on-site modal listing real guest reviews — never a
 * redirect. The panel carries the aggregate (rating, Guest-favourite badge,
 * count), the reviews themselves, and only then a link out to read the full
 * set on Airbnb. Closes on Escape, on a backdrop click, or on the ✕; scroll is
 * locked behind it and focus is returned to the trigger on close.
 *
 * Every prop other than the click behaviour is spread onto the trigger, so it
 * inherits whatever styling and `data-reveal` the host section gives it.
 */
export function ReviewsDialog({
  children,
  ...rest
}: ComponentPropsWithoutRef<"button">) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    // Lock the page behind the modal, and remember what to restore.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        {...rest}
      >
        {children}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Guest reviews — rated ${reviews.rating} from ${reviews.count} stays`}
          className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-6"
        >
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          />

          <div
            ref={panelRef}
            tabIndex={-1}
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col bg-bone text-ink shadow-[0_30px_80px_rgba(20,25,26,0.45)] outline-none sm:max-h-[86vh]"
          >
            {/* Header — the aggregate ------------------------------------ */}
            <header className="flex items-start justify-between gap-6 border-b hairline px-6 py-6 sm:px-10 sm:py-8">
              <div>
                <p className="font-sans text-[0.65rem] uppercase tracking-[0.28em] text-stone">
                  {reviews.eyebrow}
                </p>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-display text-4xl font-light leading-none text-ink sm:text-5xl">
                    {reviews.rating}
                  </span>
                  <Stars className="text-teak" />
                  <span className="font-sans text-sm font-light text-clay">
                    {reviews.badge} · {reviews.count} reviews
                  </span>
                </div>
                <p className="mt-2 font-sans text-[0.7rem] uppercase tracking-[0.18em] text-stone">
                  {reviews.distinction}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close reviews"
                className="-mr-2 shrink-0 rounded-full p-2 text-clay transition-colors hover:text-ink"
              >
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </button>
            </header>

            {/* Body — the reviews. `data-lenis-prevent` hands wheel/touch here
                back to native scrolling (Lenis otherwise drives the page
                behind); `overscroll-contain` stops the scroll chaining to it
                at the ends. */}
            <div
              data-lenis-prevent
              className="overflow-y-auto overscroll-contain px-6 py-6 sm:px-10 sm:py-8"
            >
              <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {reviews.items.map((review) => (
                  <li
                    key={`${review.name}-${review.date}`}
                    className="border-t hairline pt-5"
                  >
                    <Stars className="text-sm text-teak" />
                    <p className="mt-3 font-sans text-sm font-light leading-relaxed text-clay text-pretty">
                      {review.text}
                    </p>
                    <p className="mt-4 font-display text-lg font-light text-ink">
                      {review.name}
                    </p>
                    <p className="font-sans text-[0.65rem] uppercase tracking-[0.18em] text-stone">
                      {review.location} · {review.date}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer — reference the full set --------------------------- */}
            <footer className="border-t hairline px-6 py-5 sm:px-10">
              <a
                href={reviews.allUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-[0.22em] text-teak transition-colors hover:text-ink"
              >
                Read all {reviews.count} reviews on Airbnb
                <span aria-hidden>↗</span>
              </a>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
}

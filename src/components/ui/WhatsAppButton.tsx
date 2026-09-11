"use client";

import { useRef } from "react";

import {
  DURATION,
  EASING,
  fadeIn,
  gsap,
  prefersReducedMotion,
  useGSAPAnimation,
} from "@leadstrikes/motion-engine";

import { site } from "@/content/site";

/**
 * The faster of the two persistent actions: WhatsApp is the working booking
 * channel in Costa Rica, so it sits above the calendar rather than beside it.
 *
 * This one breaks the house palette on purpose. The calendar button is ink and
 * bone because it belongs to the site; this one is WhatsApp green because it
 * belongs to WhatsApp, and the whole value of the control is that a visitor
 * recognises it before they read anything.
 *
 * A slow ring expands out from behind it to draw the eye. It is the only
 * looping animation on the page, so it is kept deliberately unhurried — and
 * skipped entirely under reduced motion, where a permanent pulse is exactly
 * the kind of thing that setting exists to stop.
 */
export function WhatsAppButton() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAPAnimation(() => {
    // Lands between the calendar's icon (2.2s) and its label (3.2s), so the
    // corner assembles as one cascade instead of two competing entrances.
    fadeIn(".whatsapp-icon", {
      duration: DURATION.slow,
      delay: 2.5,
      ease: EASING.soft,
    });

    // Decorative and infinite: the engine's primitives all resolve to a
    // finished end state, so this one is a raw tween. Gated by hand because
    // that means it doesn't inherit the engine's reduced-motion policy.
    if (prefersReducedMotion()) return;

    gsap.fromTo(
      ".whatsapp-pulse",
      { scale: 1, opacity: 0.55 },
      {
        scale: 1.8,
        opacity: 0,
        duration: 2.4,
        ease: "power2.out",
        repeat: -1,
        repeatDelay: 0.5,
        // Starts once the button has finished arriving.
        delay: 3.4,
      },
    );
  }, { scope });

  // wa.me wants bare digits — the stored number carries a leading + and the
  // client may yet paste one back with spaces or dashes in it.
  const number = site.contact.whatsapp.replace(/\D/g, "");
  const href = `https://wa.me/${number}?text=${encodeURIComponent(
    site.contact.whatsappMessage,
  )}`;

  return (
    <div ref={scope}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${site.contact.whatsappLabel} Message us on WhatsApp`}
        className="group relative flex items-center"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute right-full mr-3 hidden translate-x-2 whitespace-nowrap rounded-full border border-ink/10 bg-bone px-5 py-3 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-ink opacity-0 shadow-[0_8px_30px_rgba(20,25,26,0.18)] transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block"
        >
          {site.contact.whatsappLabel}
        </span>

        <span
          className="whatsapp-icon relative flex size-14 items-center justify-center"
          data-reveal
        >
          {/*
            The ring sits behind the circle and is purely decorative, so it
            never intercepts the click. Scale and opacity only — it costs one
            compositor layer and no layout.
          */}
          <span
            aria-hidden
            className="whatsapp-pulse pointer-events-none absolute inset-0 rounded-full bg-whatsapp opacity-0"
          />

          <span className="relative flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_8px_28px_rgba(37,211,102,0.45)] transition-all duration-300 group-hover:scale-110 group-hover:bg-whatsapp-deep group-hover:shadow-[0_10px_36px_rgba(37,211,102,0.65)] group-active:scale-95">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-7">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
          </span>
        </span>
      </a>
    </div>
  );
}

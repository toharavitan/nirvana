"use client";

import { useRef } from "react";

import {
  DURATION,
  EASING,
  gsap,
  useGSAPAnimation,
  useScrollTo,
  watchPageScrollProgress,
} from "@leadstrikes/motion-engine";

import { nav, site } from "@/content/site";

/**
 * A header in two registers.
 *
 * Over the arrival it is barely there: a monogram, four thin links, no
 * ground — chrome that whispers over the footage. Once the video story is
 * behind the visitor it takes the solid bone bar. The switch is a data
 * attribute toggled from an IntersectionObserver — deliberately not a
 * ScrollTrigger, because this header mounts before the hero creates its pin
 * spacer and a trigger built against that early layout keeps a stale start.
 */
export function SiteNav() {
  const scope = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const scrollTo = useScrollTo();

  useGSAPAnimation(() => {
    const bar = scope.current;
    if (!bar) return;

    // Arrives with the wordmark, a beat behind it.
    gsap.set(bar, { autoAlpha: 0, y: -16 });
    gsap.to(bar, {
      autoAlpha: 1,
      y: 0,
      duration: DURATION.slow,
      delay: 1.4,
      ease: EASING.premium,
    });

    const story = document.getElementById("story");
    if (!story) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Solid once the story reaches the top 60% of the viewport, and for
        // everything below it.
        bar.dataset.solid = String(
          entry.isIntersecting || entry.boundingClientRect.top < 0,
        );
      },
      { rootMargin: "0px 0px -40% 0px" },
    );
    observer.observe(story);

    // The reader's place in the story, as a teak hairline under the bar.
    // Driven through a ref — never state — so it costs nothing per frame.
    const unwatch = watchPageScrollProgress((progress) => {
      const line = progressRef.current;
      if (line) line.style.transform = `scaleX(${progress})`;
    });

    return () => {
      observer.disconnect();
      unwatch();
    };
  }, { scope });

  return (
    <header
      ref={scope}
      data-solid="false"
      className="fixed inset-x-0 top-0 z-50 text-bone transition-colors duration-500 data-[solid=true]:border-b data-[solid=true]:border-ink/5 data-[solid=true]:bg-bone/85 data-[solid=true]:text-ink data-[solid=true]:backdrop-blur-md"
    >
      <span
        ref={progressRef}
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-teak"
      />

      <div className="mx-auto flex max-w-[100rem] items-center justify-between px-6 py-5 sm:px-10">
        <button
          type="button"
          onClick={() => scrollTo(0)}
          aria-label={`${site.name} — back to top`}
          className="cursor-pointer font-display text-3xl font-light leading-none"
        >
          N
        </button>

        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => scrollTo(item.href)}
              className="relative cursor-pointer font-sans text-[0.68rem] uppercase tracking-[0.25em] opacity-70 transition-opacity after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-teak after:transition-all after:duration-300 hover:opacity-100 hover:after:w-full"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

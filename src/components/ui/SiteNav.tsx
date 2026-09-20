"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  DURATION,
  EASING,
  gsap,
  useGSAPAnimation,
  useScrollTo,
  watchPageScrollProgress,
} from "@leadstrikes/motion-engine";

import { nav, site } from "@/content/site";

import nirvanaWordmark from "@/assets/nirvana-wordmark.png";

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

  // Which dropdown (if any) is open, keyed by its label.
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  // The mobile full-screen menu.
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock scroll and close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // The home page is one scrolled document; every other route is a plain page.
  // Off home the bar has no dark hero to sit over, so it starts solid and skips
  // the story observer entirely.
  const pathname = usePathname();
  const isHome = pathname === "/";

  // A hash target resolves to a section on the home page. On home we scroll to
  // it; from any other route we send the visitor home first, hash and all.
  const resolveHash = (href: string) => (isHome ? href : `/${href}`);

  useGSAPAnimation(() => {
    const bar = scope.current;
    if (!bar) return;

    // On home it arrives with the wordmark, a beat behind it; elsewhere there's
    // no wordmark sequence to wait on, so it comes in promptly.
    gsap.set(bar, { autoAlpha: 0, y: -16 });
    gsap.to(bar, {
      autoAlpha: 1,
      y: 0,
      duration: DURATION.slow,
      delay: isHome ? 1.4 : 0.2,
      ease: EASING.premium,
    });

    // Only the home page has a #story section to switch the bar's register
    // against; off home it stays solid, set from the server.
    if (!isHome) return;

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
    <>
    <header
      ref={scope}
      data-solid={String(!isHome)}
      className="group fixed inset-x-0 top-0 z-50 text-bone transition-colors duration-500 data-[solid=true]:border-b data-[solid=true]:border-ink/5 data-[solid=true]:bg-bone/85 data-[solid=true]:text-ink data-[solid=true]:backdrop-blur-md"
    >
      <span
        ref={progressRef}
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-teak"
      />

      <div className="relative mx-auto flex max-w-[100rem] items-center justify-between px-6 py-5 sm:px-10">
        {/* Logo, left. White over the hero; darkened to ink once the bar is
            solid (the wordmark art is white on transparent). */}
        {isHome ? (
          <button
            type="button"
            onClick={() => scrollTo(0)}
            aria-label={`${site.name} — back to top`}
            className="flex cursor-pointer items-center leading-none"
          >
            <Image
              src={nirvanaWordmark}
              alt={site.fullName}
              priority
              className="h-5 w-auto select-none transition-[filter] duration-500 group-data-[solid=true]:brightness-0 sm:h-6"
            />
          </button>
        ) : (
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="flex items-center leading-none"
          >
            <Image
              src={nirvanaWordmark}
              alt={site.fullName}
              priority
              className="h-5 w-auto select-none transition-[filter] duration-500 group-data-[solid=true]:brightness-0 sm:h-6"
            />
          </Link>
        )}

        {/* Links, centred. Absolutely centred so they stay put regardless of
            the logo and button widths on either side. */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-10 md:flex">
          {nav.map((item) => {
            const linkClass =
              "relative cursor-pointer font-sans text-[0.68rem] uppercase tracking-[0.25em] opacity-70 transition-opacity after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-teak after:transition-all after:duration-300 hover:opacity-100 hover:after:w-full";
            const isHash = item.href.startsWith("#");

            // Item with a submenu (the villas): the trigger links to the villas
            // index; hover or focus opens a dropdown of the individual villas.
            if (item.menu) {
              const open = openMenu === item.label;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                  onFocus={() => setOpenMenu(item.label)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setOpenMenu(null);
                    }
                  }}
                >
                  {/* Clicking the trigger goes to the villas index; hover or
                      focus opens the submenu of individual villas. */}
                  <Link
                    href={item.href}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    onClick={() => setOpenMenu(null)}
                    className={`${linkClass} inline-flex items-center gap-1.5`}
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden
                      className={`size-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </Link>

                  {/* pt-4 is a transparent bridge so the pointer can cross the
                      gap from trigger to panel without dropping the hover. */}
                  <div
                    className={`absolute left-1/2 top-full -translate-x-1/2 pt-4 transition-all duration-200 ${
                      open
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-1 opacity-0"
                    }`}
                  >
                    <ul
                      role="menu"
                      className="min-w-52 border border-ink/10 bg-bone/95 p-2 text-ink shadow-[0_24px_60px_rgba(20,25,26,0.22)] backdrop-blur-md"
                    >
                      {item.menu.map((sub) => (
                        <li key={sub.href} role="none">
                          <Link
                            role="menuitem"
                            href={sub.href}
                            onClick={() => setOpenMenu(null)}
                            className="block px-4 py-2.5 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-clay transition-colors hover:bg-sand hover:text-ink"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            }

            // Hash target on the home page: smooth-scroll in place. Every other
            // case is a real navigation.
            if (isHash && isHome) {
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => scrollTo(item.href)}
                  className={linkClass}
                >
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={isHash ? resolveHash(item.href) : item.href}
                className={linkClass}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster: book button (all sizes) and, on mobile, the menu
            toggle. Borders/text inherit the bar's current colour. */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href={site.contact.airbnb}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-current px-4 py-2.5 font-sans text-[0.6rem] uppercase tracking-[0.22em] transition-colors duration-300 hover:border-teak hover:bg-teak hover:text-bone sm:px-5 sm:text-[0.68rem]"
          >
            Book your stay
          </a>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="-mr-1 flex size-9 items-center justify-center md:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    </header>

      {/* Mobile full-screen menu. Rendered outside <header> because GSAP leaves
          a transform on the bar, which would otherwise contain this fixed
          overlay to the header's box instead of the viewport. */}
      {mobileOpen ? (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[120] flex flex-col overscroll-contain bg-bone text-ink md:hidden"
        >
          <div className="flex items-center justify-between px-6 py-5">
            <Image
              src={nirvanaWordmark}
              alt={site.fullName}
              className="h-5 w-auto select-none brightness-0"
            />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="-mr-1 flex size-9 items-center justify-center text-clay transition-colors hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-8 overflow-y-auto px-8 pb-12">
            {nav.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-4xl font-light text-ink"
                >
                  {item.label}
                </Link>
                {item.menu ? (
                  <div className="mt-4 flex flex-col gap-3 border-l hairline pl-5">
                    {item.menu
                      .filter((sub) => sub.href !== item.href)
                      .map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="font-sans text-[0.75rem] uppercase tracking-[0.22em] text-clay transition-colors hover:text-teak"
                        >
                          {sub.label}
                        </Link>
                      ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="px-8 pb-10">
            <a
              href={site.contact.airbnb}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="block border border-ink px-6 py-4 text-center font-sans text-[0.7rem] uppercase tracking-[0.24em] text-ink transition-colors hover:border-teak hover:bg-teak hover:text-bone"
            >
              Book your stay
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}

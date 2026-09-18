import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { hero, nav, site } from "@/content/site";

import nirvanaLogo from "@/assets/nirvana-logo.png";

/**
 * The colophon. The wordmark runs at plate scale — the last thing the visitor
 * reads is the name, set the way it opened the page, closing the loop.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-bone/10 bg-ink pb-16 pt-20 text-bone">
      <Container width="wide">
        <p
          aria-hidden
          className="select-none text-center font-display text-[clamp(3rem,11vw,9.5rem)] font-light uppercase leading-none tracking-[0.22em] text-bone/[0.07]"
        >
          {site.name}
        </p>

        <div className="mt-16 grid gap-12 border-t border-bone/10 pt-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src={nirvanaLogo}
              alt={site.fullName}
              className="h-16 w-auto"
              priority={false}
            />
            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-bone/50">
              {site.tagline}
            </p>
          </div>

          <div>
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.22em] text-bone/40">
              Find us
            </p>
            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-bone/60">
              {site.location.town}, {site.location.province}
              <br />
              {site.location.country}
              <br />
              <span className="text-bone/40">{hero.coordinates}</span>
            </p>
          </div>

          <div>
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.22em] text-bone/40">
              Contact
            </p>
            <div className="mt-4 flex flex-col gap-2 font-sans text-sm font-light text-bone/60">
              <a
                href={`mailto:${site.contact.email}`}
                className="w-fit transition-colors hover:text-bone"
              >
                {site.contact.email}
              </a>
              <a
                href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                className="w-fit transition-colors hover:text-bone"
              >
                {site.contact.phone}
              </a>
              <a
                href={site.contact.airbnb}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit transition-colors hover:text-bone"
              >
                Book on Airbnb
              </a>
            </div>
          </div>

          <div>
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.22em] text-bone/40">
              The property
            </p>
            <ul className="mt-4 flex flex-col gap-2 font-sans text-sm font-light text-bone/60">
              {nav.map((item) => {
                // A menu item (Villas) points at its first villa page; hash
                // targets live on the home page, so prefix them with "/" to
                // resolve from any route; path links pass through unchanged.
                const href = item.menu
                  ? item.menu[0].href
                  : item.href.startsWith("#")
                    ? `/${item.href}`
                    : item.href;
                return (
                  <li key={item.label}>
                    <a
                      href={href}
                      className="w-fit transition-colors hover:text-bone"
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-bone/10 pt-8 font-sans text-xs font-light text-bone/30 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </p>
          <a href="/terms" className="w-fit transition-colors hover:text-bone/60">
            Terms &amp; Conditions
          </a>
        </div>
      </Container>
    </footer>
  );
}

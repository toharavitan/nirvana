"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";

import {
  STAGGER,
  imageZoom,
  reveal,
  textReveal,
  useGSAPAnimation,
} from "@leadstrikes/motion-engine";

import { Container } from "@/components/ui/Container";
import { Eyebrow, Headline, Lead } from "@/components/ui/Typography";
import { image } from "@/content/media";
import { inquiry, site } from "@/content/site";
import { ReservationCalendar } from "./ReservationCalendar";

type Status = "idle" | "sending" | "sent" | "error";

// The focus state is a teak line growing along the baseline rather than a
// color swap — the underline draws itself in, left to right, like a pen.
const FIELD =
  "w-full border-0 border-b border-bone/25 bg-transparent pb-3 pt-2 " +
  "font-sans text-base font-light text-bone placeholder:text-bone/35 " +
  "bg-[linear-gradient(to_right,var(--color-teak-light),var(--color-teak-light))] " +
  "bg-no-repeat [background-position:0_100%] [background-size:0%_1px] " +
  "transition-[background-size] duration-500 focus:[background-size:100%_1px] " +
  "focus:outline-none";

const LABEL =
  "block font-sans text-[0.65rem] uppercase tracking-[0.22em] text-bone/50";

/**
 * The conversion moment, and the last thing on the page.
 *
 * Set over the dusk pool because it is the only photograph in the set taken
 * after dark — arriving here should feel like the end of the day rather than
 * another room.
 */
export function Inquiry() {
  const scope = useRef<HTMLDivElement>(null);
  const backdrop = image("pool-dusk");

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useGSAPAnimation(() => {
    imageZoom(".inquiry-image", { from: 1.08, to: 1.2 });

    const cleanup = textReveal(".inquiry-headline", { split: "lines", scroll: true });
    reveal(".inquiry-copy", { scroll: true });
    reveal(".inquiry-field", { stagger: STAGGER.tight, scroll: true });

    return cleanup;
  }, { scope });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("sending");
    setError(null);

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        received?: boolean;
        error?: string;
      };

      if (!response.ok || !result.received) {
        setError(result.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setError(
        "We couldn't reach the server. Please check your connection and try again.",
      );
      setStatus("error");
    }
  }

  return (
    <section ref={scope} className="relative isolate bg-ink" id="inquire">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={backdrop.src}
          alt={backdrop.alt}
          fill
          sizes="100vw"
          className="inquiry-image object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-ink/78" />
      </div>

      <Container className="relative py-32 sm:py-44">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <header className="lg:col-span-5">
            <Eyebrow index="06" className="text-bone/60">
              {inquiry.eyebrow}
            </Eyebrow>

            <Headline accent={2} className="inquiry-headline mt-6 text-bone">
              {inquiry.headline}
            </Headline>

            <Lead className="inquiry-copy mt-8 text-bone/70" data-reveal>
              {inquiry.body}
            </Lead>

            <a
              href={site.contact.airbnb}
              target="_blank"
              rel="noopener noreferrer"
              className="inquiry-copy mt-10 block font-sans text-sm font-light text-teak-light transition-colors hover:text-bone"
              data-reveal
            >
              ★ {inquiry.social}
            </a>

            <a
              href={`mailto:${site.contact.email}`}
              className="mt-6 inline-block border-b border-bone/30 pb-1 font-sans text-sm font-light text-bone/80 transition-colors hover:border-teak-light hover:text-bone"
            >
              {site.contact.email}
            </a>
          </header>

          <div className="lg:col-span-7">
            {status === "sent" ? (
              <div
                role="status"
                className="flex h-full flex-col justify-center border-l-2 border-teak py-6 pl-8"
              >
                <h3 className="font-display text-4xl font-light text-bone">
                  {inquiry.success.headline}
                </h3>
                <p className="mt-4 font-sans text-base font-light text-bone/70">
                  {inquiry.success.body}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-10">
                <div className="grid gap-10 sm:grid-cols-2">
                  <div className="inquiry-field" data-reveal>
                    <label className={LABEL} htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className={FIELD}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="inquiry-field" data-reveal>
                    <label className={LABEL} htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className={FIELD}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <ReservationCalendar />

                <div className="inquiry-field" data-reveal>
                  <label className={LABEL} htmlFor="guests">
                    Guests
                  </label>
                  <input
                    id="guests"
                    name="guests"
                    type="number"
                    min={1}
                    max={30}
                    className={FIELD}
                    placeholder="How many of you?"
                  />
                </div>

                <div className="inquiry-field" data-reveal>
                  <label className={LABEL} htmlFor="message">
                    Anything else
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className={`${FIELD} resize-none`}
                    placeholder="Occasion, questions, anything we should know"
                  />
                </div>

                {/* Honeypot. Off-screen rather than display:none so bots that
                    skip hidden inputs still fill it in. */}
                <div aria-hidden className="absolute left-[-9999px]">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="inquiry-field flex flex-wrap items-center gap-6" data-reveal>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="cursor-pointer border border-bone/30 px-10 py-4 font-sans text-[0.7rem] uppercase tracking-[0.25em] text-bone transition-all duration-300 hover:border-teak hover:bg-teak hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === "sending" ? "Sending…" : "Send inquiry"}
                  </button>

                  {status === "error" && error ? (
                    <p role="alert" className="font-sans text-sm text-teak-light">
                      {error}
                    </p>
                  ) : null}
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

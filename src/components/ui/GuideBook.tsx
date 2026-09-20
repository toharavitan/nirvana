"use client";

import HTMLFlipBook from "react-pageflip";
import { forwardRef, useEffect, useRef, useState } from "react";

/** A flip-book: rasterised pages in /public + a downloadable source. */
export interface Book {
  title: string;
  subtitle: string;
  pageCount: number;
  /** e.g. "/guide/page-" → "/guide/page-01.webp". */
  pathBase: string;
  downloadUrl: string;
}

// react-pageflip clones each child and attaches a ref, so a page must forward
// its ref to a real element.
const Leaf = forwardRef<HTMLDivElement, { src: string; alt: string; eager: boolean }>(
  function Leaf({ src, alt, eager }, ref) {
    return (
      <div ref={ref} className="guide-leaf bg-bone">
        {/* Plain <img>, not next/image — the flip library measures and moves
            the real DOM node, so hand it the least surprising element. */}
        <img
          src={src}
          alt={alt}
          className="block h-full w-full select-none object-cover"
          draggable={false}
          loading={eager ? "eager" : "lazy"}
        />
      </div>
    );
  },
);

interface Box {
  w: number;
  h: number;
  mobile: boolean;
}

// Size the book's parent so it always fits between the header and the controls
// — bound by BOTH the available width and height. On narrow screens it's a
// single full-width page (most readable); wider screens get a two-page spread.
function calcBox(): Box {
  const vw = window.innerWidth || 1024;
  const vh = window.innerHeight || 768;
  const mobile = vw < 640;
  const chrome = mobile ? 116 : 172; // header + controls
  const availH = Math.max(280, vh - chrome);
  const availW = vw - (mobile ? 16 : 64);
  const cols = mobile ? 1 : 2;
  const pageAR = 3 / 4; // page width / height

  // Widest the book can be before it gets too tall for the available height.
  const wByHeight = availH * pageAR * cols;
  const capW = mobile ? 560 : 1180;
  const w = Math.max(200, Math.min(availW, wByHeight, capW));
  const h = w / cols / pageAR;
  return { w: Math.round(w), h: Math.round(h), mobile };
}

/**
 * The concierge guide as a real page-turning book — StPageFlip (via
 * react-pageflip) in HTML mode, so each page is a live element with a genuine
 * curl. size="stretch" fills a parent we size to the viewport, so the book
 * reflows to fit any screen without ever being remounted. Client-only, so the
 * flip engine never runs on the server.
 */
export function GuideBook({
  book,
  onClose,
  initialPage = 0,
}: {
  book: Book;
  onClose: () => void;
  /** 0-based page index to open on. */
  initialPage?: number;
}) {
  const src = (n: number) =>
    `${book.pathBase}${String(n).padStart(2, "0")}.webp`;
  const PAGES = Array.from({ length: book.pageCount }, (_, i) => i + 1);

  const bookRef = useRef<{
    pageFlip: () => {
      flipNext: () => void;
      flipPrev: () => void;
      destroy?: () => void;
    };
  } | null>(null);

  const [box, setBox] = useState<Box | null>(null);
  const [page, setPage] = useState(initialPage);

  const flip = (d: number) => {
    const api = bookRef.current?.pageFlip();
    if (!api) return;
    if (d > 0) api.flipNext();
    else api.flipPrev();
  };

  // Page-turn sound effect, lazily created after the first open (audio can only
  // start from a user gesture, which opening the book is).
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTurn = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("/audio/page-turn.mp3");
        audioRef.current.volume = 0.5;
      }
      audioRef.current.currentTime = 0;
      void audioRef.current.play().catch(() => {});
    } catch {
      /* audio unavailable — silent */
    }
  };

  // Measure now, and on resize / orientation change (debounced). The parent
  // resizing makes StPageFlip reflow on its own — no remount.
  useEffect(() => {
    setBox(calcBox());
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setBox(calcBox()), 200);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  // Keys + scroll lock.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") flip(1);
      if (e.key === "ArrowLeft") flip(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  // Tear the flip engine down before React unmounts, so it never fights React
  // over DOM nodes it has moved.
  useEffect(() => {
    return () => {
      try {
        bookRef.current?.pageFlip()?.destroy?.();
      } catch {
        /* already gone */
      }
    };
  }, []);

  const N = book.pageCount;
  const left1 = page + 1;
  // On phones each leaf is a single page; wider screens show two-page spreads,
  // so only there does the counter read as a range.
  const single = box?.mobile ?? false;
  const label =
    single || page === 0 || left1 >= N
      ? `${Math.min(left1, N)} / ${N}`
      : `${left1}–${Math.min(left1 + 1, N)} / ${N}`;
  const atStart = page <= 0;
  const atEnd = page >= N - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${book.title} — flip-through guide`}
      data-lenis-prevent
      className="fixed inset-0 z-[200] flex flex-col overscroll-contain bg-ink/90 backdrop-blur-sm"
    >
      {/* Header ------------------------------------------------------- */}
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 text-bone sm:px-10 sm:py-5">
        <div className="min-w-0">
          <p className="font-sans text-[0.55rem] uppercase tracking-[0.26em] text-bone/50 sm:text-[0.6rem] sm:tracking-[0.28em]">
            {book.subtitle}
          </p>
          <p className="mt-0.5 truncate font-display text-lg font-light text-bone sm:mt-1 sm:text-2xl">
            {book.title}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close guide"
          className="-mr-1 shrink-0 rounded-full p-2 text-bone/70 transition-colors hover:text-bone"
        >
          <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </button>
      </div>

      {/* The book ----------------------------------------------------- */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 sm:px-6">
        <button
          type="button"
          aria-label="Close guide"
          onClick={onClose}
          tabIndex={-1}
          className="absolute inset-0 cursor-default"
        />

        {box ? (
          <div
            className="relative z-10"
            style={{ width: box.w, height: box.h }}
          >
            <HTMLFlipBook
              ref={bookRef}
              width={420}
              height={560}
              size="stretch"
              minWidth={200}
              maxWidth={700}
              minHeight={266}
              maxHeight={933}
              startPage={initialPage}
              drawShadow
              flippingTime={700}
              usePortrait
              startZIndex={0}
              autoSize
              maxShadowOpacity={0.5}
              showCover
              mobileScrollSupport={false}
              clickEventForward
              useMouseEvents
              swipeDistance={16}
              showPageCorners
              disableFlipByClick={false}
              className="guide-book mx-auto"
              style={{}}
              onFlip={(e: { data: number }) => setPage(e.data)}
              onChangeState={(e: { data: string }) => {
                // Fires at the start of every turn (drag or button) — cue the
                // page-turn sound then.
                if (e.data === "flipping") playTurn();
              }}
            >
              {PAGES.map((n) => (
                <Leaf
                  key={n}
                  src={src(n)}
                  alt={`${book.title} — page ${n}`}
                  eager={n <= 4}
                />
              ))}
            </HTMLFlipBook>
          </div>
        ) : null}
      </div>

      {/* Controls ----------------------------------------------------- */}
      <div className="flex shrink-0 items-center justify-center gap-5 px-4 py-3 text-bone sm:gap-6 sm:py-5">
        <button
          type="button"
          onClick={() => flip(-1)}
          disabled={atStart}
          aria-label="Previous page"
          className="flex size-11 items-center justify-center rounded-full border border-bone/25 transition-colors hover:border-teak hover:bg-teak hover:text-ink disabled:opacity-30 disabled:hover:border-bone/25 disabled:hover:bg-transparent disabled:hover:text-bone"
        >
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>

        <span className="min-w-20 text-center font-sans text-[0.7rem] uppercase tracking-[0.22em] text-bone/70 tabular-nums sm:min-w-24">
          {label}
        </span>

        <button
          type="button"
          onClick={() => flip(1)}
          disabled={atEnd}
          aria-label="Next page"
          className="flex size-11 items-center justify-center rounded-full border border-bone/25 transition-colors hover:border-teak hover:bg-teak hover:text-ink disabled:opacity-30 disabled:hover:border-bone/25 disabled:hover:bg-transparent disabled:hover:text-bone"
        >
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>

        <a
          href={book.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 hidden font-sans text-[0.65rem] uppercase tracking-[0.22em] text-teak-light transition-colors hover:text-bone sm:inline"
        >
          Download PDF ↗
        </a>
      </div>
    </div>
  );
}

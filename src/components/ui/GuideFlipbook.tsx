"use client";

import dynamic from "next/dynamic";
import { useRef, useState, type ComponentPropsWithoutRef } from "react";

import type { Book } from "./GuideBook";

// The book (and the flip engine it pulls in) touches the DOM at load, so it is
// only ever loaded in the browser, and only once opened.
const GuideBook = dynamic(
  () => import("./GuideBook").then((m) => m.GuideBook),
  { ssr: false },
);

/**
 * A trigger button that opens a flip-book (the concierge guide, the house
 * manual, …). The book is code-split and mounted only when opened. Every prop
 * other than `book` is spread onto the trigger.
 */
export function GuideFlipbook({
  book,
  children,
  ...rest
}: { book: Book } & ComponentPropsWithoutRef<"button">) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
        <GuideBook
          book={book}
          onClose={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
        />
      ) : null}
    </>
  );
}

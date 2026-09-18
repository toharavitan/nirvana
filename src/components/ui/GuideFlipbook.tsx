"use client";

import dynamic from "next/dynamic";
import { useRef, useState, type ComponentPropsWithoutRef } from "react";

// The book (and the flip engine it pulls in) touches the DOM at load, so it is
// only ever loaded in the browser, and only once the guide is opened.
const GuideBook = dynamic(
  () => import("./GuideBook").then((m) => m.GuideBook),
  { ssr: false },
);

/**
 * Trigger for the on-site concierge guide. The button lives in the page; the
 * page-turning book itself is code-split and mounted only when opened.
 *
 * Every prop other than the click behaviour is spread onto the trigger.
 */
export function GuideFlipbook({
  children,
  ...rest
}: ComponentPropsWithoutRef<"button">) {
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
          onClose={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
        />
      ) : null}
    </>
  );
}

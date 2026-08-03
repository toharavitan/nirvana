import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/**
 * The small tracked-out label that opens a section. Deliberately quiet — it
 * orients the reader without competing with the headline underneath.
 *
 * With an `index` it becomes drawing-sheet notation — "01 · THE IDEA ——" —
 * numbering the chapters of the page the way an architectural set numbers
 * its sheets. Rest props are spread so `data-reveal` reaches the DOM.
 */
export function Eyebrow({
  children,
  index,
  className = "",
  ...rest
}: {
  children: ReactNode;
  index?: string;
  className?: string;
} & ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={
        "flex items-center gap-4 font-sans text-[0.7rem] font-medium uppercase " +
        `tracking-[0.28em] text-stone ${className}`
      }
      {...rest}
    >
      {index ? (
        <span aria-hidden className="text-teak">
          {index}
        </span>
      ) : null}
      <span>{children}</span>
      {index ? (
        <span aria-hidden className="h-px w-12 bg-current opacity-40" />
      ) : null}
    </p>
  );
}

/**
 * Section headline. Serif, light weight, tight leading — the weight comes from
 * the size and the space around it rather than from the stroke.
 *
 * `accent` italicizes the final N words. The italic is the voice shift of an
 * editorial deck — same size, same color, different register.
 */
export function Headline({
  children,
  as: Tag = "h2",
  accent,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  accent?: number;
  className?: string;
}) {
  let content: ReactNode = children;

  if (accent && typeof children === "string") {
    const words = children.trim().split(" ");
    if (accent < words.length) {
      const head = words.slice(0, -accent).join(" ");
      const tail = words.slice(-accent).join(" ");
      content = (
        <>
          {head} <em className="italic">{tail}</em>
        </>
      );
    }
  }

  return (
    <Tag
      className={
        "font-display text-[length:var(--text-headline)] font-light " +
        `leading-[1.05] tracking-[-0.01em] text-balance ${className}`
      }
    >
      {content}
    </Tag>
  );
}

export function Lead({
  children,
  className = "",
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={
        "font-sans text-[length:var(--text-lead)] font-light leading-[1.7] " +
        `text-clay text-pretty ${className}`
      }
      {...rest}
    >
      {children}
    </p>
  );
}

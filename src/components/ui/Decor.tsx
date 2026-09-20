import type { StaticImageData } from "next/image";

interface DecorProps {
  /** A statically-imported SVG (used as a CSS mask so it can be tinted). */
  src: StaticImageData | string;
  /** Position + size utilities, e.g. "right-[-6%] top-[-8%] size-[480px]". */
  className?: string;
  /** Any CSS colour; defaults to a soft clay so it reads as a watermark. */
  color?: string;
  opacity?: number;
}

/**
 * A decorative line-art motif, drawn as a faint tinted watermark behind a
 * section's content. The SVG art is black, so it's used as a mask over a
 * coloured box rather than shown directly — that lets it take a brand tone and
 * sit quietly under the page.
 *
 * Place inside a `relative overflow-hidden` section, with the real content in a
 * sibling that has a higher stacking order (e.g. `relative z-10`).
 */
export function Decor({
  src,
  className = "",
  color = "var(--color-clay)",
  opacity = 0.07,
}: DecorProps) {
  const url = typeof src === "string" ? src : src.src;

  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-0 ${className}`}
      style={{
        backgroundColor: color,
        opacity,
        maskImage: `url(${url})`,
        WebkitMaskImage: `url(${url})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

import Image, { type StaticImageData } from "next/image";

interface BotanicalProps {
  /** A white-background botanical image (JPEG). */
  src: StaticImageData;
  /** Position + size utilities, e.g. "right-[-3%] top-24 w-64". */
  className?: string;
  opacity?: number;
}

/**
 * A decorative botanical image dropped into a light section. The source art
 * sits on a white background, so it's composited with `mix-blend-multiply`:
 * the white drops away against the page and only the drawing remains. Sits
 * behind content (z-0); keep the real content at a higher stacking order.
 */
export function Botanical({ src, className = "", opacity = 0.8 }: BotanicalProps) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      sizes="600px"
      style={{ opacity }}
      className={`pointer-events-none absolute z-0 mix-blend-multiply ${className}`}
    />
  );
}

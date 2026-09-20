import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  /** `wide` for full-bleed editorial rows, `narrow` for reading columns. */
  width?: "narrow" | "default" | "wide";
  className?: string;
}

const WIDTHS = {
  narrow: "max-w-2xl",
  default: "max-w-6xl",
  wide: "max-w-[100rem]",
} as const;

export function Container({
  children,
  width = "default",
  className = "",
}: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-6 sm:px-10 ${WIDTHS[width]} ${className}`}>
      {children}
    </div>
  );
}

"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames, type DayButtonProps } from "react-day-picker";

import { cn } from "@/lib/utils";

/**
 * shadcn's react-day-picker v9 wrapper, reskinned to the site's bone/ink/teak
 * tokens. Not part of the pasted dependency list — the demo referenced
 * `@/components/ui/calendar` without shipping it, so this is reconstructed
 * from the upstream pattern.
 *
 * Deliberately does not depend on a separate shadcn `Button` component (and
 * therefore not on `class-variance-authority`): the day cell and nav-arrow
 * styling here is simple enough to inline, and pulling in a whole variants
 * system for one icon button isn't worth the extra dependency.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-fit", className)}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-6 sm:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-3", defaultClassNames.month),
        nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between", defaultClassNames.nav),
        // size-11 (44px) meets the touch-target minimum on mobile, where this
        // is the only month visible and there's room to spare; sm:size-8
        // tightens back up on desktop, where two months share the row and a
        // mouse doesn't need the extra hit area.
        button_previous: cn(
          "flex size-11 cursor-pointer items-center justify-center rounded-md text-bone/70 transition-colors hover:bg-bone/10 hover:text-bone disabled:pointer-events-none disabled:opacity-30 sm:size-8",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          "flex size-11 cursor-pointer items-center justify-center rounded-md text-bone/70 transition-colors hover:bg-bone/10 hover:text-bone disabled:pointer-events-none disabled:opacity-30 sm:size-8",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-8 w-full items-center justify-center font-sans text-[0.7rem] uppercase tracking-[0.2em] text-bone/80",
          defaultClassNames.month_caption,
        ),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "w-11 flex-1 select-none font-sans text-[0.65rem] uppercase tracking-[0.1em] text-bone/40 sm:w-9",
          defaultClassNames.weekday,
        ),
        week: cn("mt-1 flex w-full", defaultClassNames.week),
        day: cn(
          "relative aspect-square w-11 flex-1 select-none p-0 text-center sm:w-9",
          "[&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day,
        ),
        range_start: cn("rounded-l-md bg-teak/20", defaultClassNames.range_start),
        range_middle: cn("rounded-none bg-teak/20", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-teak/20", defaultClassNames.range_end),
        today: cn(
          "[&>button]:border [&>button]:border-teak-light/60",
          defaultClassNames.today,
        ),
        outside: cn("text-bone/25 aria-selected:text-bone/25", defaultClassNames.outside),
        disabled: cn("text-bone/15 opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ className: chevronClassName, orientation, ...chevronProps }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", chevronClassName)} {...chevronProps} />
          ) : (
            <ChevronRight className={cn("size-4", chevronClassName)} {...chevronProps} />
          ),
        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({ className, day, modifiers, ...props }: DayButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex aspect-square w-full min-w-11 cursor-pointer items-center justify-center rounded-md sm:min-w-9",
        "font-sans text-sm font-light text-bone transition-colors",
        "hover:bg-bone/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teak-light",
        "data-[selected-single=true]:bg-teak data-[selected-single=true]:font-medium data-[selected-single=true]:text-ink",
        "data-[range-start=true]:rounded-r-none data-[range-start=true]:bg-teak data-[range-start=true]:font-medium data-[range-start=true]:text-ink",
        "data-[range-end=true]:rounded-l-none data-[range-end=true]:bg-teak data-[range-end=true]:font-medium data-[range-end=true]:text-ink",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };

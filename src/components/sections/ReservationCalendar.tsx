"use client";

import { useEffect, useState } from "react";
import { enUS, es } from "react-day-picker/locale";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Locale = "en" | "es";

const STRINGS: Record<Locale, { label: string; placeholder: string }> = {
  en: { label: "Your dates", placeholder: "Select your arrival and departure" },
  es: { label: "Tus fechas", placeholder: "Selecciona llegada y salida" },
};

// Mirrors Inquiry's own LABEL token. Duplicated rather than imported so this
// component has no dependency on the section that happens to host it.
const LABEL =
  "block font-sans text-[0.65rem] uppercase tracking-[0.22em] text-bone/50";

function toISODate(date?: Date): string {
  if (!date) return "";
  // Avoids the UTC-shift bug plain toISOString() has for local dates: without
  // this, a guest west of Greenwich booking late in the day gets the previous
  // day's date submitted.
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function formatRange(range: DateRange | undefined, locale: Locale): string {
  if (!range?.from) return "";
  const fmt = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    month: "short",
    day: "numeric",
  });
  if (!range.to || range.to.getTime() === range.from.getTime()) {
    return fmt.format(range.from);
  }
  return `${fmt.format(range.from)} – ${fmt.format(range.to)}`;
}

/**
 * Replaces the two separate "Arriving" / "Leaving" date inputs with a single
 * range picker — a stay is one decision, not two fields that happen to
 * bracket it. Bilingual because a Tamarindo villa's guest list isn't
 * English-only, and a hidden guest shouldn't have to guess month names in a
 * language they don't read.
 *
 * Still submits as plain `arrival` / `departure` strings via hidden inputs,
 * so Inquiry's existing FormData handling needed no changes.
 */
export function ReservationCalendar() {
  const [locale, setLocale] = useState<Locale>("en");
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const t = STRINGS[locale];

  return (
    <div className="inquiry-field" data-reveal>
      <div className="flex items-center justify-between gap-4">
        <label className={LABEL}>{t.label}</label>

        <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
          <SelectTrigger className="h-auto w-[4.5rem] shrink-0 border-bone/25 py-0.5 text-[0.65rem] uppercase tracking-[0.15em] text-bone/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="en">EN</SelectItem>
            <SelectItem value="es">ES</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mt-2 min-h-6 font-sans text-base font-light text-bone">
        {range?.from ? (
          formatRange(range, locale)
        ) : (
          <span className="text-bone/35">{t.placeholder}</span>
        )}
      </p>

      <div className="mt-4 w-full overflow-x-auto rounded-md border border-bone/10 p-3 sm:p-4">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          defaultMonth={range?.from}
          numberOfMonths={wide ? 2 : 1}
          locale={locale === "es" ? es : enUS}
        />
      </div>

      <input type="hidden" name="arrival" value={toISODate(range?.from)} readOnly />
      <input type="hidden" name="departure" value={toISODate(range?.to)} readOnly />
    </div>
  );
}

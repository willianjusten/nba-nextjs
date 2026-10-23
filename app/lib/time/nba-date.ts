import type { NbaDate } from "@/app/lib/domain/nba-date";

const NBA_TIME_ZONE = "America/New_York";

const easternDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: NBA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const displayDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "long",
  month: "long",
  day: "numeric",
});

const shortDisplayDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "short",
  month: "short",
  day: "numeric",
});

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "long",
});

const monthDayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "long",
  day: "numeric",
});

export function nbaDateOf(instant: string | Date): NbaDate {
  const parts = easternDateFormatter.formatToParts(new Date(instant));
  const partValue = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;

  return `${partValue("year")}-${partValue("month")}-${partValue("day")}` as NbaDate;
}

export function currentNbaDate(now: Date = new Date()): NbaDate {
  return nbaDateOf(now);
}

export function parseNbaDate(value: string): NbaDate | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const parsedDate = new Date(`${value}T00:00:00Z`);
  // Date silently rolls invalid days over (2026-02-30 becomes March 2), so a round trip catches them.
  if (Number.isNaN(parsedDate.getTime())) return null;
  if (parsedDate.toISOString().slice(0, 10) !== value) return null;

  return value as NbaDate;
}

// An NbaDate is already a calendar day, so it is formatted in UTC to avoid shifting it by the runtime timezone.
export function formatNbaDate(nbaDate: NbaDate): string {
  return displayDateFormatter.format(new Date(`${nbaDate}T00:00:00Z`));
}

export function formatShortNbaDate(nbaDate: NbaDate): string {
  return shortDisplayDateFormatter.format(new Date(`${nbaDate}T00:00:00Z`));
}

export function formatNbaWeekday(nbaDate: NbaDate): string {
  return weekdayFormatter.format(new Date(`${nbaDate}T00:00:00Z`));
}

export function formatNbaMonthDay(nbaDate: NbaDate): string {
  return monthDayFormatter.format(new Date(`${nbaDate}T00:00:00Z`));
}

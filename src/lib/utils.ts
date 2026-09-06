import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ------------------------------------------------------------------ */
/* Currency                                                            */
/* ------------------------------------------------------------------ */

const tndCompact = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });

/** `320` -> `320 TND`. Tunisian dinar, no decimals in nightly pricing. */
export function formatTND(value: number, opts: { suffix?: boolean } = {}) {
  const { suffix = true } = opts;
  return `${tndCompact.format(Math.round(value))}${suffix ? ' TND' : ''}`;
}

/** `18400` -> `18.4k`. Used in dashboard stat blocks where space is tight. */
export function formatCompact(value: number) {
  if (Math.abs(value) < 1000) return tndCompact.format(value);
  return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
}

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

/** Parse a `YYYY-MM-DD` string into a UTC-noon Date, avoiding timezone drift. */
export function parseISODate(value: string) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

export function toISODate(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    .toISOString()
    .slice(0, 10);
}

export function addDays(date: Date, days: number) {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function diffInNights(checkIn: string, checkOut: string) {
  const ms = parseISODate(checkOut).getTime() - parseISODate(checkIn).getTime();
  return Math.max(1, Math.round(ms / 86_400_000));
}

export function isSameISODate(a: Date, b: Date) {
  return toISODate(a) === toISODate(b);
}

const dayLong = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'UTC' });
const dayShort = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' });
const monthShort = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' });
const dateMedium = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});
const dateLong = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

export const formatDayLong = (d: Date) => dayLong.format(d);
export const formatDayShort = (d: Date) => dayShort.format(d);
export const formatMonthShort = (d: Date) => monthShort.format(d);
export const formatDateMedium = (d: Date) => dateMedium.format(d);
export const formatDateLong = (d: Date) => dateLong.format(d);

/** "Today" / "Tomorrow" / "Friday 12 September" for activity-feed day headers. */
export function formatRelativeDayHeading(date: Date, today: Date) {
  const delta = Math.round(
    (parseISODate(toISODate(date)).getTime() - parseISODate(toISODate(today)).getTime()) /
      86_400_000,
  );
  if (delta === 0) return 'Today';
  if (delta === 1) return 'Tomorrow';
  if (delta === -1) return 'Yesterday';
  return formatDateLong(date);
}

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */

/** "Amira Ben Salah" -> "AB". Used for avatar fallbacks. */
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function pluralise(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

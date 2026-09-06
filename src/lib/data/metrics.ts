import { addDays, diffInNights, parseISODate, toISODate } from '@/lib/utils';

import type { Booking, Listing } from './types';

export type RangeKey = 'next_7' | 'next_30' | 'next_90';

export const RANGE_OPTIONS: { key: RangeKey; label: string; days: number }[] = [
  { key: 'next_7', label: 'Next 7 days', days: 7 },
  { key: 'next_30', label: 'Next 30 days', days: 30 },
  { key: 'next_90', label: 'Next 90 days', days: 90 },
];

export const rangeDays = (key: RangeKey) =>
  RANGE_OPTIONS.find((r) => r.key === key)?.days ?? 30;

/** Nights of a booking that fall inside [start, end). */
function nightsInWindow(booking: Booking, start: Date, end: Date) {
  const ci = parseISODate(booking.check_in).getTime();
  const co = parseISODate(booking.check_out).getTime();
  const from = Math.max(ci, start.getTime());
  const to = Math.min(co, end.getTime());
  if (to <= from) return 0;
  return Math.round((to - from) / 86_400_000);
}

const REVENUE_STATUSES = new Set<Booking['status']>([
  'confirmed',
  'awaiting_payment',
  'early_check_in',
]);

const OCCUPYING_STATUSES = new Set<Booking['status']>([
  'confirmed',
  'awaiting_payment',
  'not_confirmed',
  'early_check_in',
]);

export interface DayBar {
  date: string;
  label: string;
  checkIns: number;
  checkOuts: number;
  turnovers: number;
}

export interface OverviewMetrics {
  rangeLabel: string;
  days: number;
  estimatedRevenue: number;
  occupancyPct: number;
  bookedNights: number;
  availableNights: number;
  series: DayBar[];
  totalCheckIns: number;
  totalCheckOuts: number;
  totalTurnovers: number;
}

/**
 * Estimated revenue, occupancy and the daily check-in / check-out / turnover
 * series that drives the overview bar chart.
 *
 * A turnover is a day on which the same listing has a check-out and a check-in —
 * the day the cleaning team has a hard deadline. It is counted separately and is
 * NOT double-counted into the check-in and check-out totals.
 */
export function buildOverviewMetrics(
  bookings: Booking[],
  listings: Listing[],
  range: RangeKey,
  anchor: Date,
): OverviewMetrics {
  const days = rangeDays(range);
  const start = parseISODate(toISODate(anchor));
  const end = addDays(start, days);

  const estimatedRevenue = bookings
    .filter((b) => REVENUE_STATUSES.has(b.status))
    .reduce((sum, b) => sum + b.nightly_price * nightsInWindow(b, start, end), 0);

  const sellable = listings.filter((l) => l.status !== 'inactive');
  const bookedNights = bookings
    .filter((b) => OCCUPYING_STATUSES.has(b.status))
    .reduce((sum, b) => sum + nightsInWindow(b, start, end), 0);
  const availableNights = Math.max(1, sellable.length * days);
  const occupancyPct = Math.round((bookedNights / availableNights) * 100);

  const series: DayBar[] = [];
  let totalCheckIns = 0;
  let totalCheckOuts = 0;
  let totalTurnovers = 0;

  for (let i = 0; i < days; i += 1) {
    const day = addDays(start, i);
    const key = toISODate(day);

    const arrivingListings = new Set(
      bookings.filter((b) => b.check_in === key && b.status !== 'cancelled').map((b) => b.listing_id),
    );
    const departingListings = new Set(
      bookings
        .filter((b) => b.check_out === key && b.status !== 'cancelled')
        .map((b) => b.listing_id),
    );

    let turnovers = 0;
    arrivingListings.forEach((id) => {
      if (departingListings.has(id)) turnovers += 1;
    });

    const checkIns = arrivingListings.size - turnovers;
    const checkOuts = departingListings.size - turnovers;

    totalCheckIns += checkIns;
    totalCheckOuts += checkOuts;
    totalTurnovers += turnovers;

    series.push({
      date: key,
      label: String(day.getUTCDate()),
      checkIns,
      checkOuts,
      turnovers,
    });
  }

  return {
    rangeLabel: RANGE_OPTIONS.find((r) => r.key === range)?.label ?? 'Next 30 days',
    days,
    estimatedRevenue,
    occupancyPct,
    bookedNights,
    availableNights,
    series,
    totalCheckIns,
    totalCheckOuts,
    totalTurnovers,
  };
}

/* ------------------------------------------------------------------ */
/* Stat cards                                                          */
/* ------------------------------------------------------------------ */

export interface Issue {
  id: string;
  headline: string;
  detail: string;
  severity: 'danger' | 'warning';
}

/**
 * Everything the operator has to act on today. Derived, not hand-written — the
 * count on the stat card and the list behind it can never drift apart.
 */
export function buildIssues(bookings: Booking[], listings: Listing[], anchor: Date): Issue[] {
  const today = parseISODate(toISODate(anchor));
  const soon = addDays(today, 7);
  const byListing = new Map(listings.map((l) => [l.id, l]));
  const issues: Issue[] = [];

  for (const b of bookings) {
    const ci = parseISODate(b.check_in);
    if (ci < today || ci > soon) continue;
    const listing = byListing.get(b.listing_id);
    if (!listing) continue;
    const inDays = Math.round((ci.getTime() - today.getTime()) / 86_400_000);
    const when = inDays === 0 ? 'today' : inDays === 1 ? 'tomorrow' : `in ${inDays} days`;

    if (b.status === 'awaiting_payment') {
      issues.push({
        id: `${b.id}-payment`,
        headline: `${b.guest_name} has not paid`,
        detail: `${listing.title} — arrives ${when}, ${diffInNights(b.check_in, b.check_out)} nights`,
        severity: 'danger',
      });
    }
    if (b.status === 'not_confirmed') {
      issues.push({
        id: `${b.id}-confirm`,
        headline: `${b.guest_name} is not confirmed`,
        detail: `${listing.title} — arrives ${when}`,
        severity: 'warning',
      });
    }
  }

  for (const l of listings) {
    if (l.status === 'pending') {
      issues.push({
        id: `${l.id}-pending`,
        headline: `${l.title} is not live`,
        detail: 'Pending final photography — not accepting bookings',
        severity: 'warning',
      });
    }
  }

  return issues;
}

/** Listings with a guest in residence on the anchor date. */
export function countOccupied(bookings: Booking[], anchor: Date) {
  const key = toISODate(anchor);
  const occupied = new Set(
    bookings
      .filter(
        (b) =>
          OCCUPYING_STATUSES.has(b.status) && b.check_in <= key && b.check_out > key,
      )
      .map((b) => b.listing_id),
  );
  return occupied.size;
}

/* ------------------------------------------------------------------ */
/* Activity feed                                                       */
/* ------------------------------------------------------------------ */

export interface ActivityEvent {
  id: string;
  kind: 'check_in' | 'check_out';
  booking: Booking;
  listing: Listing;
  date: string;
  time: string;
  nights: number;
}

export interface ActivityDay {
  date: string;
  events: ActivityEvent[];
}

/** Upcoming arrivals and departures, grouped by day. */
export function buildActivityFeed(
  bookings: Booking[],
  listings: Listing[],
  anchor: Date,
  days = 14,
): ActivityDay[] {
  const start = parseISODate(toISODate(anchor));
  const end = addDays(start, days);
  const byListing = new Map(listings.map((l) => [l.id, l]));
  const grouped = new Map<string, ActivityEvent[]>();

  const push = (event: ActivityEvent) => {
    const list = grouped.get(event.date) ?? [];
    list.push(event);
    grouped.set(event.date, list);
  };

  for (const b of bookings) {
    if (b.status === 'cancelled') continue;
    const listing = byListing.get(b.listing_id);
    if (!listing) continue;
    const nights = diffInNights(b.check_in, b.check_out);

    const ci = parseISODate(b.check_in);
    if (ci >= start && ci < end) {
      push({
        id: `${b.id}-in`,
        kind: 'check_in',
        booking: b,
        listing,
        date: b.check_in,
        time: b.check_in_time,
        nights,
      });
    }

    const co = parseISODate(b.check_out);
    if (co >= start && co < end) {
      push({
        id: `${b.id}-out`,
        kind: 'check_out',
        booking: b,
        listing,
        date: b.check_out,
        time: b.check_out_time,
        nights,
      });
    }
  }

  return [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, events]) => ({
      date,
      events: events.sort((a, b) => a.time.localeCompare(b.time)),
    }));
}

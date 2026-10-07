/**
 * Pure view-model helpers behind the dashboard's interactive filters.
 *
 * Kept free of path aliases and runtime imports so `scripts/views.test.mjs`
 * can exercise them with Node's built-in test runner — no test framework.
 */
import type { MessageThread } from './inbox';
import type { Booking, Channel, Listing } from './types';

/* ------------------------------------------------------------------ */
/* Inbox                                                               */
/* ------------------------------------------------------------------ */

/** `'all'`, `'unread'`, or `'listing:<listing id>'`. */
export type InboxFilter = 'all' | 'unread' | `listing:${string}`;

export interface InboxFilterOption {
  key: InboxFilter;
  label: string;
}

/** Everything / Unread only, then one pill per home that has threads. */
export function inboxFilterOptions(
  threads: Pick<MessageThread, 'listing_id'>[],
  listings: Pick<Listing, 'id' | 'title'>[],
): InboxFilterOption[] {
  const withThreads = new Set(threads.map((t) => t.listing_id));
  return [
    { key: 'all', label: 'Everything' },
    { key: 'unread', label: 'Unread only' },
    ...listings
      .filter((l) => withThreads.has(l.id))
      .map((l) => ({ key: `listing:${l.id}` as const, label: l.title })),
  ];
}

export function filterThreads<T extends Pick<MessageThread, 'unread' | 'listing_id'>>(
  threads: T[],
  filter: InboxFilter,
): T[] {
  if (filter === 'all') return threads;
  if (filter === 'unread') return threads.filter((t) => t.unread);
  const id = filter.slice('listing:'.length);
  return threads.filter((t) => t.listing_id === id);
}

/** `14` -> `14 min`, `180` -> `3 h`, `2880` -> `2 d`. */
export function formatReceived(minutes: number) {
  if (minutes < 60) return `${Math.max(0, Math.round(minutes))} min`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)} h`;
  return `${Math.round(minutes / (60 * 24))} d`;
}

/* ------------------------------------------------------------------ */
/* Calendar                                                            */
/* ------------------------------------------------------------------ */

/** `'all'` or a listing id. */
export function filterListings<T extends Pick<Listing, 'id'>>(listings: T[], filter: string): T[] {
  if (filter === 'all') return listings;
  const match = listings.filter((l) => l.id === filter);
  // A stale filter (listing removed) falls back to everything, never to nothing.
  return match.length ? match : listings;
}

/**
 * Where a booking bar sits on a board of consecutive ISO dates: the column it
 * starts in and how many nights it spans, clipped to the window. `null` when
 * the stay is entirely outside it or cancelled.
 */
export function barSpan(
  booking: Pick<Booking, 'check_in' | 'check_out' | 'status'>,
  days: string[],
): { from: number; nights: number } | null {
  if (booking.status === 'cancelled' || days.length === 0) return null;
  const first = days[0];
  const last = days[days.length - 1];
  if (booking.check_out <= first || booking.check_in > last) return null;
  const from = booking.check_in < first ? 0 : days.indexOf(booking.check_in);
  const to = booking.check_out > last ? days.length : days.indexOf(booking.check_out);
  if (from < 0 || to < 0 || to <= from) return null;
  return { from, nights: to - from };
}

/** Nights per channel and gross booked value, owner blocks excluded from value. */
export function channelTotals(
  bookings: Pick<Booking, 'status' | 'channel' | 'nightly_price' | 'check_in' | 'check_out'>[],
  nightsOf: (checkIn: string, checkOut: string) => number,
) {
  const nights: Record<Channel, number> = { airbnb: 0, booking_com: 0, direct: 0, owner_block: 0 };
  let gross = 0;
  for (const b of bookings) {
    if (b.status === 'cancelled') continue;
    const n = nightsOf(b.check_in, b.check_out);
    nights[b.channel] += n;
    if (b.channel !== 'owner_block') gross += n * b.nightly_price;
  }
  return { nights, gross };
}

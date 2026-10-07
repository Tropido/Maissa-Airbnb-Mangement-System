/**
 * Regression checks for the dashboard filter logic (inbox pills, calendar
 * filter, booking-bar clipping, channel totals).
 *
 * Run: npm run test:logic
 * Uses Node's built-in test runner and native TypeScript type stripping
 * (Node 22.18+), so no test framework is installed for it.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  barSpan,
  channelTotals,
  filterListings,
  filterThreads,
  formatReceived,
  inboxFilterOptions,
} from '../src/lib/data/views.ts';

const threads = [
  { id: 'a', listing_id: 'l_djerba_villa', unread: true },
  { id: 'b', listing_id: 'l_ezzahra_apartment_loft', unread: true },
  { id: 'c', listing_id: 'l_djerba_villa', unread: false },
];
const listings = [
  { id: 'l_djerba_villa', title: 'Djerba Villa' },
  { id: 'l_ezzahra_apartment_loft', title: 'Ezzahra Apartment Loft' },
  { id: 'l_new', title: 'A third home with no threads yet' },
];

test('inbox filter options: everything, unread, then homes that have threads', () => {
  assert.deepEqual(
    inboxFilterOptions(threads, listings).map((o) => o.key),
    ['all', 'unread', 'listing:l_djerba_villa', 'listing:l_ezzahra_apartment_loft'],
  );
  assert.deepEqual(inboxFilterOptions([], []).map((o) => o.key), ['all', 'unread']);
});

test('filterThreads', () => {
  assert.equal(filterThreads(threads, 'all').length, 3);
  assert.deepEqual(filterThreads(threads, 'unread').map((t) => t.id), ['a', 'b']);
  assert.deepEqual(filterThreads(threads, 'listing:l_djerba_villa').map((t) => t.id), ['a', 'c']);
  assert.deepEqual(filterThreads(threads, 'listing:l_missing'), []);
});

test('formatReceived matches the inbox reference', () => {
  assert.equal(formatReceived(14), '14 min');
  assert.equal(formatReceived(60), '1 h');
  assert.equal(formatReceived(720), '12 h');
  assert.equal(formatReceived(2880), '2 d');
});

test('filterListings falls back to everything for a stale id', () => {
  assert.equal(filterListings(listings, 'all').length, 3);
  assert.deepEqual(filterListings(listings, 'l_new').map((l) => l.id), ['l_new']);
  assert.equal(filterListings(listings, 'l_gone').length, 3);
});

test('barSpan clips stays to the board window', () => {
  const days = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08'];
  const b = (check_in, check_out, status = 'confirmed') => ({ check_in, check_out, status });
  assert.deepEqual(barSpan(b('2026-10-06', '2026-10-08'), days), { from: 1, nights: 2 });
  assert.deepEqual(barSpan(b('2026-10-01', '2026-10-07'), days), { from: 0, nights: 2 });
  assert.deepEqual(barSpan(b('2026-10-07', '2026-10-20'), days), { from: 2, nights: 2 });
  assert.equal(barSpan(b('2026-09-01', '2026-10-05'), days), null);
  assert.equal(barSpan(b('2026-10-09', '2026-10-12'), days), null);
  assert.equal(barSpan(b('2026-10-06', '2026-10-08', 'cancelled'), days), null);
});

test('channelTotals excludes cancelled stays and owner-block value', () => {
  const nightsOf = (a, b) => (Date.parse(b) - Date.parse(a)) / 86_400_000;
  const { nights, gross } = channelTotals(
    [
      { status: 'confirmed', channel: 'airbnb', nightly_price: 320, check_in: '2026-10-01', check_out: '2026-10-04' },
      { status: 'blocked', channel: 'owner_block', nightly_price: 0, check_in: '2026-10-04', check_out: '2026-10-06' },
      { status: 'cancelled', channel: 'direct', nightly_price: 300, check_in: '2026-10-06', check_out: '2026-10-09' },
    ],
    nightsOf,
  );
  assert.deepEqual(nights, { airbnb: 3, booking_com: 0, direct: 0, owner_block: 2 });
  assert.equal(gross, 960);
});

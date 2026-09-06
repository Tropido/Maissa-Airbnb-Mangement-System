'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

import { StatusChip } from '@/components/dashboard/status-chip';
import { Badge } from '@/components/ui/badge';
import {
  addDays,
  cn,
  formatDayShort,
  formatMonthShort,
  formatTND,
  isSameISODate,
  parseISODate,
  toISODate,
} from '@/lib/utils';
import { CHANNEL_LABEL, type Booking, type Channel, type Listing } from '@/lib/data/types';

/**
 * Channel-coded availability grid.
 *
 * One row per listing, one column per night. A booking is a single bar spanning
 * its nights, coloured by the channel it came through — the operator's first
 * question looking at this screen is "where is this money coming from", not
 * "what state is it in", so channel owns the fill and status rides along as a
 * chip inside the bar.
 *
 * Owner blocks are the exception: they are drawn in ink with diagonal hatching,
 * because "nobody can book this" has to be visually distinct from every colour
 * that means "somebody has".
 */
/**
 * Grid metrics. The listing column doubles as the sidebar, so on a phone it has
 * to give most of the width back to the dates — a 232px label column out of 390
 * leaves no calendar to read.
 */
const DESKTOP = { col: 72, label: 232, row: 76 };
const COMPACT = { col: 56, label: 132, row: 68 };
const DAYS = 60;

const CHANNEL_STYLE: Record<Channel, { bar: string; swatch: string }> = {
  airbnb: {
    bar: 'bg-channel-airbnb text-channel-airbnb-foreground',
    swatch: 'bg-channel-airbnb',
  },
  booking_com: {
    bar: 'bg-channel-booking text-channel-booking-foreground',
    swatch: 'bg-channel-booking',
  },
  direct: {
    bar: 'bg-channel-direct text-channel-direct-foreground',
    swatch: 'bg-channel-direct',
  },
  owner_block: {
    bar: 'bg-channel-block text-channel-block-foreground hatch-light',
    swatch: 'bg-channel-block',
  },
};

export function CalendarGrid({
  listings,
  bookings,
  anchor,
}: {
  listings: Listing[];
  bookings: Booking[];
  /** ISO date the grid starts two days before. */
  anchor: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Resolved after mount rather than during render: the server has no viewport,
  // and guessing one would produce a hydration mismatch on every phone.
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)');
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const { col: COL_WIDTH, label: LABEL_WIDTH, row: ROW_HEIGHT } = compact ? COMPACT : DESKTOP;
  const [selected, setSelected] = useState<Booking | null>(null);
  // The listing column doubles as the sidebar, so its header carries the filter
  // rather than repeating the listing names in a second panel beside the grid.
  const [filter, setFilter] = useState<string>('all');

  const visibleListings = useMemo(
    () => (filter === 'all' ? listings : listings.filter((l) => l.id === filter)),
    [filter, listings],
  );

  const start = useMemo(() => addDays(parseISODate(anchor), -2), [anchor]);
  const today = useMemo(() => parseISODate(anchor), [anchor]);

  const days = useMemo(
    () => Array.from({ length: DAYS }, (_, i) => addDays(start, i)),
    [start],
  );

  const dayIndex = useMemo(() => {
    const map = new Map<string, number>();
    days.forEach((d, i) => map.set(toISODate(d), i));
    return map;
  }, [days]);

  const byListing = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const booking of bookings) {
      if (booking.status === 'cancelled') continue;
      const list = map.get(booking.listing_id) ?? [];
      list.push(booking);
      map.set(booking.listing_id, list);
    }
    return map;
  }, [bookings]);

  /** Month bands across the header, so the operator never loses the month. */
  const monthBands = useMemo(() => {
    const bands: { label: string; startIndex: number; span: number }[] = [];
    days.forEach((day, i) => {
      const label = `${formatMonthShort(day)} ${day.getUTCFullYear()}`;
      const last = bands[bands.length - 1];
      if (last && last.label === label) last.span += 1;
      else bands.push({ label, startIndex: i, span: 1 });
    });
    return bands;
  }, [days]);

  const scrollByDays = (count: number) =>
    scrollRef.current?.scrollBy({ left: count * COL_WIDTH, behavior: 'smooth' });

  const gridWidth = LABEL_WIDTH + DAYS * COL_WIDTH;

  return (
    <div className="border-2 border-ink bg-bg-raised">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink p-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {(Object.keys(CHANNEL_STYLE) as Channel[]).map((channel) => (
            <span
              key={channel}
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-fg"
            >
              <span
                aria-hidden
                className={cn(
                  'size-3 border-2 border-ink',
                  CHANNEL_STYLE[channel].swatch,
                  channel === 'owner_block' && 'hatch-light',
                )}
              />
              {CHANNEL_LABEL[channel]}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByDays(-7)}
            aria-label="Scroll back one week"
            className="flex size-9 items-center justify-center border-2 border-ink bg-bg transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollByDays(7)}
            aria-label="Scroll forward one week"
            className="flex size-9 items-center justify-center border-2 border-ink bg-bg transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="overflow-auto">
        <div style={{ width: gridWidth }}>
          {/* Month band */}
          <div className="flex border-b border-muted">
            <div
              className="sticky left-0 z-20 shrink-0 border-r-2 border-ink bg-bg-raised"
              style={{ width: LABEL_WIDTH }}
            />
            {monthBands.map((band) => (
              <div
                key={band.label}
                className="shrink-0 border-r-2 border-ink px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-fg"
                style={{ width: band.span * COL_WIDTH }}
              >
                {band.label}
              </div>
            ))}
          </div>

          {/* Date header */}
          <div className="sticky top-0 z-30 flex border-b-2 border-ink bg-bg-raised">
            <div
              className="sticky left-0 z-20 flex shrink-0 items-center border-r-2 border-ink bg-bg-raised px-3 py-2"
              style={{ width: LABEL_WIDTH }}
            >
              <label htmlFor="calendar-filter" className="sr-only">
                Filter listings
              </label>
              <select
                id="calendar-filter"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="w-full border-2 border-ink bg-bg px-2 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1"
              >
                <option value="all">Showing all listings</option>
                {listings.map((listing) => (
                  <option key={listing.id} value={listing.id}>
                    {listing.title}
                  </option>
                ))}
              </select>
            </div>
            {days.map((day) => {
              const isToday = isSameISODate(day, today);
              const weekend = [0, 6].includes(day.getUTCDay());
              return (
                <div
                  key={toISODate(day)}
                  className={cn(
                    'shrink-0 border-r border-muted py-2 text-center',
                    isToday && 'bg-ink text-ink-foreground',
                    !isToday && weekend && 'bg-bg-sunken',
                  )}
                  style={{ width: COL_WIDTH }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-70">
                    {formatDayShort(day)}
                  </p>
                  <p className="font-display text-lg font-extrabold leading-none">
                    {day.getUTCDate()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Listing rows — the sidebar and the row axis are the same column. */}
          {visibleListings.map((listing) => {
            const rows = byListing.get(listing.id) ?? [];
            return (
              <div
                key={listing.id}
                className="flex border-b-2 border-ink last:border-b-0"
                style={{ height: ROW_HEIGHT }}
              >
                <div
                  className="sticky left-0 z-20 flex shrink-0 items-center gap-3 border-r-2 border-ink bg-bg-raised px-3"
                  style={{ width: LABEL_WIDTH }}
                >
                  {!compact ? (
                    <div className="relative size-11 shrink-0 overflow-hidden border-2 border-ink">
                      <Image
                        src={listing.hero_photo_url}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold tracking-tight">{listing.title}</p>
                    {!compact ? (
                      <p className="truncate font-mono text-[10px] text-muted-fg">
                        {listing.style_tag}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="relative shrink-0" style={{ width: DAYS * COL_WIDTH }}>
                  {/* Night cells */}
                  <div className="absolute inset-0 flex">
                    {days.map((day) => {
                      const isToday = isSameISODate(day, today);
                      const past = day < today;
                      const weekend = [0, 6].includes(day.getUTCDay());
                      return (
                        <div
                          key={toISODate(day)}
                          className={cn(
                            'h-full shrink-0 border-r border-muted',
                            weekend && 'bg-bg-sunken',
                            past && 'hatch-blocked opacity-60',
                            isToday && 'border-l-2 border-l-ink bg-accent/20',
                          )}
                          style={{ width: COL_WIDTH }}
                        />
                      );
                    })}
                  </div>

                  {/* Booking bars */}
                  {rows.map((booking) => {
                    const startIdx = dayIndex.get(booking.check_in);
                    const endIdx = dayIndex.get(booking.check_out);
                    // Clip bookings that begin before or end after the window.
                    const from = startIdx ?? (booking.check_in < toISODate(days[0]) ? 0 : null);
                    const to =
                      endIdx ?? (booking.check_out > toISODate(days[DAYS - 1]) ? DAYS : null);
                    if (from === null || to === null || to <= from) return null;

                    const style = CHANNEL_STYLE[booking.channel];
                    const nights = to - from;
                    const isBlock = booking.channel === 'owner_block';

                    return (
                      <button
                        key={booking.id}
                        type="button"
                        onClick={() => setSelected(booking)}
                        className={cn(
                          'absolute top-1/2 flex -translate-y-1/2 items-center gap-2 overflow-hidden border-2 border-ink px-2 text-left transition-shadow hover:shadow-brutal-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1',
                          style.bar,
                        )}
                        style={{
                          left: from * COL_WIDTH + 3,
                          width: nights * COL_WIDTH - 6,
                          height: ROW_HEIGHT - 22,
                        }}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-bold leading-tight">
                            {booking.guest_name}
                          </span>
                          <span className="mt-0.5 flex items-center gap-2 text-[10px] leading-tight opacity-90">
                            {!isBlock ? (
                              <>
                                <span className="font-semibold">
                                  {formatTND(booking.nightly_price, { suffix: false })}
                                </span>
                                <span className="inline-flex items-center gap-0.5">
                                  <Users className="size-2.5" aria-hidden />
                                  {booking.guest_count}
                                </span>
                              </>
                            ) : (
                              <span className="font-semibold uppercase tracking-[0.1em]">
                                Blocked
                              </span>
                            )}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail strip for the selected booking. */}
      <div aria-live="polite" className="border-t-2 border-ink p-4">
        {selected ? (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div>
              <p className="font-display text-lg font-extrabold uppercase leading-none tracking-[-0.02em]">
                {selected.guest_name}
              </p>
              <p className="mt-1 text-xs text-muted-fg">
                {listings.find((l) => l.id === selected.listing_id)?.title} /{' '}
                {CHANNEL_LABEL[selected.channel]}
              </p>
            </div>
            <Badge variant="outline">
              {selected.check_in} &rarr; {selected.check_out}
            </Badge>
            {selected.channel !== 'owner_block' ? (
              <>
                <Badge variant="outline">{formatTND(selected.nightly_price)} / night</Badge>
                <Badge variant="outline">{selected.guest_count} guests</Badge>
              </>
            ) : null}
            <StatusChip status={selected.status} />
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="ml-auto text-xs font-semibold text-muted-fg underline decoration-2 underline-offset-4 hover:text-ink"
            >
              Clear
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted-fg">
            Select a booking bar to see its dates, channel and status.
          </p>
        )}
      </div>
    </div>
  );
}

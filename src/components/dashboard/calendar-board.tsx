'use client';

import { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { StatusChip } from '@/components/dashboard/status-chip';
import { CHANNEL_LABEL, type Booking, type Channel, type Listing } from '@/lib/data/types';
import { barSpan, filterListings } from '@/lib/data/views';
import { useMediaQuery } from '@/lib/use-media-query';
import { addDays, cn, diffInNights, formatDateMedium, formatMonthShort, formatTND, parseISODate, toISODate } from '@/lib/utils';

const DAYS = 60;
const DESKTOP = { col: 64, label: 216, row: 74 };
const COMPACT = { col: 50, label: 128, row: 66 };
const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const CHANNEL_ORDER: Channel[] = ['airbnb', 'booking_com', 'direct', 'owner_block'];

const BAR: Record<Channel, string> = {
  airbnb: 'bg-channel-airbnb text-channel-airbnb-foreground',
  booking_com: 'bg-channel-booking text-channel-booking-foreground',
  direct: 'bg-channel-direct text-channel-direct-foreground',
  owner_block: 'bg-channel-block text-channel-block-foreground hatch-block',
};

const SWATCH: Record<Channel, string> = {
  airbnb: 'bg-channel-airbnb',
  booking_com: 'bg-channel-booking',
  direct: 'bg-channel-direct',
  owner_block: 'bg-channel-block',
};

/**
 * Sixty-night availability board — `Maissa Redesign/Maissa Calendar.dc.html`.
 *
 * One row per home, one column per night, starting two nights before today.
 * Bars are coloured by channel, never by status; status appears as a chip
 * when a bar is selected. Owner blocks are ink with blush hatching, past
 * nights are hatched. The board scrolls horizontally inside its own surface,
 * with the home labels pinned, so a phone never scrolls the page sideways.
 *
 * Bars are buttons for inspection only. Nothing here can be dragged or
 * rescheduled — there is no persistence behind this view.
 */
export function CalendarBoard({
  listings,
  bookings,
  anchor,
  nightsByChannel,
  gross,
}: {
  listings: Listing[];
  bookings: Booking[];
  /** Today, as an ISO date. */
  anchor: string;
  nightsByChannel: Record<Channel, number>;
  gross: number;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  // False on the server and first paint; the real viewport follows.
  const compact = useMediaQuery('(max-width: 720px)');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { col, label, row } = compact ? COMPACT : DESKTOP;
  const today = anchor;

  const days = useMemo(() => {
    const start = addDays(parseISODate(anchor), -2);
    return Array.from({ length: DAYS }, (_, i) => toISODate(addDays(start, i)));
  }, [anchor]);

  const months = useMemo(() => {
    const bands: { key: string; label: string; span: number }[] = [];
    for (const day of days) {
      const d = parseISODate(day);
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
      const last = bands[bands.length - 1];
      if (last?.key === key) last.span += 1;
      else bands.push({ key, label: formatMonthShort(d), span: 1 });
    }
    return bands;
  }, [days]);

  const visible = filterListings(listings, filter);
  const byListing = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
      const list = map.get(b.listing_id) ?? [];
      list.push(b);
      map.set(b.listing_id, list);
    }
    return map;
  }, [bookings]);

  const selected = bookings.find((b) => b.id === selectedId) ?? null;
  const selectedListing = selected ? listings.find((l) => l.id === selected.listing_id) : undefined;
  const selectedNights = selected ? diffInNights(selected.check_in, selected.check_out) : 0;

  const scrollWeek = (direction: 1 | -1) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller.current?.scrollBy({ left: direction * col * 7, behavior: reduce ? 'auto' : 'smooth' });
  };

  const tiles = [
    ...CHANNEL_ORDER.map((channel) => ({ channel, value: nightsByChannel[channel] ?? 0 })),
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p data-intro className="m-0 text-[11px] uppercase tracking-[0.2em] text-muted-soft">
            <span className="sr-only">Availability, {DAYS} nights</span>
            <span aria-hidden data-scramble>
              Availability · {DAYS} nights
            </span>
          </p>
          <h1
            data-intro
            className="mb-0 mt-3.5 text-[clamp(26px,3.4vw,42px)] font-normal leading-[1.02] tracking-[-0.045em] text-ink"
          >
            Calendar
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex min-w-0 items-center gap-2 text-[12.5px] text-muted-fg">
            <span className="text-[10.5px] uppercase tracking-[0.08em] text-muted-soft">Show</span>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setSelectedId(null);
              }}
              className="h-11 max-w-[min(260px,52vw)] truncate rounded-full border border-ink/[.14] bg-bg-card px-3 text-[13px] text-ink"
            >
              <option value="all">{listings.length === 2 ? 'Both homes' : 'All homes'}</option>
              {listings.map((listing) => (
                <option key={listing.id} value={listing.id}>
                  {listing.title}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => scrollWeek(-1)}
            aria-label="Previous week"
            className="flex size-11 items-center justify-center rounded-full border border-ink/[.14] bg-bg-card text-ink transition-colors duration-300 hover:bg-bg-tint"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollWeek(1)}
            aria-label="Next week"
            className="flex size-11 items-center justify-center rounded-full border border-ink/[.14] bg-bg-card text-ink transition-colors duration-300 hover:bg-bg-tint"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <dl data-reveal className="m-0 mt-[clamp(20px,2.6vw,32px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
        {tiles.map(({ channel, value }) => (
          <div key={channel} className="rounded-2xl border border-ink/[.08] bg-bg-card p-[18px]">
            <dt className="flex items-center gap-[9px] text-[10.5px] uppercase tracking-[0.18em] text-muted-soft">
              <span aria-hidden className={cn('block size-[9px] rounded-[2px]', SWATCH[channel])} />
              {CHANNEL_LABEL[channel]}
            </dt>
            <dd className="mb-0 ml-0 mt-3 text-[26px] tracking-[-0.035em] text-ink">
              {value} <span className="text-xs tracking-normal text-muted-soft">nights</span>
            </dd>
          </div>
        ))}
        <div className="theme-dark rounded-2xl bg-ink p-[18px] text-ink-foreground">
          <dt className="text-[10.5px] uppercase tracking-[0.18em] text-ink-foreground/55">Gross booked</dt>
          <dd className="mb-0 ml-0 mt-3 text-[26px] tracking-[-0.035em]">
            {formatTND(gross, { suffix: false })} <span className="text-xs tracking-normal text-ink-foreground/55">TND</span>
          </dd>
        </div>
      </dl>

      <div data-reveal className="mt-3.5 overflow-hidden rounded-[20px] border border-ink/[.08] bg-bg-card">
        <div
          ref={scroller}
          className="cal-scroll overflow-x-auto overflow-y-hidden overscroll-x-contain"
          role="region"
          aria-label={`Availability board, ${DAYS} nights from ${formatDateMedium(parseISODate(days[0]))}. Scroll sideways for later dates.`}
          tabIndex={0}
        >
          <div style={{ minWidth: label + DAYS * col }}>
            {/* Header: months, then days. */}
            <div className="sticky top-0 z-[6] flex border-b border-ink/10 bg-bg-card">
              <div
                className="sticky left-0 z-[7] flex shrink-0 items-end border-r border-ink/10 bg-bg-card px-3.5 pb-3"
                style={{ width: label }}
              >
                <p className="m-0 text-[10.5px] uppercase tracking-[0.18em] text-muted-soft">Home</p>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex">
                  {months.map((m) => (
                    <div
                      key={m.key}
                      className="shrink-0 overflow-hidden whitespace-nowrap border-b border-l border-ink/[.06] border-l-ink/[.08] px-3 pb-[7px] pt-[9px] text-[10.5px] uppercase tracking-[0.18em] text-muted-soft"
                      style={{ width: m.span * col }}
                    >
                      {m.label}
                    </div>
                  ))}
                </div>
                <div className="flex">
                  {days.map((day) => {
                    const d = parseISODate(day);
                    const isToday = day === today;
                    const past = day < today;
                    return (
                      <div
                        key={day}
                        className={cn(
                          'shrink-0 border-l border-ink/[.06] pb-2.5 pt-[9px] text-center',
                          isToday ? 'bg-accent/[.18] text-ink' : past ? 'text-muted-soft' : 'text-ink-soft',
                        )}
                        style={{ width: col }}
                        aria-current={isToday ? 'date' : undefined}
                      >
                        <span className="block text-[9.5px] tracking-[0.08em] text-muted-soft">{DOW[d.getUTCDay()]}</span>
                        <span className="mt-[3px] block text-[12.5px]">{d.getUTCDate()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {visible.length === 0 ? (
              <p className="m-0 px-5 py-8 text-[13px] text-muted-fg">No homes to show yet.</p>
            ) : null}

            {visible.map((listing) => (
              <div key={listing.id} className="flex border-b border-ink/[.07] last:border-b-0" style={{ height: row }}>
                <div
                  className="sticky left-0 z-[4] flex shrink-0 flex-col justify-center border-r border-ink/10 bg-bg-card px-3.5"
                  style={{ width: label }}
                >
                  <p className="m-0 truncate text-[13.5px] leading-tight tracking-[-0.02em] text-ink">{listing.title}</p>
                  <p className="mb-0 mt-[5px] truncate text-[10.5px] text-muted-soft">
                    {listing.location.split(',')[0]} &middot; {formatTND(listing.price_per_night)}
                  </p>
                </div>
                <div className="relative min-w-0 flex-1">
                  <div aria-hidden className="absolute inset-0 flex">
                    {days.map((day) => (
                      <div
                        key={day}
                        className={cn(
                          'shrink-0 border-l border-ink/5',
                          day === today ? 'bg-accent/[.13]' : day < today ? 'hatch-past' : '',
                        )}
                        style={{ width: col }}
                      />
                    ))}
                  </div>
                  {(byListing.get(listing.id) ?? []).map((booking) => {
                    const span = barSpan(booking, days);
                    if (!span) return null;
                    const isSelected = booking.id === selectedId;
                    const nights = diffInNights(booking.check_in, booking.check_out);
                    const name = compact ? booking.guest_name.split(' ')[0] : booking.guest_name;
                    return (
                      <button
                        key={booking.id}
                        type="button"
                        aria-pressed={isSelected}
                        aria-label={`${booking.guest_name}, ${CHANNEL_LABEL[booking.channel]}, ${formatDateMedium(parseISODate(booking.check_in))} to ${formatDateMedium(parseISODate(booking.check_out))}, ${nights} nights`}
                        title={`${booking.guest_name} · ${CHANNEL_LABEL[booking.channel]} · ${nights} nights`}
                        onClick={() => setSelectedId(isSelected ? null : booking.id)}
                        className={cn(
                          'absolute flex items-center rounded-[9px] px-[11px] text-left text-xs tracking-[-0.01em] transition-[box-shadow,transform] duration-300',
                          BAR[booking.channel],
                          isSelected ? '-translate-y-px shadow-bar-selected' : 'shadow-bar',
                        )}
                        style={{
                          top: row * 0.18,
                          height: row * 0.64,
                          left: span.from * col + 3,
                          width: span.nights * col - 6,
                        }}
                      >
                        <span className="truncate">{name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div aria-live="polite">
          {selected ? (
            <div className="border-t border-ink/10 bg-bg-tint px-[clamp(16px,2.4vw,26px)] py-[18px]">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
                <span aria-hidden className={cn('block h-[11px] w-[26px] rounded-[3px]', SWATCH[selected.channel], selected.channel === 'owner_block' && 'hatch-block')} />
                <p className="m-0 text-[15px] tracking-[-0.02em] text-ink">{selected.guest_name}</p>
                <p className="m-0 text-[12.5px] text-muted-fg">
                  {selectedListing?.title} &middot; {CHANNEL_LABEL[selected.channel]} &middot; {selectedNights} nights
                  {selected.guest_count > 0 ? ` · ${selected.guest_count} guests` : ''} &middot;{' '}
                  {selected.channel === 'owner_block'
                    ? 'no revenue'
                    : `${formatTND(selected.nightly_price * selectedNights)} (${formatTND(selected.nightly_price)} a night)`}
                </p>
                <p className="m-0 text-[12.5px] text-muted-fg">
                  {formatDateMedium(parseISODate(selected.check_in))} {selected.check_in_time} &rarr;{' '}
                  {formatDateMedium(parseISODate(selected.check_out))} {selected.check_out_time}
                </p>
                <StatusChip status={selected.status} className="py-1.5" />
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="ml-auto h-9 rounded-full border border-ink/[.16] bg-transparent px-[18px] text-[12.5px] text-ink transition-colors duration-300 hover:bg-ink/5"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <ul className="m-0 mt-5 flex list-none flex-wrap gap-x-[22px] gap-y-2.5 p-0 text-xs text-muted-fg">
        {(['airbnb', 'booking_com', 'direct'] as Channel[]).map((channel) => (
          <li key={channel} className="flex items-center gap-2">
            <span aria-hidden className={cn('block h-[9px] w-[22px] rounded-[3px]', SWATCH[channel])} />
            {CHANNEL_LABEL[channel]}
          </li>
        ))}
        <li className="flex items-center gap-2">
          <span aria-hidden className="hatch-block-legend block h-[9px] w-[22px] rounded-[3px]" />
          Owner block &middot; nobody can book this
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="hatch-past-legend block h-[9px] w-[22px] rounded-[3px]" />
          Already happened
        </li>
        <li className="text-muted-soft">
          Bars are coloured by channel, never by status. Status shows as a chip when a bar is selected.
        </li>
      </ul>
    </>
  );
}

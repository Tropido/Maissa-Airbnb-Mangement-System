import { ArrowDownRight, ArrowLeftRight, ArrowUpRight } from 'lucide-react';

import { StatusChip } from '@/components/dashboard/status-chip';
import { Card, CardLabel } from '@/components/ui/card';
import type { ActivityDay, ActivityEvent } from '@/lib/data/metrics';
import { CHANNEL_LABEL } from '@/lib/data/types';
import { cn, formatDayShort, parseISODate, pluralise } from '@/lib/utils';

const dayMonth = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

/** "Today · Mon 7 Sep", "Tomorrow · Tue 8 Sep", "Thu 10 Sep". */
function dayHeading(date: string, today: string) {
  const d = parseISODate(date);
  const delta = Math.round((d.getTime() - parseISODate(today).getTime()) / 86_400_000);
  const label = `${formatDayShort(d)} ${dayMonth.format(d)}`;
  if (delta === 0) return `Today · ${label}`;
  if (delta === 1) return `Tomorrow · ${label}`;
  return label;
}

type Row =
  | { kind: 'event'; event: ActivityEvent }
  | { kind: 'turnover'; out: ActivityEvent; in: ActivityEvent };

/**
 * A same-day departure and arrival on one listing is a turnover — the slot the
 * cleaning team cannot move. The departure row becomes a turnover row; the
 * arrival keeps its own row so its status is still visible.
 */
function rowsFor(events: ActivityEvent[]): Row[] {
  const rows: Row[] = [];
  for (const event of events) {
    if (event.kind === 'check_out') {
      const arrival = events.find((e) => e.kind === 'check_in' && e.listing.id === event.listing.id);
      if (arrival) {
        rows.push({ kind: 'turnover', out: event, in: arrival });
        continue;
      }
    }
    rows.push({ kind: 'event', event });
  }
  return rows;
}

const ICON = {
  check_in: { Icon: ArrowDownRight, cls: 'bg-status-confirmed-bg text-status-confirmed' },
  check_out: { Icon: ArrowUpRight, cls: 'bg-channel-airbnb-tint text-channel-airbnb-ink' },
  turnover: { Icon: ArrowLeftRight, cls: 'bg-status-early-bg text-status-early' },
};

function Glyph({ kind }: { kind: keyof typeof ICON }) {
  const { Icon, cls } = ICON[kind];
  return (
    <span aria-hidden className={cn('flex size-[30px] shrink-0 items-center justify-center rounded-full', cls)}>
      <Icon className="size-3.5" />
    </span>
  );
}

/** Upcoming arrivals, departures and turnovers, grouped by day. */
export function ActivityFeed({ days, today, span = 14 }: { days: ActivityDay[]; today: string; span?: number }) {
  return (
    <Card data-reveal className="p-[clamp(20px,2.4vw,30px)]">
      <section aria-labelledby="activity-heading">
        <CardLabel id="activity-heading">Next {span} days</CardLabel>

        {days.length === 0 ? (
          <p className="mb-0 mt-6 text-[13px] text-muted-fg">No arrivals or departures in the next {span} days.</p>
        ) : null}

        {days.map((day, d) => (
          <div key={day.date} className={d === 0 ? 'mt-[22px]' : 'mt-[26px]'}>
            <h3 className="m-0 border-b border-ink/10 pb-2.5 text-xs font-normal tracking-[0.06em] text-ink">
              {dayHeading(day.date, today)}
            </h3>
            <ul className="m-0 list-none p-0">
              {rowsFor(day.events).map((row) => {
                if (row.kind === 'turnover') {
                  return (
                    <li key={`${row.out.id}-turnover`} className="flex gap-3.5 border-b border-ink/[.07] py-4 last:border-b-0">
                      <Glyph kind="turnover" />
                      <div className="min-w-0">
                        <p className="m-0 text-sm tracking-[-0.015em] text-ink">
                          Turnover{' '}
                          <span className="text-xs text-muted-soft">
                            &middot; {row.out.time} out, {row.in.time} in
                          </span>
                        </p>
                        <p className="mb-0 mt-[5px] text-xs text-muted-fg">
                          {row.out.listing.title} &middot; same-day clean &middot; {row.out.booking.guest_name} leaves
                        </p>
                      </div>
                    </li>
                  );
                }
                const { event } = row;
                const block = event.booking.channel === 'owner_block';
                const arriving = event.kind === 'check_in';
                const verb = block ? (arriving ? 'block starts' : 'block ends') : arriving ? 'arrives' : 'departs';
                return (
                  <li key={event.id} className="flex gap-3.5 border-b border-ink/[.07] py-4 last:border-b-0">
                    <Glyph kind={event.kind} />
                    <div className="min-w-0">
                      <p className="m-0 text-sm tracking-[-0.015em] text-ink">
                        {event.booking.guest_name}{' '}
                        <span className="text-xs text-muted-soft">
                          &middot; {verb} {event.time}
                        </span>
                      </p>
                      <p className="mb-0 mt-[5px] text-xs text-muted-fg">
                        {event.listing.title} &middot; {CHANNEL_LABEL[event.booking.channel]} &middot;{' '}
                        {pluralise(event.nights, 'night')}
                        {event.booking.guest_count > 0 ? <> &middot; {pluralise(event.booking.guest_count, 'guest')}</> : null}
                      </p>
                    </div>
                    <StatusChip status={event.booking.status} className="ml-auto self-start" />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
    </Card>
  );
}

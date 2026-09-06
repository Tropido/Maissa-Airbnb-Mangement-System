import { ArrowDownLeft, ArrowUpRight, Moon, Users } from 'lucide-react';

import { StatusChip } from '@/components/dashboard/status-chip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ActivityDay } from '@/lib/data/metrics';
import { CHANNEL_LABEL } from '@/lib/data/types';
import {
  cn,
  formatRelativeDayHeading,
  initials,
  parseISODate,
  pluralise,
} from '@/lib/utils';

/**
 * Upcoming arrivals and departures, grouped by day.
 *
 * Owner blocks appear here too — a cleaning slot or a photography reshoot is an
 * event the operator has to plan around exactly like a guest arrival, and hiding
 * it would make the day look emptier than it is.
 */
export function ActivityFeed({ days, today }: { days: ActivityDay[]; today: string }) {
  if (!days.length) {
    return (
      <div className="border-2 border-ink bg-bg-raised p-8 text-center">
        <p className="font-display text-lg font-extrabold uppercase">Nothing upcoming</p>
        <p className="mt-2 text-sm text-muted-fg">
          No arrivals or departures in the next fortnight.
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="activity-heading" className="min-w-0 border-2 border-ink bg-bg-raised">
      <header className="border-b-2 border-ink p-5">
        <h2 id="activity-heading" className="text-sm font-bold uppercase tracking-[0.12em]">
          Upcoming activity
        </h2>
        <p className="mt-1 text-xs text-muted-fg">Next 14 days, arrivals and departures.</p>
      </header>

      <div className="max-h-[40rem] overflow-y-auto">
        {days.map((day) => (
          <div key={day.date}>
            <h3 className="sticky top-0 z-10 border-b-2 border-ink bg-ink px-5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-foreground">
              {formatRelativeDayHeading(parseISODate(day.date), parseISODate(today))}
            </h3>

            <ul>
              {day.events.map((event) => {
                const arriving = event.kind === 'check_in';
                const isBlock = event.booking.channel === 'owner_block';
                return (
                  <li
                    key={event.id}
                    className="flex items-start gap-4 border-b-2 border-muted/60 p-5 last:border-b-0"
                  >
                    <Avatar className="size-11 shrink-0">
                      {event.booking.guest_avatar_url ? (
                        <AvatarImage src={event.booking.guest_avatar_url} alt="" />
                      ) : null}
                      <AvatarFallback className={cn(isBlock && 'bg-muted text-ink')}>
                        {initials(event.booking.guest_name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className="truncate font-bold tracking-tight">
                          {event.booking.guest_name}
                        </p>
                        <p className="text-xs text-muted-fg">
                          {event.listing.title}
                          <span aria-hidden className="mx-1.5">
                            /
                          </span>
                          {CHANNEL_LABEL[event.booking.channel]}
                        </p>
                      </div>

                      <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-fg">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 font-semibold',
                            arriving ? 'text-ink' : 'text-muted-fg',
                          )}
                        >
                          {arriving ? (
                            <ArrowDownLeft className="size-3.5" aria-hidden />
                          ) : (
                            <ArrowUpRight className="size-3.5" aria-hidden />
                          )}
                          {isBlock
                            ? arriving
                              ? 'Block starts'
                              : 'Block ends'
                            : arriving
                              ? 'Check-in'
                              : 'Check-out'}{' '}
                          {event.time}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <Moon className="size-3.5" aria-hidden />
                          {pluralise(event.nights, 'night')}
                        </span>

                        {event.booking.guest_count > 0 ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Users className="size-3.5" aria-hidden />
                            {pluralise(event.booking.guest_count, 'guest')}
                          </span>
                        ) : null}
                      </p>
                    </div>

                    <StatusChip status={event.booking.status} className="shrink-0" />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { OverviewPanel } from '@/components/dashboard/overview-panel';
import { ResourceCarousel } from '@/components/dashboard/resource-carousel';
import { StatCards, type StatCard } from '@/components/dashboard/stat-cards';
import { Button } from '@/components/ui/button';
import { unreadCount } from '@/lib/data/inbox';
import {
  RANGE_OPTIONS,
  buildActivityFeed,
  buildIssues,
  buildOverviewMetrics,
  countOccupied,
  type OverviewMetrics,
  type RangeKey,
} from '@/lib/data/metrics';
import { getBookings, getHost, getListings } from '@/lib/data/queries';
import { cn, formatDateLong, pluralise, toISODate } from '@/lib/utils';

// Metrics are derived from "now", so this page is always rendered fresh.
export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
  const today = new Date();
  const [host, listings, bookings] = await Promise.all([getHost(), getListings(), getBookings()]);

  const metricsByRange = Object.fromEntries(
    RANGE_OPTIONS.map((option) => [
      option.key,
      buildOverviewMetrics(bookings, listings, option.key, today),
    ]),
  ) as Record<RangeKey, OverviewMetrics>;

  const issues = buildIssues(bookings, listings, today);
  const occupied = countOccupied(bookings, today);
  const unread = unreadCount();
  const activity = buildActivityFeed(bookings, listings, today, 14);

  const cards: StatCard[] = [
    {
      label: 'Occupied',
      value: occupied,
      descriptor: `${pluralise(occupied, 'property', 'properties')} with guests in residence right now, of ${listings.length}.`,
      href: '/dashboard/calendar',
      icon: 'home',
    },
    {
      label: 'Unread messages',
      value: unread,
      descriptor:
        unread > 0
          ? 'Guests waiting on a reply. Response time is the ranking factor you control.'
          : 'Inbox is clear. Nothing waiting on a reply.',
      href: '/dashboard/messaging',
      icon: 'mail',
    },
    {
      label: 'Need attention',
      value: issues.length,
      descriptor:
        issues.length > 0
          ? 'Unpaid or unconfirmed stays arriving inside a week, plus listings not yet live.'
          : 'Nothing outstanding across the portfolio.',
      href: '#issues',
      icon: 'alert',
      tone: 'attention',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-shell px-4 py-8 sm:px-6 lg:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-fg">
            {formatDateLong(today)}
          </p>
          <h1 className="mt-2 font-display text-display-sm uppercase sm:text-display-md">
            Welcome back, {host.display_name.split(' ')[0]}
          </h1>
        </div>
        <Button asChild variant="outline" size="md">
          <Link href="/dashboard/calendar">Open calendar</Link>
        </Button>
      </header>

      <div className="mt-8">
        <StatCards cards={cards} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <OverviewPanel metricsByRange={metricsByRange} />
        <ActivityFeed days={activity} today={toISODate(today)} />
      </div>

      {issues.length > 0 ? (
        <section
          id="issues"
          aria-labelledby="issues-heading"
          className="mt-6 border-2 border-ink bg-bg-raised"
        >
          <header className="border-b-2 border-ink p-5">
            <h2 id="issues-heading" className="text-sm font-bold uppercase tracking-[0.12em]">
              Needs attention
            </h2>
            <p className="mt-1 text-xs text-muted-fg">
              {pluralise(issues.length, 'item')} across bookings and listings.
            </p>
          </header>
          <ul className="grid gap-px bg-ink sm:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
              <li key={issue.id} className="flex items-start gap-3 bg-bg-raised p-5">
                <span
                  aria-hidden
                  className={cn(
                    'mt-0.5 flex size-7 shrink-0 items-center justify-center border-2 border-ink',
                    issue.severity === 'danger'
                      ? 'bg-danger text-danger-foreground'
                      : 'bg-warning text-warning-foreground',
                  )}
                >
                  <AlertTriangle className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold tracking-tight">{issue.headline}</p>
                  <p className="mt-1 text-xs text-muted-fg">{issue.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-10">
        <ResourceCarousel />
      </div>
    </div>
  );
}

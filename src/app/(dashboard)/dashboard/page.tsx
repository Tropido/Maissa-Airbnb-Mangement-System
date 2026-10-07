import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { OverviewPanel } from '@/components/dashboard/overview-panel';
import { StatCards, type StatCard } from '@/components/dashboard/stat-cards';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardLabel } from '@/components/ui/card';
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

const PLANNED = [
  {
    href: '/dashboard/channels',
    title: 'Channels',
    body: 'Per-channel take rate, sync health, and which source is quietly eating the margin across the homes.',
  },
  {
    href: '/dashboard/analytics',
    title: 'Analytics',
    body: 'Season-over-season occupancy, ADR per home, and lead time to booking.',
  },
  {
    href: '/dashboard/tasks',
    title: 'Tasks',
    body: 'Turnover checklists assigned to the team, with photo sign-off per room.',
  },
];

/** Operator overview — `Maissa Redesign/Maissa Dashboard.dc.html`, bound to live metrics. */
export default async function DashboardOverviewPage() {
  const today = new Date();
  const [host, listings, bookings] = await Promise.all([getHost(), getListings(), getBookings()]);

  const metricsByRange = Object.fromEntries(
    RANGE_OPTIONS.map((option) => [option.key, buildOverviewMetrics(bookings, listings, option.key, today)]),
  ) as Record<RangeKey, OverviewMetrics>;

  const issues = buildIssues(bookings, listings, today);
  const occupied = countOccupied(bookings, today);
  const unread = unreadCount();
  const activity = buildActivityFeed(bookings, listings, today, 14);
  const sellable = listings.filter((l) => l.status !== 'inactive').length;

  const cards: StatCard[] = [
    {
      label: 'Occupied',
      value: occupied,
      descriptor:
        occupied === 0
          ? 'No guests in residence right now.'
          : occupied === sellable && sellable > 1
            ? `All ${sellable} homes have guests in residence right now.`
            : `${pluralise(occupied, 'home')} with guests in residence right now, of ${sellable}.`,
      href: '/dashboard/calendar',
    },
    {
      label: 'Unread messages',
      value: unread,
      descriptor:
        unread > 0
          ? 'Guests waiting on a reply. Response time is the ranking factor you control.'
          : 'Inbox is clear. Nothing waiting on a reply.',
      href: '/dashboard/messaging',
    },
    {
      label: 'Need attention',
      value: issues.length,
      descriptor:
        issues.length > 0
          ? 'Unpaid or unconfirmed stays arriving inside a week, plus listings not yet live.'
          : 'Nothing outstanding across the homes.',
      href: '#issues',
      tone: 'attention',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-console px-gutter-console pb-[clamp(50px,6vw,90px)] pt-[clamp(24px,3vw,44px)]">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p data-intro className="m-0 text-[11px] uppercase tracking-[0.2em] text-muted-soft">
            <span className="sr-only">{formatDateLong(today)}</span>
            <span aria-hidden data-scramble>
              {formatDateLong(today)}
            </span>
          </p>
          <h1
            data-intro
            className="mb-0 mt-3.5 text-[clamp(28px,3.6vw,46px)] font-normal leading-[1.02] tracking-[-0.045em] text-ink"
          >
            Welcome back, {host.display_name.split(' ')[0]}
          </h1>
        </div>
        <Link href="/dashboard/calendar" className={buttonVariants({ variant: 'outline', size: 'md' })}>
          Open calendar
        </Link>
      </header>

      <div className="mt-[clamp(22px,3vw,34px)]">
        <StatCards cards={cards} />
      </div>

      <div className="mt-3.5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-3.5">
        <OverviewPanel metricsByRange={metricsByRange} />
        <ActivityFeed days={activity} today={toISODate(today)} />
      </div>

      <Card id="issues" data-reveal className="mt-3.5 scroll-mt-24 overflow-hidden">
        <section aria-labelledby="issues-heading">
          <div className="border-b border-ink/[.08] px-[clamp(20px,2.4vw,30px)] py-[22px]">
            <CardLabel id="issues-heading">Needs attention</CardLabel>
            <p className="mb-0 mt-2 text-[12.5px] text-muted-fg">
              {issues.length > 0
                ? `${pluralise(issues.length, 'item')} across bookings and listings.`
                : 'Nothing outstanding. Unpaid or unconfirmed arrivals in the next week would appear here.'}
            </p>
          </div>
          {issues.length > 0 ? (
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-px bg-ink/[.08] p-0">
              {issues.map((issue) => (
                <li key={issue.id} className="flex gap-3.5 bg-bg-card px-[clamp(20px,2.4vw,30px)] py-[22px]">
                  <span
                    aria-hidden
                    className={cn(
                      'flex size-[26px] shrink-0 items-center justify-center rounded-full',
                      issue.severity === 'danger' ? 'bg-danger text-danger-foreground' : 'bg-status-awaiting-bg text-status-awaiting',
                    )}
                  >
                    <AlertTriangle className="size-3" />
                  </span>
                  <div className="min-w-0">
                    <p className="m-0 text-sm tracking-[-0.015em] text-ink">
                      <span className="sr-only">{issue.severity === 'danger' ? 'Urgent: ' : 'Check: '}</span>
                      {issue.headline}
                    </p>
                    <p className="mb-0 mt-1.5 text-xs leading-[1.6] text-muted-fg">{issue.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </Card>

      <section
        id="stubs"
        data-reveal
        aria-labelledby="planned-heading"
        className="mt-3.5 rounded-[20px] border border-ink/[.08] bg-bg-sunken p-[clamp(20px,2.4vw,30px)]"
      >
        <CardLabel id="planned-heading">Planned for these sections</CardLabel>
        <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[22px]">
          {PLANNED.map((item) => (
            <div key={item.href}>
              <Link href={item.href} className="text-base tracking-[-0.025em] text-ink">
                {item.title}
              </Link>
              <p className="mb-0 mt-2.5 text-[12.5px] leading-[1.65] text-muted-fg">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mb-0 mt-[22px] text-xs text-muted-soft">
          Deliberately unbuilt, and labelled as such — nothing here is faked with sample data.
        </p>
      </section>
    </div>
  );
}

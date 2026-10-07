'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail } from 'lucide-react';

import { useHideOnScroll } from '@/components/motion/use-hide-on-scroll';
import { cn, initials } from '@/lib/utils';
import type { Host } from '@/lib/data/types';

const NAV = [
  { href: '/dashboard', label: 'Overview', planned: false },
  { href: '/dashboard/calendar', label: 'Calendar', planned: false },
  { href: '/dashboard/messaging', label: 'Messaging', planned: false },
  { href: '/dashboard/channels', label: 'Channels', planned: true },
  { href: '/dashboard/analytics', label: 'Analytics', planned: true },
  { href: '/dashboard/tasks', label: 'Tasks', planned: true },
];

/**
 * Operator navigation from the dashboard references: monogram, pill links,
 * search, inbox and avatar. Sections that are scoped out of this build stay
 * reachable (each explains what is planned) but read as planned — a hollow
 * marker and a spoken "planned" — rather than as working features.
 *
 * On narrow screens the links move to their own scrollable row instead of
 * hiding behind a menu, so every section stays one tap away.
 */
export function TopNav({ host, unreadCount }: { host: Host; unreadCount: number }) {
  const pathname = usePathname();
  const bar = useRef<HTMLElement>(null);
  useHideOnScroll(bar);
  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      ref={bar}
      className="sticky top-0 z-30 border-b border-ink/[.08] bg-bg/[.86] backdrop-blur-[16px]"
    >
      <div className="mx-auto flex max-w-console flex-wrap items-center gap-x-3.5 gap-y-2 px-gutter-console py-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 text-base font-medium tracking-[-0.03em] text-ink hover:text-ink">
          <span aria-hidden className="flex size-8 items-center justify-center rounded-full bg-ink text-[13px] text-ink-foreground">
            M
          </span>
          <span>Maissa</span>
        </Link>

        <nav
          aria-label="Dashboard"
          className="no-scrollbar relative order-last -mx-1 flex w-full items-center gap-0.5 overflow-x-auto px-1 lg:order-none lg:ml-3 lg:w-auto"
        >
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-[15px] py-2 text-[13.5px] transition-colors duration-300',
                  active ? 'bg-ink/[.07] text-ink' : 'text-muted-soft hover:bg-ink/5 hover:text-ink',
                )}
              >
                {item.label}
                {item.planned ? (
                  <>
                    <span aria-hidden className="block size-[5px] rounded-full border border-current opacity-70" />
                    <span className="sr-only"> (planned)</span>
                  </>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="hidden md:block">
            <label htmlFor="dashboard-search" className="sr-only">
              Search bookings, guests and listings
            </label>
            <input
              id="dashboard-search"
              type="search"
              placeholder="Search"
              className="h-[38px] w-[clamp(110px,16vw,220px)] rounded-full border border-ink/[.12] bg-bg-card px-[15px] text-[13px] text-ink placeholder:text-muted-soft"
            />
          </div>
          <Link
            href="/dashboard/messaging"
            aria-label={`Inbox, ${unreadCount} unread`}
            className="relative flex size-[38px] items-center justify-center rounded-full border border-ink/[.12] bg-bg-card text-ink hover:text-ink"
          >
            <Mail className="size-4" aria-hidden />
            {unreadCount > 0 ? (
              <span
                aria-hidden
                className="absolute -right-[3px] -top-[3px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-danger px-1 text-[10px] text-danger-foreground"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : null}
          </Link>
          <span
            aria-hidden
            className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-ink text-[13px] tracking-[0.02em] text-ink-foreground"
          >
            {initials(host.display_name).slice(0, 1)}
          </span>
          <span className="sr-only">Signed in as {host.display_name}</span>
        </div>
      </div>
    </header>
  );
}

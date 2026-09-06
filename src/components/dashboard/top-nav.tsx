'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  Home,
  Mail,
  Menu,
  MessageSquare,
  Radio,
  Search,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn, initials } from '@/lib/utils';
import type { Host } from '@/lib/data/types';

const NAV = [
  { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/dashboard/channels', label: 'Channels', icon: Radio },
  { href: '/dashboard/messaging', label: 'Messaging', icon: MessageSquare },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
];

export function TopNav({
  host,
  unreadCount,
  trialDaysLeft,
}: {
  host: Host;
  unreadCount: number;
  trialDaysLeft: number;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-bg-raised">
      <div className="mx-auto flex h-16 max-w-shell items-center gap-3 px-4 sm:px-6">
        <Link
          href="/dashboard"
          aria-label="Dashboard home"
          aria-current={pathname === '/dashboard' ? 'page' : undefined}
          className={cn(
            'flex size-10 shrink-0 items-center justify-center border-2 border-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2',
            pathname === '/dashboard' ? 'bg-ink text-ink-foreground' : 'bg-bg hover:bg-accent',
          )}
        >
          <Home className="size-4" aria-hidden />
        </Link>

        <Link
          href="/dashboard/messaging"
          aria-label={`Inbox, ${unreadCount} unread`}
          className="relative flex size-10 shrink-0 items-center justify-center border-2 border-ink bg-bg transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <Mail className="size-4" aria-hidden />
          {unreadCount > 0 ? (
            <span className="absolute -right-2 -top-2 flex min-w-5 items-center justify-center border-2 border-ink bg-danger px-1 text-[10px] font-bold leading-4 text-danger-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : null}
        </Link>

        <nav aria-label="Dashboard" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'relative px-3 py-2 text-sm font-semibold tracking-tight transition-colors',
                isActive(item.href) ? 'text-ink' : 'text-muted-fg hover:text-ink',
              )}
            >
              {item.label}
              {isActive(item.href) ? (
                <span aria-hidden className="absolute inset-x-2 -bottom-[9px] h-1 bg-accent" />
              ) : null}
            </Link>
          ))}
          <button
            type="button"
            className="px-3 py-2 text-sm font-semibold tracking-tight text-muted-fg transition-colors hover:text-ink"
          >
            More
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Badge variant="warning" className="hidden sm:inline-flex">
            Trial · {trialDaysLeft} days left
          </Badge>

          <div className="relative hidden md:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-fg"
              aria-hidden
            />
            <label htmlFor="dashboard-search" className="sr-only">
              Search bookings, guests and listings
            </label>
            <input
              id="dashboard-search"
              type="search"
              placeholder="Search"
              className="h-10 w-44 border-2 border-ink bg-bg pl-9 pr-3 text-sm placeholder:text-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 xl:w-64"
            />
          </div>

          <Avatar className="size-10">
            {host.avatar_url ? <AvatarImage src={host.avatar_url} alt="" /> : null}
            <AvatarFallback>{initials(host.display_name)}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Signed in as {host.display_name}</span>

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" aria-label="Open dashboard menu">
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="font-display text-2xl font-extrabold uppercase tracking-[-0.03em]">
                Dashboard
              </SheetTitle>
              <nav aria-label="Dashboard mobile" className="mt-8 flex flex-col">
                <SheetClose asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 border-b-2 border-ink py-4 text-lg font-bold"
                  >
                    <Home className="size-5" aria-hidden />
                    Overview
                  </Link>
                </SheetClose>
                {NAV.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 border-b-2 border-ink py-4 text-lg font-bold"
                    >
                      <item.icon className="size-5" aria-hidden />
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto pt-8">
                <Badge variant="warning">Trial · {trialDaysLeft} days left</Badge>
                <Button asChild variant="outline" size="lg" className="mt-4 w-full">
                  <Link href="/">Back to the site</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

import type { Metadata } from 'next';

import { TopNav } from '@/components/dashboard/top-nav';
import { IntroCurtain } from '@/components/motion/intro-curtain';
import { unreadCount } from '@/lib/data/inbox';
import { getHost } from '@/lib/data/queries';

export const metadata: Metadata = {
  title: 'Operator dashboard',
  description: 'Listings, bookings and calendar availability for the portfolio.',
  robots: { index: false, follow: false },
};

/**
 * Operator shell. Native scrolling throughout (the calendar needs it). Page
 * motion lives in template.tsx so it hydrates with each page; the branded
 * entrance only plays if the dashboard is where this browser session started.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const host = await getHost();

  return (
    <>
      <IntroCurtain mark="Maissa" note="Operator console" />
      <div className="flex min-h-screen flex-col bg-bg">
        <a
          href="#dashboard-main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-ink-foreground"
        >
          Skip to content
        </a>
        <TopNav host={host} unreadCount={unreadCount()} />
        <main id="dashboard-main" className="flex-1">
          {children}
        </main>
      </div>
    </>
  );
}

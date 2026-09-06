import type { Metadata } from 'next';

import { TopNav } from '@/components/dashboard/top-nav';
import { unreadCount } from '@/lib/data/inbox';
import { getHost } from '@/lib/data/queries';

export const metadata: Metadata = {
  title: 'Operator dashboard',
  description: 'Listings, bookings and calendar availability for the portfolio.',
  robots: { index: false, follow: false },
};

/** Days remaining on the workspace trial, shown in the nav pill. */
const TRIAL_DAYS_LEFT = 12;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const host = await getHost();

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border-2 focus:border-ink focus:bg-primary focus:px-4 focus:py-2 focus:font-bold focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <TopNav host={host} unreadCount={unreadCount()} trialDaysLeft={TRIAL_DAYS_LEFT} />
      <main id="dashboard-main" className="flex-1">
        {children}
      </main>
    </div>
  );
}

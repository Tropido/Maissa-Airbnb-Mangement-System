import type { Metadata } from 'next';

import { CalendarBoard } from '@/components/dashboard/calendar-board';
import { getBookings, getListings } from '@/lib/data/queries';
import { channelTotals } from '@/lib/data/views';
import { diffInNights, toISODate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Calendar' };

export const dynamic = 'force-dynamic';

/** Availability and booking inspection — `Maissa Redesign/Maissa Calendar.dc.html`. */
export default async function CalendarPage() {
  const today = new Date();
  const [listings, bookings] = await Promise.all([getListings(), getBookings()]);
  const { nights, gross } = channelTotals(bookings, diffInNights);

  return (
    <div className="mx-auto w-full max-w-console px-gutter-console pb-[clamp(50px,6vw,90px)] pt-[clamp(22px,3vw,40px)]">
      <CalendarBoard
        listings={listings}
        bookings={bookings.filter((b) => b.status !== 'cancelled')}
        anchor={toISODate(today)}
        nightsByChannel={nights}
        gross={gross}
      />
    </div>
  );
}

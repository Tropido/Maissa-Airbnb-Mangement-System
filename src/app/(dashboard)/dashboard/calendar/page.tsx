import type { Metadata } from 'next';

import { CalendarGrid } from '@/components/dashboard/calendar-grid';
import { getBookings, getListings } from '@/lib/data/queries';
import { CHANNEL_LABEL, type Channel } from '@/lib/data/types';
import { diffInNights, formatTND, toISODate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Calendar' };

export const dynamic = 'force-dynamic';

const CHANNEL_ORDER: Channel[] = ['airbnb', 'booking_com', 'direct', 'owner_block'];

export default async function CalendarPage() {
  const today = new Date();
  const [listings, bookings] = await Promise.all([getListings(), getBookings()]);

  const nightsByChannel = new Map<Channel, number>();
  let grossValue = 0;

  for (const booking of bookings) {
    if (booking.status === 'cancelled') continue;
    const nights = diffInNights(booking.check_in, booking.check_out);
    nightsByChannel.set(booking.channel, (nightsByChannel.get(booking.channel) ?? 0) + nights);
    if (booking.channel !== 'owner_block') grossValue += nights * booking.nightly_price;
  }

  return (
    <div className="mx-auto w-full max-w-shell px-4 py-8 sm:px-6 lg:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-fg">
            Availability
          </p>
          <h1 className="mt-2 font-display text-display-sm uppercase sm:text-display-md">
            Calendar
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-fg">
            Sixty nights across every listing. Bars are coloured by the channel the booking came
            through; hatched cells are blocked and cannot be sold.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-px border-2 border-ink bg-ink sm:grid-cols-4">
          {CHANNEL_ORDER.map((channel) => (
            <div key={channel} className="bg-bg-raised px-4 py-3">
              <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-fg">
                {CHANNEL_LABEL[channel]}
              </dt>
              <dd className="mt-1 font-display text-xl font-extrabold leading-none">
                {nightsByChannel.get(channel) ?? 0}
                <span className="ml-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-fg">
                  nights
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <p className="mt-4 text-sm text-muted-fg">
        Gross booked value on the board:{' '}
        <strong className="text-ink">{formatTND(grossValue)}</strong>
      </p>

      <div className="mt-6">
        <CalendarGrid listings={listings} bookings={bookings} anchor={toISODate(today)} />
      </div>
    </div>
  );
}

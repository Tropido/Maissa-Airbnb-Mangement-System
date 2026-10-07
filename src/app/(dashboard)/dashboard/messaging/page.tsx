import type { Metadata } from 'next';

import { Inbox, type InboxThread } from '@/components/dashboard/inbox';
import { MESSAGE_THREADS } from '@/lib/data/inbox';
import { getListings } from '@/lib/data/queries';
import { inboxFilterOptions } from '@/lib/data/views';

export const metadata: Metadata = { title: 'Messaging' };

/** Read-only guest inbox — `Maissa Redesign/Maissa Messaging.dc.html`. */
export default async function MessagingPage() {
  const listings = await getListings();
  const byId = new Map(listings.map((l) => [l.id, l]));
  const threads: InboxThread[] = MESSAGE_THREADS.map((thread) => ({
    ...thread,
    listing_title: byId.get(thread.listing_id)?.title ?? 'Unknown home',
  }));
  const unread = threads.filter((t) => t.unread).length;
  const eyebrow = `Read-only · ${unread} unread`;

  return (
    <div className="mx-auto w-full max-w-inbox px-gutter-console pb-[clamp(50px,6vw,90px)] pt-[clamp(22px,3vw,40px)]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div data-intro>
          <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-muted-soft">
            <span className="sr-only">{eyebrow}</span>
            <span aria-hidden data-scramble>
              {eyebrow}
            </span>
          </p>
          <h1 className="mb-0 mt-3.5 text-[clamp(26px,3.4vw,42px)] font-normal leading-[1.02] tracking-[-0.045em] text-ink">
            Guest inbox
          </h1>
        </div>
        <p data-intro className="m-0 max-w-[38ch] text-[12.5px] leading-[1.65] text-muted-fg">
          Replies still go out on the channel the guest wrote from — Airbnb or Booking.com. This is
          visibility, not a second inbox to keep.
        </p>
      </div>

      <Inbox threads={threads} options={inboxFilterOptions(threads, listings)} />

      <p className="mb-0 mt-[22px] text-xs text-muted-soft">
        Threads are seeded from <span className="text-ink">src/lib/data/inbox.ts</span> — static by design,
        not Supabase-backed.
      </p>
    </div>
  );
}

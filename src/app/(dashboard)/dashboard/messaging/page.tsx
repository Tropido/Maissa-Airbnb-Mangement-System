import type { Metadata } from 'next';
import { Circle } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MESSAGE_THREADS } from '@/lib/data/inbox';
import { getListings } from '@/lib/data/queries';
import { CHANNEL_LABEL } from '@/lib/data/types';
import { cn, initials, pluralise } from '@/lib/utils';

export const metadata: Metadata = { title: 'Messaging' };

function relativeTime(minutes: number) {
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default async function MessagingPage() {
  const listings = await getListings();
  const byId = new Map(listings.map((l) => [l.id, l]));
  const unread = MESSAGE_THREADS.filter((m) => m.unread).length;

  return (
    <div className="mx-auto w-full max-w-shell px-4 py-8 sm:px-6 lg:py-10">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-fg">Inbox</p>
        <h1 className="mt-2 font-display text-display-sm uppercase sm:text-display-md">Messaging</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-fg">
          {pluralise(unread, 'thread')} waiting on a reply. Replies still go out on the channel the
          guest wrote from — this is the read layer.
        </p>
      </header>

      <ul className="mt-8 border-2 border-ink bg-bg-raised">
        {MESSAGE_THREADS.map((thread) => {
          const listing = byId.get(thread.listing_id);
          return (
            <li
              key={thread.id}
              className={cn(
                'flex items-start gap-4 border-b-2 border-muted/60 p-5 last:border-b-0',
                thread.unread && 'bg-bg',
              )}
            >
              <Avatar className="size-11 shrink-0">
                <AvatarFallback>{initials(thread.guest_name)}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-bold tracking-tight">{thread.guest_name}</p>
                  <p className="text-xs text-muted-fg">
                    {listing?.title ?? 'Unknown listing'}
                    <span aria-hidden className="mx-1.5">
                      /
                    </span>
                    {CHANNEL_LABEL[thread.channel]}
                  </p>
                  <p className="ml-auto text-xs text-muted-fg">
                    {relativeTime(thread.received_minutes_ago)}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-fg">{thread.preview}</p>
              </div>

              {thread.unread ? (
                <Badge variant="danger" className="shrink-0">
                  <Circle aria-hidden className="fill-current" />
                  Unread
                </Badge>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

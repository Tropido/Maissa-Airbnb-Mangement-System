'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { Flip, MOTION_QUERIES, gsap } from '@/components/motion/gsap';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import type { MessageThread } from '@/lib/data/inbox';
import { CHANNEL_LABEL, type Channel } from '@/lib/data/types';
import { filterThreads, formatReceived, type InboxFilter, type InboxFilterOption } from '@/lib/data/views';
import { cn, initials } from '@/lib/utils';

export interface InboxThread extends MessageThread {
  listing_title: string;
}

const CHANNEL_CHIP: Record<Channel, BadgeProps['variant']> = {
  airbnb: 'airbnb',
  booking_com: 'booking',
  direct: 'direct',
  owner_block: 'blocked',
};

/**
 * Read-only guest inbox — `Maissa Redesign/Maissa Messaging.dc.html`.
 * Filters are local view state over the seeded threads; the list re-flows with
 * Flip when they change. No sending, no read receipts, nothing persisted.
 */
export function Inbox({ threads, options }: { threads: InboxThread[]; options: InboxFilterOption[] }) {
  const [filter, setFilter] = useState<InboxFilter>('all');
  const list = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const rows = filterThreads(threads, filter);

  const choose = (next: InboxFilter) => {
    if (next === filter) return;
    const items = list.current?.querySelectorAll('[data-flip-item]');
    if (items?.length && !window.matchMedia(MOTION_QUERIES.reduce).matches) {
      flipState.current = Flip.getState(items);
    }
    setFilter(next);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    const tween = Flip.from(state, {
      targets: list.current?.querySelectorAll('[data-flip-item]'),
      duration: 0.45,
      ease: 'power3.inOut',
      absolute: false,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }),
    });
    return () => {
      tween.progress(1).kill();
    };
  }, [filter]);

  return (
    <>
      <div role="group" aria-label="Filter threads" className="mt-[clamp(22px,3vw,32px)] flex flex-wrap items-center gap-2.5">
        {options.map((option) => {
          const on = option.key === filter;
          return (
            <button
              key={option.key}
              type="button"
              aria-pressed={on}
              onClick={() => choose(option.key)}
              className={cn(
                'h-[38px] whitespace-nowrap rounded-full border px-[18px] text-[12.5px] tracking-[-0.01em] transition-colors duration-300',
                on ? 'border-ink bg-ink text-ink-foreground' : 'border-ink/20 bg-transparent text-muted-fg hover:text-ink',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <p role="status" className="sr-only">
        {rows.length === 1 ? '1 thread shown' : `${rows.length} threads shown`}
      </p>
      <ul
        ref={list}
        className="m-0 mt-[18px] list-none overflow-hidden rounded-[20px] border border-ink/10 bg-bg-raised p-0"
      >
        {rows.length === 0 ? (
          <li className="px-[clamp(18px,2.4vw,26px)] py-8 text-[13px] text-muted-fg">No threads match this filter.</li>
        ) : null}
        {rows.map((thread) => (
          <li
            key={thread.id}
            data-flip-id={thread.id}
            data-flip-item
            className={cn(
              'flex gap-4 border-b border-ink/[.08] px-[clamp(18px,2.4vw,26px)] py-[22px] last:border-b-0',
              thread.unread && 'bg-bg-tint',
            )}
          >
            <span
              aria-hidden
              className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-ink text-[13.5px] tracking-[0.02em] text-ink-foreground"
            >
              {initials(thread.guest_name)}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'm-0 flex flex-wrap items-center gap-2.5 text-[14.5px] tracking-[-0.02em]',
                  thread.unread ? 'text-ink' : 'text-muted-fg',
                )}
              >
                {thread.guest_name}
                <Badge variant={CHANNEL_CHIP[thread.channel]} size="sm">
                  {CHANNEL_LABEL[thread.channel]}
                </Badge>
                {thread.unread ? (
                  <Badge variant="ink" size="sm">
                    Unread
                  </Badge>
                ) : null}
              </p>
              <p className={cn('mb-0 mt-2 text-[13.5px] leading-[1.6]', thread.unread ? 'text-ink-soft' : 'text-muted-fg')}>
                {thread.preview}
              </p>
              <p className="mb-0 mt-2 text-[11.5px] text-muted-soft">{thread.listing_title}</p>
            </div>
            <p className="m-0 shrink-0 whitespace-nowrap text-[11.5px] text-muted-soft">
              <span className="sr-only">Received </span>
              {formatReceived(thread.received_minutes_ago)}
              <span className="sr-only"> ago</span>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

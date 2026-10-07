import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface StatCard {
  label: string;
  value: number;
  descriptor: string;
  href: string;
  /** Tinted only when the number is something to act on. */
  tone?: 'neutral' | 'attention';
}

/** The three summary tiles at the top of the overview. */
export function StatCards({ cards }: { cards: StatCard[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3.5 p-0">
      {cards.map((card) => {
        const attention = card.tone === 'attention' && card.value > 0;
        return (
          <li key={card.label} data-reveal>
            <Link
              href={card.href}
              className={cn(
                'block h-full rounded-[20px] border p-6 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-lift',
                attention
                  ? 'border-attention-border bg-attention text-attention-fg hover:text-attention-fg'
                  : 'border-ink/[.08] bg-bg-card text-ink hover:text-ink',
              )}
            >
              <span
                className={cn(
                  'flex items-center gap-2 text-[10.5px] uppercase tracking-[0.2em]',
                  attention ? 'text-attention-label' : 'text-muted-soft',
                )}
              >
                {attention ? <AlertTriangle className="size-3" aria-hidden /> : null}
                {card.label}
              </span>
              <span
                className={cn(
                  'mt-4 block text-[44px] leading-none tracking-[-0.045em]',
                  attention ? 'text-attention-value' : 'text-ink',
                )}
              >
                {card.value}
              </span>
              <span
                className={cn(
                  'mt-3.5 block text-[12.5px] leading-[1.6]',
                  attention ? 'text-attention-fg' : 'text-muted-fg',
                )}
              >
                {card.descriptor}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

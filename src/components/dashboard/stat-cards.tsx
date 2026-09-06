import Link from 'next/link';
import { AlertTriangle, ArrowUpRight, Home, Mail } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface StatCard {
  label: string;
  value: number;
  descriptor: string;
  href: string;
  icon: 'home' | 'mail' | 'alert';
  /** Tinted only when the number is something to act on. */
  tone?: 'neutral' | 'attention';
}

const ICONS = { home: Home, mail: Mail, alert: AlertTriangle } as const;

export function StatCards({ cards }: { cards: StatCard[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = ICONS[card.icon];
        const attention = card.tone === 'attention' && card.value > 0;
        return (
          <li key={card.label}>
            <Link
              href={card.href}
              className={cn(
                'group flex h-full flex-col justify-between gap-6 border-2 border-ink p-5 transition-shadow hover:shadow-brutal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2',
                attention ? 'bg-warning text-warning-foreground' : 'bg-bg-raised',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]">
                  <Icon className="size-4" aria-hidden />
                  {card.label}
                </span>
                <ArrowUpRight
                  className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
              </div>

              <div>
                <p className="font-display text-5xl font-extrabold leading-none tracking-tight">
                  {card.value}
                </p>
                <p
                  className={cn(
                    'mt-2 text-xs leading-relaxed',
                    attention ? 'text-warning-foreground' : 'text-muted-fg',
                  )}
                >
                  {card.descriptor}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

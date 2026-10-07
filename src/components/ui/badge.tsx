import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Small uppercase pill. Every tint/ink pairing here measures at least 5:1 —
 * see the contrast table in tailwind.config.ts.
 *
 * Meaning is never carried by colour alone: chips always render their label,
 * and status chips lead with a glyph as well.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full uppercase leading-none [&_svg]:size-3 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        neutral: 'bg-ink/[.07] text-ink-soft',
        ink: 'bg-ink text-ink-foreground',
        blush: 'bg-bg text-ink',
        confirmed: 'bg-status-confirmed-bg text-status-confirmed',
        awaiting: 'bg-status-awaiting-bg text-status-awaiting',
        unconfirmed: 'bg-status-unconfirmed-bg text-status-unconfirmed',
        early: 'bg-status-early-bg text-status-early',
        blocked: 'bg-status-blocked-bg text-status-blocked',
        airbnb: 'bg-channel-airbnb-tint text-channel-airbnb-ink',
        booking: 'bg-channel-booking-tint text-channel-booking-ink',
        direct: 'bg-channel-direct-tint text-channel-direct-ink',
        outline: 'border border-ink/20 text-ink',
      },
      size: {
        sm: 'px-[9px] py-1 text-[9.5px] tracking-[0.12em]',
        md: 'px-2.5 py-[5px] text-[10.5px] tracking-[0.1em]',
        lg: 'px-3.5 py-[7px] text-[10.5px] tracking-[0.16em]',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'md' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };

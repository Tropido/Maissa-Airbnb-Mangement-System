import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Status chip. Every variant pairs its block colour with the foreground that
 * clears WCAG AA against it — see the contrast table in tailwind.config.ts.
 *
 * Status is never carried by colour alone: the chip always renders its label,
 * and callers add an icon where the meaning is urgent.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap border-2 border-ink px-2 py-0.5 text-[11px] font-bold uppercase leading-tight tracking-[0.08em] [&_svg]:size-3 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        neutral: 'bg-bg-raised text-ink',
        ink: 'bg-ink text-ink-foreground',
        primary: 'bg-primary text-primary-foreground',
        accent: 'bg-accent text-accent-foreground',
        success: 'bg-success text-success-foreground',
        warning: 'bg-warning text-warning-foreground',
        danger: 'bg-danger text-danger-foreground',
        featured: 'bg-featured text-featured-foreground',
        outline: 'bg-transparent text-ink',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

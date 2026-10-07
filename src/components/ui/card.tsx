import * as React from 'react';

import { cn } from '@/lib/utils';

/** The dashboard's white surface: hairline border, 20px radius. */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('min-w-0 rounded-[20px] border border-ink/[.08] bg-bg-card', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

/** Small uppercase section label used across the console. */
const CardLabel = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('m-0 text-[10.5px] font-normal uppercase tracking-[0.2em] text-muted-soft', className)}
      {...props}
    />
  ),
);
CardLabel.displayName = 'CardLabel';

export { Card, CardLabel };

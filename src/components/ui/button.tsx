import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Pill button from the references. Hover changes are CSS-only (0.3–0.35s);
 * GSAP never touches these.
 *
 *   primary   ink fill, blush text — the main action on light grounds
 *   outline   hairline ink border — the secondary action on light grounds
 *   inverse   blush fill, ink text — the main action on dark grounds
 *   ghost     hairline blush border — the secondary action on dark grounds
 *   link      underlined text
 */
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full tracking-[-0.01em] transition-[background-color,color,opacity,border-color] duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-ink text-ink-foreground hover:bg-ink-raised hover:text-ink-foreground',
        outline: 'border border-ink/20 bg-transparent text-ink hover:bg-ink/5 hover:text-ink',
        inverse: 'bg-ink-foreground text-ink hover:text-ink hover:opacity-[.86]',
        ghost:
          'border border-ink-foreground/50 bg-transparent text-ink-foreground hover:bg-ink-foreground hover:text-ink',
        link: 'h-auto rounded-none p-0 text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink',
      },
      size: {
        sm: 'h-[42px] px-5 text-[13px]',
        md: 'h-[46px] px-6 text-[13.5px]',
        lg: 'h-[52px] px-[30px] text-sm',
        icon: 'size-10 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

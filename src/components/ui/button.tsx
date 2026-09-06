import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Brutalist button. Hard border, hard offset shadow, no radius; pressing moves
 * the block into its own shadow rather than fading it.
 *
 * Foregrounds are the AA-clearing pairings from tailwind.config — white on
 * `primary` measures 3.30:1 and is never used.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-tight transition-[transform,box-shadow,background-color] duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
  {
    variants: {
      variant: {
        primary:
          'border-2 border-ink bg-primary text-primary-foreground shadow-brutal hover:bg-primary-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
        outline:
          'border-2 border-ink bg-transparent text-ink shadow-brutal hover:bg-bg-raised active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
        solid:
          'border-2 border-ink bg-ink text-ink-foreground shadow-brutal hover:bg-ink/90 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
        inverse:
          'border-2 border-bg bg-bg text-ink shadow-brutal-inverse hover:bg-bg-raised active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
        ghost: 'border-2 border-transparent text-ink hover:border-ink hover:bg-bg-raised',
        link: 'text-ink underline decoration-2 underline-offset-4 hover:decoration-primary',
      },
      size: {
        sm: 'h-9 px-3 text-xs uppercase tracking-[0.08em]',
        md: 'h-11 px-5 text-sm',
        lg: 'h-14 px-7 text-base',
        icon: 'h-10 w-10 p-0',
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
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

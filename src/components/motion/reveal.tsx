'use client';

import { motion, type Variants } from 'framer-motion';

import { cn } from '@/lib/utils';
import { fadeUp, inView, stagger } from '@/lib/motion';

/**
 * Scroll-reveal wrappers.
 *
 * Reduced motion is handled once, at the provider (see motion-provider.tsx),
 * not branched per component: rendering a different element on the client than
 * the server produced a hydration mismatch, because the server has no media
 * query to read.
 */

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'header';
}

/** Single block that animates in when it scrolls into view. */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = 'div',
}: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      variants={variants}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Comp>
  );
}

/** Parent that releases its Reveal children one after another. */
export function RevealGroup({
  children,
  className,
  step = 0.08,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
  as?: 'div' | 'section' | 'ul';
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      variants={stagger(step)}
    >
      {children}
    </Comp>
  );
}

/** Child of a RevealGroup — inherits the parent's stagger timing. */
export function RevealItem({
  children,
  className,
  variants = fadeUp,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  as?: 'div' | 'li' | 'article';
}) {
  const Comp = motion[as];
  return (
    <Comp className={cn(className)} variants={variants}>
      {children}
    </Comp>
  );
}

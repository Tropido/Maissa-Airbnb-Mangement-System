import { cn } from '@/lib/utils';

/**
 * Marks a block for the GSAP entry animation wired in GsapProvider.
 *
 * This replaces the framer-motion `Reveal` of v4. It renders no client
 * component and no effect of its own — it only emits the `data-reveal`
 * attribute, and the single ScrollTrigger batch in the provider drives every
 * instance on the page. That is the difference between one observer and one per
 * section, and it is why scroll stays smooth with fifty of them on a page.
 *
 * `as` keeps the semantics right: a revealed section should still be a
 * `<section>`, a revealed list item still an `<li>`.
 */
export function Reveal<T extends React.ElementType = 'div'>({
  as,
  className,
  children,
  ...rest
}: { as?: T; className?: string; children: React.ReactNode } & Omit<
  React.ComponentPropsWithoutRef<T>,
  'as' | 'className' | 'children'
>) {
  const Tag = (as ?? 'div') as React.ElementType;
  return (
    <Tag data-reveal className={cn(className)} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * A heading whose lines rise into place, split by SplitText. Use for section
 * headings and pull quotes — not for body copy, where per-line animation reads
 * as a gimmick and hurts readability.
 */
export function SplitHeading<T extends React.ElementType = 'h2'>({
  as,
  className,
  children,
  ...rest
}: { as?: T; className?: string; children: React.ReactNode } & Omit<
  React.ComponentPropsWithoutRef<T>,
  'as' | 'className' | 'children'
>) {
  const Tag = (as ?? 'h2') as React.ElementType;
  return (
    <Tag data-split className={cn('text-pretty', className)} {...rest}>
      {children}
    </Tag>
  );
}

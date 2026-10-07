import Link from 'next/link';

import { cn } from '@/lib/utils';

/**
 * The dark closing band that ends the listings and detail pages: one line,
 * one pill. Rounded top corners lift it off the blush page above.
 */
export function ClosingCta({
  line,
  href,
  cta,
  variant = 'listings',
}: {
  line: string;
  href: string;
  cta: string;
  /** The two references size this band slightly differently. */
  variant?: 'listings' | 'detail';
}) {
  const detail = variant === 'detail';
  return (
    <section className="theme-dark relative rounded-t-[clamp(20px,2.4vw,34px)] bg-ink text-ink-foreground">
      <div
        className={cn(
          'mx-auto flex max-w-site flex-wrap items-end justify-between gap-8 px-gutter',
          detail ? 'py-[clamp(56px,7vw,110px)]' : 'py-[clamp(60px,8vw,120px)]',
        )}
      >
        <h2
          data-split-lines
          className={cn(
            'm-0 font-normal leading-[1.03] tracking-[-0.045em]',
            detail ? 'max-w-[22ch] text-[clamp(26px,4vw,52px)]' : 'max-w-[20ch] text-[clamp(26px,4vw,54px)]',
          )}
        >
          {line}
        </h2>
        <Link
          href={href}
          className="inline-flex h-[52px] items-center whitespace-nowrap rounded-full bg-ink-foreground px-[30px] text-sm text-ink transition-opacity duration-300 hover:text-ink hover:opacity-[.86]"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}

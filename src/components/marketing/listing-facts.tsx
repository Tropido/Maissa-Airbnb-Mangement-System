import { cn, formatTND } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

/** "320 TND / night | Sleeps 6 | 4.9 · 128 reviews" — the facts row shared by the showcases. */
export function ListingFacts({ listing, size = 'md', className }: { listing: Listing; size?: 'md' | 'lg'; className?: string }) {
  return (
    <p className={cn('m-0 flex flex-wrap items-center gap-[18px] text-[12.5px] text-muted-soft', className)}>
      <span className={cn('text-ink', size === 'lg' ? 'text-base' : 'text-[15px]')}>
        {formatTND(listing.price_per_night, { suffix: false })}{' '}
        <span className="text-xs text-muted-soft">TND / night</span>
      </span>
      <span aria-hidden className="block h-4 w-px bg-ink/[.18]" />
      <span>Sleeps {listing.max_guests}</span>
      <span aria-hidden className="block h-4 w-px bg-ink/[.18]" />
      <span>
        {Number(listing.rating.toFixed(2))} &middot; {listing.review_count} reviews
      </span>
    </p>
  );
}

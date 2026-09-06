import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn, formatTND } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

/**
 * Marketing listing card.
 *
 * Note the badge palette: the marketing site is restricted to the five
 * marketing colours, so a featured home is tagged in `accent` and a pending one
 * in outline — the `featured` purple and `warning` yellow stay in the dashboard
 * where they carry operational meaning.
 */
export function ListingCard({
  listing,
  size = 'md',
  priority = false,
  className,
}: {
  listing: Listing;
  size?: 'md' | 'lg';
  priority?: boolean;
  className?: string;
}) {
  const large = size === 'lg';
  const bookable = listing.status !== 'pending';

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden bg-ink text-ink-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        className,
      )}
    >
      <div className={cn('relative w-full', large ? 'min-h-[22rem] flex-1' : 'min-h-[15rem] flex-1')}>
        <Image
          src={listing.hero_photo_url}
          alt={`${listing.title}, ${listing.location}`}
          fill
          priority={priority}
          sizes={large ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 640px) 100vw, 25vw'}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent"
        />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {listing.status === 'featured' ? <Badge variant="accent">Featured</Badge> : null}
          {!bookable ? (
            <Badge variant="ink" className="border-bg text-bg">
              Coming soon
            </Badge>
          ) : null}
        </div>

        <div
          aria-hidden
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-bg/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-4" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <h3
            className={cn(
              'font-display font-normal leading-tight',
              large ? 'text-3xl sm:text-4xl' : 'text-xl',
            )}
          >
            {listing.title}
          </h3>
          <p className="shrink-0 text-right text-sm leading-tight">
            {formatTND(listing.price_per_night, { suffix: false })}
            <span className="block text-[10px] uppercase tracking-[0.12em] text-muted">
              TND / night
            </span>
          </p>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          {listing.location} · <Users className="size-3.5 shrink-0" aria-hidden /> Sleeps{' '}
          {listing.max_guests}
        </p>

        {large ? (
          <p className="max-w-lg text-sm leading-relaxed text-muted">{listing.summary}</p>
        ) : null}

        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
          {listing.style_tag}
        </p>
      </div>
    </Link>
  );
}

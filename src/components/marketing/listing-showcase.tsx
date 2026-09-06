import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { ListingCard } from '@/components/marketing/listing-card';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { Button } from '@/components/ui/button';
import { wipeUp } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

/**
 * Bento showcase. The flagship home takes a double-height block on the left,
 * the second a full-width band, and the remaining two sit as a pair — so the
 * grid never reads as four equal tiles, and it degrades to one column cleanly.
 */
const SPANS = [
  'lg:col-span-2 lg:row-span-2',
  'lg:col-span-2',
  'lg:col-span-1',
  'lg:col-span-1',
] as const;

export function ListingShowcase({ listings }: { listings: Listing[] }) {
  return (
    <section id="homes" aria-labelledby="homes-heading" className="shell py-section">
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-fg">The portfolio</p>
          <h2 id="homes-heading" className="mt-4 font-display text-display-md font-normal">
            Four homes.
            <br />
            One standard.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-fg">
          Each house is renovated, furnished and photographed by the same team. What is in the
          listing is what is in the house.
        </p>
      </Reveal>

      <RevealGroup
        step={0.1}
        className="mt-12 grid auto-rows-[minmax(18rem,auto)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {listings.map((listing, i) => (
          <RevealItem
            key={listing.id}
            variants={wipeUp}
            className={cn('min-w-0', SPANS[i % SPANS.length])}
          >
            <ListingCard listing={listing} size={i === 0 ? 'lg' : 'md'} priority={i === 0} />
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-10 flex justify-center">
        <Button asChild variant="link" size="lg">
          <Link href="/listings">
            See all homes <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}

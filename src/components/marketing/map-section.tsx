import Link from 'next/link';

import { PropertyMap } from '@/components/marketing/property-map';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { slideInLeft } from '@/lib/motion';
import { formatTND } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

export function MapSection({ listings }: { listings: Listing[] }) {
  return (
    <section id="map" aria-labelledby="map-heading" className="bg-bg-raised">
      <div className="shell py-section">
        <Reveal variants={slideInLeft} className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-fg">Where they are</p>
          <h2 id="map-heading" className="mt-4 font-display text-display-md font-normal">
            Coast, hill
            <br />
            and forest.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-fg">
            The portfolio spans four hundred kilometres of Tunisia, from the pine slopes above
            Tabarka to the whitewashed lanes of Djerba. Pick the landscape first, then the house.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <PropertyMap listings={listings} className="h-[26rem] w-full lg:h-[34rem]" />
          </Reveal>

          <RevealGroup as="ul" className="divide-y divide-muted/30 border border-muted/30">
            {listings.map((listing) => (
              <RevealItem as="li" key={listing.id}>
                <Link
                  href={`/listings/${listing.slug}`}
                  className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-display text-lg font-normal leading-none">
                      {listing.title}
                    </span>
                    <span className="mt-1.5 block truncate text-xs text-muted-fg">
                      {listing.location}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] text-muted-fg">
                      {listing.lat.toFixed(4)}, {listing.lng.toFixed(4)}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-sm">
                    {formatTND(listing.price_per_night, { suffix: false })}
                    <span className="block text-[10px] uppercase tracking-[0.1em] text-muted-fg">
                      TND / night
                    </span>
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

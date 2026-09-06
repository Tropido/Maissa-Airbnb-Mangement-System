import type { Metadata } from 'next';

import { ClosingCta } from '@/components/marketing/closing-cta';
import { ListingCard } from '@/components/marketing/listing-card';
import { MapSection } from '@/components/marketing/map-section';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { wipeUp } from '@/lib/motion';
import { getPublicListings } from '@/lib/data/queries';

export const metadata: Metadata = {
  title: 'The homes',
  description:
    'Four design-forward homes across Djerba, Hammamet, Sidi Bou Said and Tabarka, each renovated and photographed by the same team.',
};

export default async function ListingsPage() {
  const listings = await getPublicListings();

  return (
    <>
      <section className="shell pb-16 pt-16 sm:pt-24">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-fg">
            The portfolio
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-display-lg font-normal">
            Every home, end to end.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-fg sm:text-lg">
            Coast, hill and forest. Each one renovated room by room, furnished to be lived in rather
            than photographed, and then photographed honestly anyway.
          </p>
        </Reveal>

        <RevealGroup
          as="ul"
          step={0.09}
          className="mt-14 grid auto-rows-[minmax(20rem,auto)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {listings.map((listing, i) => (
            <RevealItem
              as="li"
              key={listing.id}
              variants={wipeUp}
              className={i === 0 ? 'min-w-0 sm:col-span-2' : 'min-w-0'}
            >
              <ListingCard listing={listing} size={i === 0 ? 'lg' : 'md'} priority={i < 2} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <MapSection listings={listings} />

      <ClosingCta
        listing={listings[0]}
        line="Four homes. One team. See which one fits."
        href="/#contact"
        cta="Ask a question"
      />
    </>
  );
}

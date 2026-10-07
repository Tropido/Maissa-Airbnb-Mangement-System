'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { ListingFacts } from '@/components/marketing/listing-facts';
import { ListingImage, StudyNote } from '@/components/marketing/listing-image';
import { Flip, MOTION_QUERIES, ScrollTrigger } from '@/components/motion/gsap';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

/**
 * "Both homes" — the showcase with the reference's layout toggle. Switching
 * between side-by-side and stacked is a real layout change, animated with
 * Flip (0.8s, power3.inOut) from the measured before-state. Reduced motion
 * gets the same change without the animation.
 */
export function HomesShowcase({ listings }: { listings: Listing[] }) {
  const [stacked, setStacked] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const toggle = () => {
    const items = container.current?.querySelectorAll('[data-flip-item]');
    if (items?.length && !window.matchMedia(MOTION_QUERIES.reduce).matches) {
      flipState.current = Flip.getState(items);
    }
    setStacked((s) => !s);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    const tween = Flip.from(state, {
      duration: 0.8,
      ease: 'power3.inOut',
      absolute: true,
      stagger: 0.06,
      onComplete: () => ScrollTrigger.refresh(),
    });
    return () => {
      tween.progress(1).kill();
    };
  }, [stacked]);

  const heading = listings.length === 2 ? 'Both homes' : listings.length === 1 ? 'The home' : 'The homes';

  return (
    <section
      id="homes"
      aria-labelledby="homes-heading"
      className="mx-auto max-w-site px-gutter pb-[clamp(70px,9vw,130px)] pt-[clamp(30px,4vw,60px)]"
    >
      <div
        data-reveal
        className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/[.16] pb-[26px]"
      >
        <h2
          id="homes-heading"
          className="m-0 text-[clamp(26px,3.4vw,44px)] font-normal leading-[1.04] tracking-[-0.04em] text-ink"
        >
          {heading}
        </h2>
        {listings.length > 1 ? (
          <button
            type="button"
            onClick={toggle}
            aria-pressed={stacked}
            className="h-[42px] whitespace-nowrap rounded-full border border-ink/20 bg-transparent px-5 text-[12.5px] tracking-[-0.01em] text-ink transition-colors duration-300 hover:bg-ink/5"
          >
            {stacked ? 'Side by side' : 'Stack them'}
          </button>
        ) : null}
      </div>

      {listings.length === 0 ? (
        <p className="mt-10 text-sm text-muted-fg">No homes are open for enquiries right now.</p>
      ) : (
        <div
          ref={container}
          className={cn(
            'mt-[clamp(36px,4.6vw,64px)] grid gap-[clamp(30px,4vw,64px)]',
            stacked ? 'grid-cols-1' : 'grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))]',
          )}
        >
          {listings.map((listing, i) => {
            const featured = listing.status === 'featured';
            return (
              <article
                key={listing.id}
                data-flip-item
                className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] items-center gap-[clamp(20px,2.6vw,40px)]"
              >
                <Link
                  href={`/listings/${listing.slug}`}
                  tabIndex={-1}
                  aria-hidden
                  className="group relative block aspect-[4/3] overflow-hidden rounded-[20px] bg-bg-deep"
                >
                  <ListingImage
                    src={listing.hero_photo_url}
                    alt=""
                    sizes="(max-width: 900px) 100vw, 50vw"
                    className="transition-transform duration-700 ease-quiet group-hover:scale-[1.03]"
                  />
                  <StudyNote src={listing.hero_photo_url} className="bottom-3 left-3" />
                </Link>
                <div>
                  <p
                    className={cn(
                      'm-0 text-[11px] uppercase tracking-[0.2em]',
                      featured ? 'text-primary' : 'text-muted-soft',
                    )}
                  >
                    {featured ? `Featured · ${listing.location}` : listing.location}
                  </p>
                  <h3 className="mb-0 mt-4 text-[clamp(24px,2.8vw,38px)] font-normal leading-[1.06] tracking-[-0.035em] text-ink">
                    {listing.title}
                  </h3>
                  <p className="mb-0 mt-4 max-w-[44ch] text-pretty text-sm leading-[1.7] text-muted-fg">
                    {listing.summary}
                  </p>
                  <ListingFacts listing={listing} className="mt-[22px]" />
                  <Link
                    href={`/listings/${listing.slug}`}
                    className={cn(
                      buttonVariants({ variant: i === 0 ? 'primary' : 'outline', size: 'md' }),
                      'mt-[26px] text-[13px]',
                    )}
                  >
                    See the home<span className="sr-only">: {listing.title}</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

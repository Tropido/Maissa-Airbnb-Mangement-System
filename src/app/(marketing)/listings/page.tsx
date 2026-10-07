import type { Metadata } from 'next';
import Link from 'next/link';

import { ClosingCta } from '@/components/marketing/closing-cta';
import { ListingFacts } from '@/components/marketing/listing-facts';
import { ListingImage, StudyNote } from '@/components/marketing/listing-image';
import { SiteHeader } from '@/components/marketing/site-header';
import { IntroCurtain } from '@/components/motion/intro-curtain';
import { PageMotion } from '@/components/motion/page-motion';
import { buttonVariants } from '@/components/ui/button';
import { getPublicListings } from '@/lib/data/queries';
import { cn, numberWord } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

export const metadata: Metadata = {
  title: 'The homes',
  description:
    'A courtyard villa on Djerba and a terrace loft at Ezzahra, each renovated room by room and hosted by Maissa.',
};

function Media({ listing, priority }: { listing: Listing; priority: boolean }) {
  return (
    <Link
      href={`/listings/${listing.slug}`}
      tabIndex={-1}
      aria-hidden
      className="group relative block aspect-[4/3] min-w-0 overflow-hidden rounded-3xl bg-bg-deep"
    >
      <ListingImage
        src={listing.hero_photo_url}
        alt=""
        priority={priority}
        sizes="(max-width: 700px) 100vw, 50vw"
        className="transition-transform duration-700 ease-quiet group-hover:scale-[1.03]"
      />
      {listing.status === 'featured' ? (
        <span className="absolute left-4 top-4 z-[1] rounded-full bg-bg px-3.5 py-[7px] text-[10.5px] uppercase tracking-[0.16em] text-ink">
          Featured
        </span>
      ) : null}
      <StudyNote src={listing.hero_photo_url} className="bottom-4 left-4" />
    </Link>
  );
}

/**
 * Listings — `Maissa Redesign/Maissa Listings.dc.html`: the "Everything we
 * host" introduction, then one alternating image/text row per home (each
 * linking to its own slug), then the dark closing band.
 *
 * Native scroll here: the header is sticky, which ScrollSmoother's
 * transformed wrapper would break.
 */
export default async function ListingsPage() {
  const listings = await getPublicListings();

  return (
    <>
      <IntroCurtain mark="The homes" note="Djerba · Ezzahra" />
      <PageMotion className="relative min-h-screen overflow-x-clip bg-bg">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[12%] -top-[18%] size-[60vw] rounded-full bg-[radial-gradient(circle,rgb(201_143_160/.28),transparent_62%)] motion-safe:animate-drift1"
        />
        <SiteHeader variant="listings" />

        <main id="main">
          <section className="relative mx-auto max-w-site px-gutter pb-[clamp(36px,5vw,64px)] pt-[clamp(56px,8vw,120px)]">
            <p data-intro className="m-0 text-[11px] uppercase tracking-[0.24em] text-muted-soft">
              {numberWord(listings.length)} {listings.length === 1 ? 'home' : 'homes'} · Tunisia
            </p>
            <h1
              data-intro
              className="mb-0 mt-[26px] max-w-[22ch] text-balance text-[clamp(34px,6vw,86px)] font-normal leading-[.98] tracking-[-0.05em] text-ink"
            >
              Everything we host, in one place.
            </h1>
            <p
              data-intro
              className="mb-0 mt-[26px] max-w-[52ch] text-pretty text-[15px] leading-[1.7] text-muted-fg"
            >
              One courtyard villa on Djerba, one terrace loft on the hillside at Ezzahra. Both renovated
              room by room, photographed at the hour they actually look like that.
            </p>
          </section>

          <section
            id="homes"
            aria-label="The homes"
            className="relative mx-auto max-w-site px-gutter pb-[clamp(60px,8vw,120px)]"
          >
            {listings.length === 0 ? (
              <p className="m-0 text-sm text-muted-fg">No homes are open for enquiries right now.</p>
            ) : null}
            {listings.map((listing, i) => {
              const featured = listing.status === 'featured';
              const mediaFirst = i % 2 === 0;
              const text = (
                <div className="min-w-0">
                  <p
                    className={cn(
                      'm-0 text-[11px] uppercase tracking-[0.2em]',
                      featured ? 'text-primary' : 'text-muted-soft',
                    )}
                  >
                    {listing.location}
                  </p>
                  <h2 className="mb-0 mt-4 text-[clamp(26px,3.4vw,46px)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">
                    {listing.title}
                  </h2>
                  <p className="mb-0 mt-[18px] max-w-[46ch] text-pretty text-[14.5px] leading-[1.7] text-muted-fg">
                    {listing.summary}
                  </p>
                  <ListingFacts listing={listing} size="lg" className="mt-6" />
                  <Link
                    href={`/listings/${listing.slug}`}
                    className={cn(buttonVariants({ variant: i === 0 ? 'primary' : 'outline' }), 'mt-7 h-12 px-[26px]')}
                  >
                    See the home<span className="sr-only">: {listing.title}</span>
                  </Link>
                </div>
              );
              return (
                <article
                  key={listing.id}
                  data-reveal
                  className={cn(
                    'grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-center gap-[clamp(22px,3vw,52px)]',
                    i > 0 && 'pt-[clamp(38px,5vw,74px)]',
                    i < listings.length - 1 && 'border-b border-ink/[.12] pb-[clamp(38px,5vw,74px)]',
                  )}
                >
                  {mediaFirst ? (
                    <>
                      <Media listing={listing} priority={i === 0} />
                      {text}
                    </>
                  ) : (
                    <>
                      {text}
                      <Media listing={listing} priority={false} />
                    </>
                  )}
                </article>
              );
            })}
          </section>

          <ClosingCta
            line="Not sure which one? Tell me when, and I will tell you where."
            href="/#contact"
            cta="Get in touch"
          />
        </main>
      </PageMotion>
    </>
  );
}

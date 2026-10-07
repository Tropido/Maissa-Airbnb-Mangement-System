import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ClosingCta } from '@/components/marketing/closing-cta';
import { ListingGallery } from '@/components/marketing/listing-gallery';
import { ListingImage } from '@/components/marketing/listing-image';
import { PropertyMap } from '@/components/marketing/property-map';
import { SiteHeader } from '@/components/marketing/site-header';
import { SpinViewer } from '@/components/marketing/spin-viewer';
import { VideoTour } from '@/components/marketing/video-tour';
import { IntroCurtain } from '@/components/motion/intro-curtain';
import { PageMotion } from '@/components/motion/page-motion';
import { getHost, getListing, getPublicListings } from '@/lib/data/queries';
import { LISTINGS } from '@/lib/data/seed';
import { formatTND, placeName } from '@/lib/utils';

export async function generateStaticParams() {
  return LISTINGS.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListing(slug);
  if (!listing) return { title: 'Home not found' };

  return {
    title: listing.title,
    description: listing.summary,
    openGraph: {
      title: `${listing.title} — ${listing.location}`,
      description: listing.summary,
      images: [{ url: listing.hero_photo_url }],
    },
  };
}

const label = 'm-0 text-[11px] font-normal uppercase tracking-[0.22em] text-muted-soft';

/**
 * Listing detail — `Maissa Redesign/Maissa Listing Detail.dc.html`, as one
 * data-driven template for every home: title and price, the gallery with its
 * lightbox, the house, facts, amenities, the photo spinner and the video slot,
 * a sticky price / host / map column, the other homes, and the closing band.
 *
 * Enquiry links carry `?home=<slug>` so the home's form opens with this house
 * preselected.
 */
export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [listing, host, allListings] = await Promise.all([getListing(slug), getHost(), getPublicListings()]);

  if (!listing) notFound();

  const bookable = listing.status !== 'pending';
  const enquireHref = `/?home=${listing.slug}#contact`;
  const others = allListings.filter((l) => l.id !== listing.id);
  const facts = [
    { label: 'Sleeps', value: listing.max_guests },
    { label: 'Bedrooms', value: listing.bedrooms },
    { label: 'Beds', value: listing.beds },
    { label: 'Bathrooms', value: listing.bathrooms },
  ];
  const [lead, ...body] = listing.description;

  return (
    <>
      <IntroCurtain mark={listing.title} note={`${placeName(listing.title)} · ${formatTND(listing.price_per_night)}`} />
      <PageMotion className="relative min-h-screen overflow-x-clip bg-bg">
        <SiteHeader variant="detail" backLabel={allListings.length === 2 ? 'Both homes' : 'All homes'} />

        <main id="main">
          <section className="mx-auto max-w-site px-gutter pt-[clamp(28px,4vw,56px)]">
            <p data-intro className="m-0 text-[11px] uppercase tracking-[0.22em] text-muted-soft">
              {listing.status === 'featured' ? 'Featured · ' : ''}
              {!bookable ? 'Coming soon · ' : ''}
              {listing.location}
            </p>
            <div data-intro className="mt-5 flex flex-wrap items-end justify-between gap-7">
              <h1 className="m-0 max-w-[20ch] text-[clamp(32px,5.4vw,74px)] font-normal leading-[.98] tracking-[-0.05em] text-ink">
                {listing.title}
              </h1>
              <p className="m-0 text-right">
                <span className="text-[clamp(24px,2.6vw,34px)] tracking-[-0.035em] text-ink">
                  {formatTND(listing.price_per_night)}
                </span>
                <span className="mt-[5px] block text-[11px] uppercase tracking-[0.16em] text-muted-soft">
                  per night &middot; {Number(listing.rating.toFixed(2))} &middot; {listing.review_count} reviews
                </span>
              </p>
            </div>

            <ListingGallery images={[listing.hero_photo_url, ...listing.gallery_urls]} title={listing.title} />
          </section>

          <div className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(30px,4vw,64px)] px-gutter pb-[clamp(60px,8vw,120px)] pt-[clamp(48px,6vw,90px)]">
            <div className="min-w-0">
              <section aria-labelledby="house-heading">
                <h2 id="house-heading" className={label}>
                  The house
                </h2>
                {lead ? (
                  <p data-split-lines className="mb-0 mt-[22px] text-pretty text-[15.5px] leading-[1.8] text-ink-soft">
                    {lead}
                  </p>
                ) : null}
                {body.map((para) => (
                  <p key={para.slice(0, 40)} data-reveal className="mb-0 mt-5 text-pretty text-[15.5px] leading-[1.8] text-ink-soft">
                    {para}
                  </p>
                ))}
              </section>

              <dl
                data-reveal
                className="mb-0 mt-[clamp(38px,5vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-px overflow-hidden rounded-[18px] bg-ink/[.12]"
              >
                {facts.map((fact) => (
                  <div key={fact.label} className="bg-bg-raised p-[22px]">
                    <dt className="text-[10.5px] uppercase tracking-[0.18em] text-muted-soft">{fact.label}</dt>
                    <dd className="mb-0 ml-0 mt-2.5 text-[26px] tracking-[-0.035em] text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <section aria-labelledby="amenities-heading" className="mt-[clamp(38px,5vw,64px)]">
                <h2 id="amenities-heading" className={label}>
                  What is here
                </h2>
                <ul className="m-0 mt-[22px] grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-7 gap-y-3.5 p-0">
                  {listing.amenities.map((amenity) => (
                    <li key={amenity.label} data-reveal className="flex items-center gap-3 text-sm text-ink-soft">
                      <span aria-hidden className="block size-[5px] shrink-0 rounded-full bg-primary" />
                      {amenity.label}
                    </li>
                  ))}
                </ul>
              </section>

              <section id="walk-around" aria-label="Walk around it" className="mt-[clamp(38px,5vw,64px)] scroll-mt-24">
                <SpinViewer frames={listing.spin_photo_urls} alt={`${listing.title} in ${listing.location}`} />
              </section>

              <section aria-labelledby="video-heading" className="mt-[clamp(38px,5vw,64px)]">
                <h2 id="video-heading" className={label}>
                  Video tour
                </h2>
                <VideoTour listing={listing} />
              </section>
            </div>

            <aside aria-label="Price and host" className="flex min-w-0 flex-col gap-4 min-[700px]:sticky min-[700px]:top-[88px]">
              <div className="rounded-3xl bg-bg-raised p-[clamp(22px,2.6vw,32px)] shadow-form">
                <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-muted-soft">From</p>
                <p className="mb-0 mt-3 text-[34px] tracking-[-0.04em] text-ink">
                  {formatTND(listing.price_per_night, { suffix: false })}{' '}
                  <span className="text-[13px] tracking-normal text-muted-soft">TND / night</span>
                </p>
                <dl className="mb-0 mt-6 flex flex-col gap-3 text-[13.5px]">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-fg">Three nights</dt>
                    <dd className="m-0">{formatTND(listing.price_per_night * 3)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-fg">A week</dt>
                    <dd className="m-0">{formatTND(listing.price_per_night * 7)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-t border-ink/[.12] pt-3">
                    <dt className="text-muted-fg">Maximum guests</dt>
                    <dd className="m-0">{listing.max_guests}</dd>
                  </div>
                </dl>
                <Link
                  href={enquireHref}
                  className="mt-6 flex h-[52px] items-center justify-center rounded-full bg-ink text-sm text-ink-foreground transition-colors duration-300 hover:bg-ink-raised hover:text-ink-foreground"
                >
                  {bookable ? 'Check availability' : 'Join the waitlist'}
                </Link>
                <p className="mb-0 mt-3.5 text-[11.5px] leading-[1.6] text-muted-soft">
                  {bookable
                    ? 'Bookings are completed on Airbnb. Enquiries answered within an hour.'
                    : 'This home is pending final photography. Ask to be told when it opens.'}
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-3xl border border-ink/10 bg-bg-raised p-[clamp(20px,2.4vw,28px)]">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-bg-deep">
                  {host.avatar_url ? (
                    <Image src={host.avatar_url} alt="" fill sizes="56px" className="object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="m-0 text-[15px] tracking-[-0.02em] text-ink">Hosted by {host.display_name}</p>
                  <p className="mb-0 mt-1.5 text-[11.5px] leading-normal text-muted-soft">
                    Hosting since {host.hosting_since} &middot; replies {host.response_time}
                  </p>
                </div>
              </div>

              <div className="relative rounded-3xl border border-ink/10 bg-bg-sunken p-[18px]">
                <PropertyMap listings={[listing]} activeId={listing.id} />
              </div>
            </aside>
          </div>

          {others.length ? (
            <section aria-label="The other homes" className="mx-auto max-w-site px-gutter pb-[clamp(60px,8vw,110px)]">
              {others.map((other) => (
                <Link
                  key={other.id}
                  href={`/listings/${other.slug}`}
                  data-reveal
                  className="group grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] items-center gap-[clamp(20px,3vw,44px)] border-t border-ink/[.14] pt-[clamp(30px,4vw,50px)] text-ink hover:text-ink"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-bg-deep">
                    <ListingImage
                      src={other.hero_photo_url}
                      alt=""
                      sizes="(max-width: 700px) 100vw, 50vw"
                      className="transition-transform duration-700 ease-quiet group-hover:scale-[1.03]"
                    />
                  </div>
                  <div>
                    <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-muted-soft">
                      {others.length === 1 ? 'The other home' : 'Another home'} &middot; {placeName(other.title)}
                    </p>
                    <h2 className="mb-0 mt-3.5 text-[clamp(22px,2.8vw,36px)] font-normal leading-[1.06] tracking-[-0.035em]">
                      {other.title}
                    </h2>
                    <p className="mb-0 mt-3.5 max-w-[44ch] text-pretty text-sm leading-[1.7] text-muted-fg">
                      {other.summary} {formatTND(other.price_per_night)} a night, sleeps {other.max_guests}.
                    </p>
                  </div>
                </Link>
              ))}
            </section>
          ) : null}

          <ClosingCta
            line="Come and see it before you decide anything from a photo."
            href={enquireHref}
            cta="Enquire about these dates"
            variant="detail"
          />
        </main>
      </PageMotion>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BedDouble, Bath, MapPin, Star, Users } from 'lucide-react';

import { AmenitiesGrid } from '@/components/marketing/amenities-grid';
import { ContactSection } from '@/components/marketing/contact-section';
import { HostProfile } from '@/components/marketing/host-profile';
import { ListingGallery } from '@/components/marketing/listing-gallery';
import { PropertyMap } from '@/components/marketing/property-map';
import { SpinViewer } from '@/components/marketing/spin-viewer';
import { VideoTour } from '@/components/marketing/video-tour';
import { Reveal } from '@/components/motion/reveal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getHost, getListing, getPublicListings } from '@/lib/data/queries';
import { LISTINGS } from '@/lib/data/seed';
import { formatTND } from '@/lib/utils';

export async function generateStaticParams() {
  return LISTINGS.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [listing, host, allListings] = await Promise.all([
    getListing(slug),
    getHost(),
    getPublicListings(),
  ]);

  if (!listing) notFound();

  const bookable = listing.status !== 'pending';
  const facts = [
    { icon: Users, label: 'Sleeps', value: String(listing.max_guests) },
    { icon: BedDouble, label: 'Bedrooms', value: String(listing.bedrooms) },
    { icon: BedDouble, label: 'Beds', value: String(listing.beds) },
    { icon: Bath, label: 'Bathrooms', value: String(listing.bathrooms) },
  ];

  return (
    <>
      <div className="shell pt-8">
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-fg transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          All homes
        </Link>
      </div>

      <section className="shell pt-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {(listing.status === 'featured' || !bookable) ? (
              <div className="flex flex-wrap items-center gap-2">
                {listing.status === 'featured' ? <Badge variant="accent">Featured</Badge> : null}
                {!bookable ? <Badge variant="outline">Coming soon</Badge> : null}
              </div>
            ) : null}

            <h1 className="mt-5 font-display text-display-lg font-normal">{listing.title}</h1>

            <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-fg">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden />
                {listing.location} · {listing.style_tag}
              </span>
              <span className="inline-flex items-center gap-1.5 text-ink">
                <Star className="size-4 fill-ink" aria-hidden />
                {listing.rating.toFixed(2)}
                <span className="text-muted-fg">({listing.review_count} reviews)</span>
              </span>
            </p>
          </div>

          <div className="flex shrink-0 items-end gap-5">
            <p className="font-display text-3xl font-normal leading-none">
              {formatTND(listing.price_per_night, { suffix: false })}
              <span className="ml-2 align-baseline text-xs uppercase tracking-[0.14em] text-muted-fg">
                TND / night
              </span>
            </p>
          </div>
        </div>

        <div className="mt-10">
          <ListingGallery images={[listing.hero_photo_url, ...listing.gallery_urls]} title={listing.title} />
        </div>
      </section>

      <section className="shell py-section">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <h2 className="font-display text-display-sm font-normal">The house</h2>
              <div className="mt-6 space-y-5">
                {listing.description.map((para) => (
                  <p key={para.slice(0, 32)} className="text-base leading-relaxed text-ink">
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-12">
              <ul className="grid grid-cols-2 divide-x divide-y divide-muted/30 border border-muted/30 sm:grid-cols-4">
                {facts.map((fact) => (
                  <li key={fact.label} className="p-4">
                    <fact.icon className="size-4 text-muted-fg" aria-hidden />
                    <p className="mt-3 font-display text-2xl font-normal leading-none">
                      {fact.value}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted-fg">
                      {fact.label}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-display text-display-sm font-normal">What is in it</h2>
              <div className="mt-6">
                <AmenitiesGrid amenities={listing.amenities} />
              </div>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-display text-display-sm font-normal">Walk around it</h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-fg">
                {listing.spin_photo_urls.length} frames shot in a circle around the property. Drag,
                scroll, or use the arrow keys.
              </p>
              <SpinViewer
                frames={listing.spin_photo_urls}
                alt={`${listing.title} in ${listing.location}`}
                className="mt-6"
              />
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-display text-display-sm font-normal">Home tour</h2>
              <div className="mt-6">
                <VideoTour listing={listing} />
              </div>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-display text-display-sm font-normal">Where it is</h2>
              <PropertyMap
                listings={[listing]}
                activeId={listing.id}
                className="mt-6 h-[24rem] w-full"
              />
            </Reveal>
          </div>

          {/* Pricing / enquiry block — sticky on desktop, inline on mobile. */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-bg-raised p-6">
              <p className="font-display text-3xl font-normal leading-none">
                {formatTND(listing.price_per_night, { suffix: false })}
                <span className="ml-2 text-xs uppercase tracking-[0.14em] text-muted-fg">
                  TND / night
                </span>
              </p>

              <dl className="mt-6 space-y-3 border-t border-muted/30 pt-6 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-fg">Three nights</dt>
                  <dd>{formatTND(listing.price_per_night * 3)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-fg">A week</dt>
                  <dd>{formatTND(listing.price_per_night * 7)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-fg">Maximum guests</dt>
                  <dd>{listing.max_guests}</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col gap-3">
                {/* A pending home still takes enquiries — it just joins a waitlist
                    rather than a booking, so the button stays live and changes label. */}
                <Button asChild size="lg" variant={bookable ? 'primary' : 'outline'}>
                  <Link href="#contact">{bookable ? 'Check availability' : 'Join the waitlist'}</Link>
                </Button>
                <p className="text-xs leading-relaxed text-muted-fg">
                  {bookable
                    ? 'Enquiries are answered within the hour. Booking is completed on Airbnb.'
                    : 'This home is pending final photography. Ask to be told when it opens.'}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-bg-raised p-6">
              <HostProfile host={host} listings={allListings} variant="compact" />
            </div>
          </aside>
        </div>
      </section>

      <ContactSection listings={allListings} defaultListingSlug={listing.slug} />
    </>
  );
}

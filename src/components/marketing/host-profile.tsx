import Image from 'next/image';
import Link from 'next/link';
import { Clock, Home, Star, TrendingUp } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { slideInLeft } from '@/lib/motion';
import { cn, pluralise } from '@/lib/utils';
import type { Host, Listing } from '@/lib/data/types';

interface HostProfileProps {
  host: Host;
  listings: Listing[];
  /** `full` on the standalone section, `compact` as the About-the-host block. */
  variant?: 'full' | 'compact';
  className?: string;
}

export function HostProfile({ host, listings, variant = 'full', className }: HostProfileProps) {
  const stats = [
    { icon: Home, value: String(listings.length), label: pluralise(listings.length, 'listing') },
    { icon: Star, value: host.average_rating.toFixed(1), label: 'average rating' },
    { icon: Clock, value: 'Fast', label: `responds ${host.response_time}` },
    { icon: TrendingUp, value: String(host.hosting_since), label: 'hosting since' },
  ];

  const compact = variant === 'compact';

  return (
    <section
      id={compact ? undefined : 'host'}
      aria-labelledby="host-heading"
      className={cn(compact ? '' : 'shell py-section', className)}
    >
      <div
        className={cn(
          'grid gap-10',
          compact ? 'gap-6' : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]',
        )}
      >
        <Reveal variants={slideInLeft} className={cn(compact && 'flex gap-6')}>
          <div
            className={cn(
              'relative shrink-0 overflow-hidden bg-bg-sunken',
              compact ? 'size-24' : 'aspect-square w-full max-w-sm',
            )}
          >
            {host.avatar_url ? (
              <Image
                src={host.avatar_url}
                alt={host.display_name}
                fill
                sizes={compact ? '96px' : '(max-width: 1024px) 90vw, 384px'}
                className="object-cover"
              />
            ) : null}
          </div>

          {compact ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-fg">
                About the host
              </p>
              <p id="host-heading" className="mt-1 font-display text-2xl font-normal leading-none">
                {host.display_name}
              </p>
              <p className="mt-2 text-sm text-muted-fg">{host.tagline}</p>
            </div>
          ) : null}
        </Reveal>

        <div>
          {compact ? null : (
            <>
              <Reveal>
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted-fg">
                  Meet your host
                </p>
                <h2 id="host-heading" className="mt-4 font-display text-display-md font-normal text-ink">
                  {host.display_name}
                </h2>
                <p className="mt-3 text-base text-muted-fg">{host.tagline}</p>
              </Reveal>
            </>
          )}

          <Reveal delay={0.08}>
            <p
              className={cn(
                'leading-relaxed text-ink',
                compact ? 'mt-6 text-sm' : 'mt-8 max-w-2xl text-lg',
              )}
            >
              {host.bio}
            </p>
          </Reveal>

          <RevealGroup
            as="ul"
            className={cn(
              'grid divide-x divide-y divide-muted/30 border border-muted/30',
              // Viewport breakpoints are wrong for the compact block: it lives in
              // a narrow sidebar regardless of how wide the window is.
              compact ? 'mt-6 grid-cols-2' : 'mt-10 grid-cols-2 sm:grid-cols-4',
            )}
          >
            {stats.map((stat) => (
              <RevealItem as="li" key={stat.label} className="p-4">
                <stat.icon className="size-4 text-muted-fg" aria-hidden />
                <p className="mt-3 font-display text-2xl font-normal leading-none">{stat.value}</p>
                <p className="mt-1 text-xs leading-tight text-muted-fg">{stat.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          {compact ? null : (
            <RevealGroup as="ul" className="mt-10 grid gap-4 sm:grid-cols-2">
              {listings.map((listing) => (
                <RevealItem as="li" key={listing.id}>
                  <Link
                    href={`/listings/${listing.slug}`}
                    className="group flex items-center gap-4 p-3 transition-colors hover:bg-bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden">
                      <Image
                        src={listing.hero_photo_url}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate">{listing.title}</p>
                      <p className="truncate text-xs text-muted-fg">
                        {listing.location} · {listing.style_tag}
                      </p>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </div>
    </section>
  );
}

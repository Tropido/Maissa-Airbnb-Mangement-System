import Link from 'next/link';

import type { Listing } from '@/lib/data/types';

export function SiteFooter({ listings }: { listings: Listing[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-muted/40 bg-ink text-ink-foreground">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <p className="font-display text-3xl font-normal leading-none">Maissa</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-bg/60">
            Four design-forward homes across Djerba, Hammamet, Sidi Bou Said and Tabarka. Booked on
            Airbnb, managed by one team on the ground.
          </p>
        </div>

        <nav aria-label="Homes">
          <h2 className="text-xs uppercase tracking-[0.16em] text-bg/50">The homes</h2>
          <ul className="mt-5 space-y-3">
            {listings.map((listing) => (
              <li key={listing.id}>
                <Link
                  href={`/listings/${listing.slug}`}
                  className="text-sm transition-colors hover:text-primary-hover"
                >
                  {listing.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Elsewhere">
          <h2 className="text-xs uppercase tracking-[0.16em] text-bg/50">Elsewhere</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link href="/#contact" className="transition-colors hover:text-primary-hover">
                Enquire about a stay
              </Link>
            </li>
            <li>
              <Link href="/#host" className="transition-colors hover:text-primary-hover">
                About the host
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="transition-colors hover:text-primary-hover">
                Operator dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-bg/10">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-bg/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Maissa. All rights reserved.</p>
          <p>Bookings are completed on Airbnb. Enquiries answered within an hour.</p>
        </div>
      </div>
    </footer>
  );
}

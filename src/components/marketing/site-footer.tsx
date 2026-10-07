import Link from 'next/link';

import { numberWord, placeName } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

export function SiteFooter({ listings }: { listings: Listing[] }) {
  const year = new Date().getFullYear();
  const places = listings.map((l) => placeName(l.title));
  const summary = listings.length
    ? `${numberWord(listings.length)} design-forward ${listings.length === 1 ? 'home' : 'homes'} — ${places.join(' and ')}.`
    : 'Design-forward homes in Tunisia.';

  return (
    <footer className="theme-dark bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-[clamp(30px,4vw,56px)] px-gutter py-[clamp(50px,6vw,88px)]">
        <div>
          <p className="m-0 text-[26px] tracking-[-0.04em] text-ink-foreground">Maissa</p>
          <p className="mb-0 mt-4 max-w-[30ch] text-[13px] leading-[1.7] text-ink-foreground/60">
            {summary} Booked on Airbnb, managed by one team on the ground.
          </p>
        </div>
        <nav aria-label="Homes">
          <p className="m-0 text-[11px] uppercase tracking-[0.18em] text-ink-foreground/55">The homes</p>
          <ul className="mb-0 mt-[18px] flex list-none flex-col gap-[11px] p-0">
            {listings.map((listing) => (
              <li key={listing.id}>
                <Link href={`/listings/${listing.slug}`} className="text-[13.5px] text-ink-foreground/85 hover:text-accent">
                  {listing.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/listings" className="text-[13.5px] text-ink-foreground/85 hover:text-accent">
                All homes
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Elsewhere">
          <p className="m-0 text-[11px] uppercase tracking-[0.18em] text-ink-foreground/55">Elsewhere</p>
          <ul className="mb-0 mt-[18px] flex list-none flex-col gap-[11px] p-0">
            <li>
              <a href="#contact" data-scroll-link className="text-[13.5px] text-ink-foreground/85 hover:text-accent">
                Enquire about a stay
              </a>
            </li>
            <li>
              <a href="#host" data-scroll-link className="text-[13.5px] text-ink-foreground/85 hover:text-accent">
                About the host
              </a>
            </li>
            <li>
              <Link href="/dashboard" className="text-[13.5px] text-ink-foreground/85 hover:text-accent">
                Operator dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-ink-foreground/[.14]">
        <div className="mx-auto flex max-w-site flex-wrap justify-between gap-3 px-gutter py-[22px] text-[11.5px] text-ink-foreground/55">
          <p className="m-0">&copy; {year} Maissa. All rights reserved.</p>
          <p className="m-0">Bookings are completed on Airbnb. Enquiries answered within an hour.</p>
        </div>
      </div>
    </footer>
  );
}

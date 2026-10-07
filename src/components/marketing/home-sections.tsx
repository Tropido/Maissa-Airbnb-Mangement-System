import Image from 'next/image';
import Link from 'next/link';

import { PropertyMap } from '@/components/marketing/property-map';
import { firstSentence, formatCoord, formatTND } from '@/lib/utils';
import type { Host, Listing } from '@/lib/data/types';

/* ------------------------------------------------------------------ */
/* Promise                                                             */
/* ------------------------------------------------------------------ */

const PROMISES = [
  {
    title: 'Photographed honestly',
    body: 'Every room, at the hour it actually looks like that. No wide-angle tricks, no borrowed sunsets.',
  },
  {
    title: 'One team on the ground',
    body: 'The same people prepare, clean and check both houses. Nothing is subcontracted to a rota of strangers.',
  },
  {
    title: 'Answered within the hour',
    body: 'Before you book and while you are there. Hosting since 2022, and that has not slipped.',
  },
];

export function PromiseSection() {
  return (
    <section
      id="promise"
      aria-labelledby="promise-heading"
      className="mx-auto max-w-site px-gutter pb-[clamp(50px,6vw,90px)] pt-[clamp(50px,7vw,110px)]"
    >
      <p data-reveal className="m-0 text-[11px] uppercase tracking-[0.24em] text-muted-soft">
        Honest by default
      </p>
      <h2
        id="promise-heading"
        data-split-lines
        className="mb-0 mt-[26px] max-w-[20ch] text-balance text-[clamp(30px,4.4vw,62px)] font-normal leading-[1.02] tracking-[-0.045em] text-ink"
      >
        What you see is what you walk into.
      </h2>
      <ul className="m-0 mt-[clamp(48px,6vw,88px)] grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[clamp(28px,4vw,56px)] p-0">
        {PROMISES.map((promise, i) => (
          <li key={promise.title} data-reveal className="border-t border-ink/[.14] pt-[22px]">
            <p className="m-0 text-[11px] tracking-[0.2em] text-primary">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mb-0 mt-4 text-[21px] font-normal leading-[1.2] tracking-[-0.025em] text-ink">
              {promise.title}
            </h3>
            <p className="mb-0 mt-3 text-pretty text-[13.5px] leading-[1.65] text-muted-fg">{promise.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Host                                                                */
/* ------------------------------------------------------------------ */

export function HostSection({ host, homesCount }: { host: Host; homesCount: number }) {
  const replies = host.response_time === 'within an hour' ? '< 1h' : host.response_time;
  const stats = [
    { label: 'Homes', value: String(homesCount) },
    { label: 'Rating', value: host.average_rating.toFixed(1) },
    { label: 'Replies', value: replies },
    { label: 'Hosting since', value: String(host.hosting_since) },
  ];

  return (
    <section id="host" aria-labelledby="host-heading" className="theme-dark relative overflow-hidden bg-ink text-ink-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] -top-[20%] size-[60vw] rounded-full bg-[radial-gradient(circle,rgb(201_143_160/.22),transparent_62%)] motion-safe:animate-drift1"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[25%] -right-[8%] size-[52vw] rounded-full bg-[radial-gradient(circle,rgb(142_66_87/.28),transparent_64%)] motion-safe:animate-drift2"
      />

      <div className="relative mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-center gap-[clamp(34px,5vw,80px)] px-gutter py-[clamp(70px,9vw,140px)]">
        <div data-reveal>
          <div className="relative aspect-square w-[clamp(160px,20vw,240px)] overflow-hidden rounded-full bg-ink-raised">
            {host.avatar_url ? (
              <Image src={host.avatar_url} alt={`Portrait placeholder for ${host.display_name}`} fill sizes="240px" className="object-cover" />
            ) : null}
          </div>
          <p className="mb-0 mt-7 text-[11px] uppercase tracking-[0.24em] text-ink-foreground/55">{host.tagline}</p>
          <h2
            id="host-heading"
            className="mb-0 mt-4 text-[clamp(28px,3.8vw,52px)] font-normal leading-[1.02] tracking-[-0.045em] text-ink-foreground"
          >
            Hosted by {host.display_name}
          </h2>
        </div>
        <div data-reveal>
          <p className="m-0 max-w-[52ch] text-pretty text-[15px] leading-[1.75] text-ink-foreground/75">{host.bio}</p>
          <dl className="mb-0 mt-[clamp(30px,4vw,50px)] grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="border-t border-ink-foreground/20 pt-4">
                <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-foreground/55">{stat.label}</dt>
                <dd className="mb-0 ml-0 mt-2.5 text-[28px] tracking-[-0.035em] text-ink-foreground">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Where                                                               */
/* ------------------------------------------------------------------ */

export function WhereSection({ listings }: { listings: Listing[] }) {
  const usingMapbox = Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

  return (
    <section
      id="where"
      aria-labelledby="where-heading"
      className="mx-auto max-w-site px-gutter py-[clamp(70px,9vw,130px)]"
    >
      <p data-reveal className="m-0 text-[11px] uppercase tracking-[0.24em] text-muted-soft">
        Where
      </p>
      <h2
        id="where-heading"
        data-split-lines
        className="mb-0 mt-6 max-w-[18ch] text-[clamp(28px,3.8vw,52px)] font-normal leading-[1.03] tracking-[-0.045em] text-ink"
      >
        One island, one hillside above the gulf.
      </h2>

      <div
        data-reveal
        className="mt-[clamp(38px,5vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-center gap-[clamp(22px,3vw,44px)]"
      >
        {/* `#map` keeps older links to the previous map section working. */}
        <div id="map" className="relative rounded-[22px] border border-ink/10 bg-bg-sunken p-[clamp(18px,2.4vw,32px)]">
          <PropertyMap listings={listings} />
        </div>
        <ul className="m-0 flex list-none flex-col p-0">
          {listings.map((listing) => (
            <li key={listing.id} className="border-b border-ink/[.14] py-[22px]">
              <p className="m-0 flex items-baseline justify-between gap-[18px]">
                <Link href={`/listings/${listing.slug}`} className="text-lg tracking-[-0.025em] text-ink">
                  {listing.title}
                </Link>
                <span className="whitespace-nowrap text-xs text-muted-soft">{formatTND(listing.price_per_night)}</span>
              </p>
              <p className="mb-0 mt-2 text-[12.5px] leading-[1.6] text-muted-fg">
                {listing.location} &middot; {formatCoord(listing.lat)}, {formatCoord(listing.lng)}.{' '}
                {firstSentence(listing.description[listing.description.length - 1])}
              </p>
            </li>
          ))}
          <li className="py-[22px]">
            <p className="m-0 text-[12.5px] leading-[1.7] text-muted-soft">
              {usingMapbox
                ? 'Every pin is plotted from the coordinates in the listings table.'
                : 'The outline is the real Natural Earth boundary of Tunisia and every pin is plotted from the coordinates in the listings table — not an illustration.'}
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    question: 'How do I actually book?',
    answer:
      'Bookings are completed on Airbnb. Enquire here with your dates and the home, and I will confirm what is free within the hour and send you the Airbnb link.',
  },
  {
    question: 'Are the photographs current?',
    answer:
      'The images on this site are architectural studies until the new shoot is published. After that, each house is reshot after any renovation, in natural light, at the hour the room actually looks like that.',
  },
  {
    question: 'Who looks after the house while I am there?',
    answer: 'The same team that prepared it. One number, answered within the hour, for the whole stay.',
  },
  {
    question: 'What is the cancellation policy?',
    answer:
      'Whatever the Airbnb listing states at the moment you book — the policy is set there, not here, so it cannot drift.',
  },
];

/** Native <details>/<summary>: keyboard and screen-reader support with no script. */
export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="mx-auto max-w-site px-gutter pb-[clamp(70px,9vw,130px)]"
    >
      <h2
        id="faq-heading"
        data-split-lines
        className="mb-[clamp(28px,4vw,48px)] mt-0 text-[clamp(26px,3.4vw,44px)] font-normal leading-[1.04] tracking-[-0.04em] text-ink"
      >
        Questions, answered plainly
      </h2>
      <div className="border-b border-ink/[.16]">
        {FAQS.map((faq) => (
          <details key={faq.question} data-reveal className="group border-t border-ink/[.16]">
            <summary className="flex items-center justify-between gap-5 py-6 text-[clamp(16px,1.8vw,20px)] tracking-[-0.02em] text-ink">
              {faq.question}
              <span
                aria-hidden
                className="text-muted-soft transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mb-[26px] mt-0 max-w-[62ch] text-sm leading-[1.7] text-muted-fg">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

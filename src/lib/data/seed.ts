import type { Booking, Host, Listing } from './types';

/**
 * Canonical seed content. This is the same dataset that supabase/seed.sql loads,
 * kept in TypeScript so the product renders fully without a Supabase project
 * attached (local preview, Vercel preview builds, client demos).
 *
 * The portfolio is two homes — Djerba Villa and Ezzahra Apartment Loft. The
 * earlier four-home placeholder portfolio is retired; take its history from
 * git rather than re-adding it here.
 */

export const HOST: Host = {
  id: 'h_maissa',
  display_name: 'Maissa',
  tagline: 'Superhost · Djerba & Ezzahra',
  bio: 'I look after two design-forward homes — a courtyard villa in Djerba and a terrace loft in Ezzahra — each one personally renovated and photographed to give guests an honest sense of the space before they book. Both are prepared, cleaned and checked by the same team, so what you see in the listing is what you walk into. If something is not right, I answer within the hour.',
  avatar_url: '/images/hosts/maissa.svg',
  response_time: 'within an hour',
  hosting_since: 2022,
  average_rating: 4.9,
};

const SPIN_FRAME_COUNT = 24;

const spinFrames = (slug: string) =>
  Array.from(
    { length: SPIN_FRAME_COUNT },
    (_, i) => `/images/spin/${slug}/${String(i).padStart(2, '0')}.svg`,
  );

const gallery = (slug: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/images/listings/${slug}/g${i + 1}.svg`);

export const LISTINGS: Listing[] = [
  {
    id: 'l_djerba_villa',
    host_id: HOST.id,
    slug: 'djerba-villa',
    title: 'Djerba Villa',
    location: 'Houmt Souk, Djerba',
    region: 'Djerba',
    style_tag: 'whitewashed-courtyard-calm',
    status: 'featured',
    price_per_night: 320,
    currency: 'TND',
    hero_photo_url: '/images/listings/djerba-villa/hero.svg',
    gallery_urls: gallery('djerba-villa', 6),
    spin_photo_urls: spinFrames('djerba-villa'),
    video_tour_url: null,
    lat: 33.8756,
    lng: 10.8578,
    summary:
      'A whitewashed courtyard house four streets back from the fish market, rebuilt around its original vaulted rooms. Breakfast happens under the fig tree.',
    description: [
      'Djerba Villa is a traditional courtyard house reworked room by room over two years. The vaulted ceilings and thick lime-washed walls are original; the plumbing, wiring and kitchen are not. It keeps the house cool through July and August without leaning on air conditioning.',
      'The central courtyard is the heart of the house. Breakfast happens there under the fig tree, and it stays shaded until mid-afternoon. Three bedrooms open off it, each with its own door to the courtyard rather than an internal corridor.',
      'The fish market, the Sunday souk and the ferry terminal are all inside a fifteen-minute walk. The nearest swimmable beach at Sidi Mahrez is a nine-minute drive north.',
    ],
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    max_guests: 6,
    amenities: [
      { label: 'Shaded central courtyard', icon: 'garden' },
      { label: 'Roof terrace', icon: 'terrace' },
      { label: 'Air conditioning in every room', icon: 'ac' },
      { label: 'Fibre Wi-Fi, 200 Mbps', icon: 'wifi' },
      { label: 'Full kitchen with gas range', icon: 'kitchen' },
      { label: 'Washing machine', icon: 'washer' },
      { label: 'Free street parking', icon: 'parking' },
      { label: 'Desk and monitor', icon: 'workspace' },
    ],
    rating: 4.9,
    review_count: 128,
  },
  {
    id: 'l_ezzahra_apartment_loft',
    host_id: HOST.id,
    slug: 'ezzahra-apartment-loft',
    title: 'Ezzahra Apartment Loft',
    location: 'Ezzahra, Ben Arous',
    region: 'Tunis',
    style_tag: 'terrace-loft-panoramic',
    status: 'active',
    price_per_night: 280,
    currency: 'TND',
    hero_photo_url: '/images/listings/ezzahra-apartment-loft/hero.svg',
    gallery_urls: gallery('ezzahra-apartment-loft', 6),
    spin_photo_urls: spinFrames('ezzahra-apartment-loft'),
    video_tour_url: null,
    lat: 36.7419,
    lng: 10.3103,
    summary:
      'A top-floor loft on the quiet side of the hill, with a private terrace facing north-east across the Gulf of Tunis toward Carthage.',
    description: [
      'The loft occupies the whole top floor of a small 1970s building on the quiet side of the Ezzahra hill. It was stripped back to the shell in 2023: one open living space under the original concrete beams, a galley kitchen along the north wall, and the bedroom behind a full-height sliding partition.',
      'The terrace is the reason to book it. It runs the length of the flat, faces north-east down the gulf toward Carthage, and gets direct sun from first light until about two in the afternoon — then falls into shade for the rest of the day, which in July is the point.',
      'It is twenty minutes down the coast road into central Tunis and ten to the Carthage headland. The Ezzahra beach and the TGM station are both a seven-minute walk downhill.',
    ],
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    max_guests: 3,
    amenities: [
      { label: 'Private terrace over the gulf', icon: 'terrace' },
      { label: 'Sea view from every room', icon: 'sea' },
      { label: 'Fibre Wi-Fi, 100 Mbps', icon: 'wifi' },
      { label: 'Split-unit air conditioning', icon: 'ac' },
      { label: 'Galley kitchen', icon: 'kitchen' },
      { label: 'Washing machine', icon: 'washer' },
      { label: 'Residents parking', icon: 'parking' },
      { label: 'Dedicated workspace', icon: 'workspace' },
    ],
    rating: 4.85,
    review_count: 41,
  },
];

export const getListingBySlug = (slug: string) => LISTINGS.find((l) => l.slug === slug);

/* ------------------------------------------------------------------ */
/* Bookings                                                            */
/* ------------------------------------------------------------------ */

const iso = (d: Date) => d.toISOString().slice(0, 10);

const shift = (base: Date, days: number) => {
  const d = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + days);
  return d;
};

type BookingSeed = Omit<Booking, 'id' | 'check_in' | 'check_out'> & {
  /** Offset in days from the anchor date. */
  from: number;
  nights: number;
};

const stay = (
  listing_id: string,
  guest_name: string,
  from: number,
  nights: number,
  guest_count: number,
  status: Booking['status'],
  channel: Booking['channel'],
  nightly_price: number,
  times: { in?: string; out?: string } = {},
): BookingSeed => ({
  listing_id,
  guest_name,
  // No guest portraits exist; avatars fall back to initials.
  guest_avatar_url: null,
  guest_count,
  from,
  nights,
  check_in_time: times.in ?? '15:00',
  check_out_time: times.out ?? '10:00',
  status,
  channel,
  nightly_price,
});

const DJERBA = 'l_djerba_villa';
const EZZAHRA = 'l_ezzahra_apartment_loft';

/**
 * Two months of plausible traffic: no double-bookings on a listing, a spread
 * of channels, a same-day turnover, and one owner block per home so the
 * calendar's hatched state is always visible.
 */
const BOOKING_SEEDS: BookingSeed[] = [
  stay(DJERBA, 'Amira Ben Salah', -2, 5, 4, 'confirmed', 'airbnb', 320),
  stay(DJERBA, 'Lukas Weber', 4, 4, 2, 'not_confirmed', 'booking_com', 320, { in: '16:00' }),
  stay(DJERBA, 'Mehdi Gharbi', 10, 3, 3, 'early_check_in', 'airbnb', 320, { in: '11:00' }),
  stay(DJERBA, 'Sofia Marchetti', 16, 7, 6, 'confirmed', 'airbnb', 340),
  stay(DJERBA, 'Ines Ferchichi', 25, 5, 5, 'confirmed', 'direct', 330),
  stay(DJERBA, 'Owner stay', 32, 6, 0, 'blocked', 'owner_block', 0, { in: '12:00', out: '12:00' }),
  stay(DJERBA, 'Hanna Vogt', 42, 6, 5, 'confirmed', 'airbnb', 320),

  stay(EZZAHRA, 'Rami Haddad', -2, 3, 2, 'confirmed', 'booking_com', 280),
  stay(EZZAHRA, 'Nadia Cherif', 1, 7, 3, 'awaiting_payment', 'direct', 280),
  stay(EZZAHRA, 'Claire Dubois', 10, 5, 3, 'confirmed', 'booking_com', 280),
  stay(EZZAHRA, 'Jonas Lind', 22, 4, 2, 'confirmed', 'airbnb', 290),
  stay(EZZAHRA, 'Owner stay', 28, 3, 0, 'blocked', 'owner_block', 0, { in: '12:00', out: '12:00' }),
  stay(EZZAHRA, 'Yuki Tanaka', 38, 4, 2, 'awaiting_payment', 'airbnb', 280),
  stay(EZZAHRA, 'Tomas Novak', 46, 5, 3, 'confirmed', 'booking_com', 280),
];

/**
 * Materialise the booking seeds against an anchor date, so the dashboard always
 * opens on a populated calendar regardless of when it is loaded.
 */
export function getSeedBookings(anchor: Date = new Date()): Booking[] {
  return BOOKING_SEEDS.map((seed, i) => {
    const { from, nights, ...rest } = seed;
    return {
      ...rest,
      id: `b_${String(i + 1).padStart(3, '0')}`,
      check_in: iso(shift(anchor, from)),
      check_out: iso(shift(anchor, from + nights)),
    };
  });
}

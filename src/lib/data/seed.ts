import type { Booking, Host, Listing } from './types';

/**
 * Canonical seed content. This is the same dataset that supabase/seed.sql loads,
 * kept in TypeScript so the product renders fully without a Supabase project
 * attached (local preview, Vercel preview builds, client demos).
 */

export const HOST: Host = {
  id: 'h_maissa',
  display_name: 'Maissa',
  tagline: 'Superhost · Djerba & Hammamet',
  bio: 'I manage a small portfolio of design-forward homes across Djerba and Hammamet, each one personally renovated and photographed to give guests an honest sense of the space before they book. Every property is prepared, cleaned and checked by the same team, so what you see in the listing is what you walk into. If something is not right, I answer within the hour.',
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
    id: 'l_dar_djerba_blue',
    host_id: HOST.id,
    slug: 'dar-djerba-blue',
    title: 'Dar Djerba Blue',
    location: 'Houmt Souk, Djerba',
    region: 'Djerba',
    style_tag: 'whitewashed-coastal-calm',
    status: 'active',
    price_per_night: 320,
    currency: 'TND',
    hero_photo_url: '/images/listings/dar-djerba-blue/hero.svg',
    gallery_urls: gallery('dar-djerba-blue', 6),
    spin_photo_urls: spinFrames('dar-djerba-blue'),
    video_tour_url: null,
    lat: 33.8756,
    lng: 10.8578,
    summary:
      'A whitewashed courtyard house four streets back from the Houmt Souk fish market, rebuilt around its original vaulted rooms.',
    description: [
      'Dar Djerba Blue is a traditional courtyard house reworked room by room over two years. The vaulted ceilings and thick lime-washed walls are original; the plumbing, wiring and kitchen are not. It keeps the house cool through July and August without leaning on air conditioning.',
      'The central courtyard is the heart of the house. Breakfast happens there under the fig tree, and it stays shaded until mid-afternoon. Three bedrooms open off it, each with its own door to the courtyard rather than an internal corridor.',
      'The fish market, the Sunday souk and the ferry terminal are all inside a fifteen-minute walk. The nearest swimmable beach at Sidi Mahrez is a nine-minute drive north.',
    ],
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    max_guests: 6,
    amenities: [
      { label: 'Fibre Wi-Fi, 200 Mbps', icon: 'wifi' },
      { label: 'Shaded central courtyard', icon: 'garden' },
      { label: 'Air conditioning in every room', icon: 'ac' },
      { label: 'Full kitchen with gas range', icon: 'kitchen' },
      { label: 'Free street parking', icon: 'parking' },
      { label: 'Roof terrace', icon: 'terrace' },
      { label: 'Washing machine', icon: 'washer' },
      { label: 'Desk and monitor', icon: 'workspace' },
    ],
    rating: 4.9,
    review_count: 128,
  },
  {
    id: 'l_villa_hammamet_horizon',
    host_id: HOST.id,
    slug: 'villa-hammamet-horizon',
    title: 'Villa Hammamet Horizon',
    location: 'Hammamet',
    region: 'Hammamet',
    style_tag: 'modern-minimalist-poolside',
    status: 'active',
    price_per_night: 450,
    currency: 'TND',
    hero_photo_url: '/images/listings/villa-hammamet-horizon/hero.svg',
    gallery_urls: gallery('villa-hammamet-horizon', 6),
    spin_photo_urls: spinFrames('villa-hammamet-horizon'),
    video_tour_url: null,
    lat: 36.4,
    lng: 10.6167,
    summary:
      'A cubic four-bedroom villa with a twelve-metre pool, full-height glazing and a walled garden of mature palms.',
    description: [
      'Horizon is the newest house in the portfolio and the one built from scratch. White render, deep roof overhangs, and glazing that runs floor to ceiling across the whole south face, so the living room reads as one room with the pool terrace.',
      'The pool is twelve metres, unheated, and gets direct sun from about nine in the morning until six in the evening. A slatted wood pergola covers the outdoor dining table at the far end for the hours when that is too much.',
      'It sleeps eight across four bedrooms, each with its own bathroom. Hammamet Sud beach is a six-minute drive; the medina and the marina are both around fifteen.',
    ],
    bedrooms: 4,
    beds: 5,
    bathrooms: 4,
    max_guests: 8,
    amenities: [
      { label: 'Twelve-metre private pool', icon: 'pool' },
      { label: 'Fibre Wi-Fi, 500 Mbps', icon: 'wifi' },
      { label: 'Ducted air conditioning', icon: 'ac' },
      { label: 'Chef-grade kitchen', icon: 'kitchen' },
      { label: 'Gated parking for three cars', icon: 'parking' },
      { label: 'Walled garden with mature palms', icon: 'garden' },
      { label: 'Charcoal barbecue and outdoor kitchen', icon: 'bbq' },
      { label: 'Dedicated workspace', icon: 'workspace' },
    ],
    rating: 4.95,
    review_count: 74,
  },
  {
    id: 'l_sidi_bou_said_terrace_loft',
    host_id: HOST.id,
    slug: 'sidi-bou-said-terrace-loft',
    title: 'Sidi Bou Said Terrace Loft',
    location: 'Sidi Bou Said',
    region: 'Tunis',
    style_tag: 'blue-white-panoramic',
    status: 'pending',
    price_per_night: 280,
    currency: 'TND',
    hero_photo_url: '/images/listings/sidi-bou-said-terrace-loft/hero.svg',
    gallery_urls: gallery('sidi-bou-said-terrace-loft', 5),
    spin_photo_urls: spinFrames('sidi-bou-said-terrace-loft'),
    video_tour_url: null,
    lat: 36.8708,
    lng: 10.3417,
    summary:
      'A one-bedroom loft on the upper village lane, with a private terrace looking straight down the gulf toward Carthage.',
    description: [
      'The loft occupies the top floor of a village house on the quiet side of the hill, above the tourist lane rather than on it. One large room, a separate bedroom, and the terrace that is the actual reason to book it.',
      'The terrace faces north-east across the Gulf of Tunis. Sunrise over the water, the Carthage headland on the left, and enough shade from the pergola to sit out through the afternoon.',
      'This listing is pending final photography and is not yet accepting bookings. Availability opens once the shoot is complete.',
    ],
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    max_guests: 3,
    amenities: [
      { label: 'Private panoramic terrace', icon: 'terrace' },
      { label: 'Sea view over the Gulf of Tunis', icon: 'sea' },
      { label: 'Fibre Wi-Fi, 200 Mbps', icon: 'wifi' },
      { label: 'Air conditioning', icon: 'ac' },
      { label: 'Compact kitchen', icon: 'kitchen' },
      { label: 'Washing machine', icon: 'washer' },
    ],
    rating: 4.85,
    review_count: 41,
  },
  {
    id: 'l_tabarka_pine_retreat',
    host_id: HOST.id,
    slug: 'tabarka-pine-retreat',
    title: 'Tabarka Pine Retreat',
    location: 'Tabarka',
    region: 'Jendouba',
    style_tag: 'forest-secluded-rustic',
    status: 'featured',
    price_per_night: 240,
    currency: 'TND',
    hero_photo_url: '/images/listings/tabarka-pine-retreat/hero.svg',
    gallery_urls: gallery('tabarka-pine-retreat', 5),
    spin_photo_urls: spinFrames('tabarka-pine-retreat'),
    video_tour_url: null,
    lat: 36.9544,
    lng: 8.7581,
    summary:
      'A stone and timber cabin set back in the Kroumirie pines, ten minutes above the Tabarka coast road.',
    description: [
      'Built from local stone with a timber upper floor, the retreat sits on a two-hectare plot inside the pine forest. The nearest neighbouring house is not visible from the property.',
      'A wood-burning stove handles the winter, which in Tabarka is genuinely cold and wet. In summer the tree cover keeps the house around eight degrees below the coast.',
      'The Coral Coast beaches and the Genoese fort are a ten-minute drive down the hill. The forest tracks behind the house connect into the Ain Draham trail network.',
    ],
    bedrooms: 2,
    beds: 3,
    bathrooms: 1,
    max_guests: 5,
    amenities: [
      { label: 'Wood-burning stove', icon: 'fireplace' },
      { label: 'Two hectares of private pine forest', icon: 'garden' },
      { label: 'Outdoor barbecue and fire pit', icon: 'bbq' },
      { label: 'Wi-Fi, 50 Mbps', icon: 'wifi' },
      { label: 'Off-road parking', icon: 'parking' },
      { label: 'Full kitchen', icon: 'kitchen' },
    ],
    rating: 4.88,
    review_count: 63,
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

const BOOKING_SEEDS: BookingSeed[] = [
  // Dar Djerba Blue
  {
    listing_id: 'l_dar_djerba_blue',
    guest_name: 'Amira Ben Salah',
    guest_avatar_url: null,
    guest_count: 4,
    from: -3,
    nights: 7,
    check_in_time: '15:00',
    check_out_time: '11:00',
    status: 'confirmed',
    channel: 'airbnb',
    nightly_price: 320,
  },
  {
    listing_id: 'l_dar_djerba_blue',
    guest_name: 'Lukas Weber',
    guest_avatar_url: null,
    guest_count: 2,
    // Arrives the morning Amira leaves — a turnover, and the hardest day to staff.
    from: 4,
    nights: 4,
    check_in_time: '14:00',
    check_out_time: '10:00',
    status: 'awaiting_payment',
    channel: 'booking_com',
    nightly_price: 340,
  },
  {
    listing_id: 'l_dar_djerba_blue',
    guest_name: 'Sofia Marchetti',
    guest_avatar_url: null,
    guest_count: 5,
    from: 12,
    nights: 6,
    check_in_time: '16:00',
    check_out_time: '11:00',
    status: 'confirmed',
    channel: 'airbnb',
    nightly_price: 355,
  },
  {
    listing_id: 'l_dar_djerba_blue',
    guest_name: 'Deep clean and repaint',
    guest_avatar_url: null,
    guest_count: 0,
    from: 21,
    nights: 3,
    check_in_time: '09:00',
    check_out_time: '18:00',
    status: 'blocked',
    channel: 'owner_block',
    nightly_price: 0,
  },

  // Villa Hammamet Horizon
  {
    listing_id: 'l_villa_hammamet_horizon',
    guest_name: 'Nadia Cherif',
    guest_avatar_url: null,
    guest_count: 8,
    from: -1,
    nights: 6,
    check_in_time: '13:00',
    check_out_time: '11:00',
    status: 'early_check_in',
    channel: 'direct',
    nightly_price: 450,
  },
  {
    listing_id: 'l_villa_hammamet_horizon',
    guest_name: 'Tom Okafor',
    guest_avatar_url: null,
    guest_count: 6,
    from: 5,
    nights: 8,
    check_in_time: '17:00',
    check_out_time: '10:00',
    status: 'confirmed',
    channel: 'airbnb',
    nightly_price: 480,
  },
  {
    listing_id: 'l_villa_hammamet_horizon',
    guest_name: 'Claire Dubois',
    guest_avatar_url: null,
    guest_count: 4,
    from: 17,
    nights: 5,
    check_in_time: '15:00',
    check_out_time: '11:00',
    status: 'not_confirmed',
    channel: 'booking_com',
    nightly_price: 465,
  },
  {
    listing_id: 'l_villa_hammamet_horizon',
    guest_name: 'Karim Trabelsi',
    guest_avatar_url: null,
    guest_count: 7,
    from: 25,
    nights: 6,
    check_in_time: '14:00',
    check_out_time: '11:00',
    status: 'confirmed',
    channel: 'airbnb',
    nightly_price: 495,
  },

  // Sidi Bou Said Terrace Loft
  {
    listing_id: 'l_sidi_bou_said_terrace_loft',
    guest_name: 'Photography reshoot',
    guest_avatar_url: null,
    guest_count: 0,
    from: 2,
    nights: 4,
    check_in_time: '08:00',
    check_out_time: '19:00',
    status: 'blocked',
    channel: 'owner_block',
    nightly_price: 0,
  },
  {
    listing_id: 'l_sidi_bou_said_terrace_loft',
    guest_name: 'Helene Roux',
    guest_avatar_url: null,
    guest_count: 2,
    from: 9,
    nights: 3,
    check_in_time: '15:00',
    check_out_time: '11:00',
    status: 'awaiting_payment',
    channel: 'direct',
    nightly_price: 280,
  },
  {
    listing_id: 'l_sidi_bou_said_terrace_loft',
    guest_name: 'Yuki Tanaka',
    guest_avatar_url: null,
    guest_count: 2,
    from: 19,
    nights: 5,
    check_in_time: '16:00',
    check_out_time: '10:00',
    status: 'confirmed',
    channel: 'airbnb',
    nightly_price: 295,
  },

  // Tabarka Pine Retreat
  {
    listing_id: 'l_tabarka_pine_retreat',
    guest_name: 'Mehdi Gharbi',
    guest_avatar_url: null,
    guest_count: 5,
    from: 0,
    nights: 3,
    check_in_time: '15:00',
    check_out_time: '11:00',
    status: 'confirmed',
    channel: 'airbnb',
    nightly_price: 240,
  },
  {
    listing_id: 'l_tabarka_pine_retreat',
    guest_name: 'Anna Kowalski',
    guest_avatar_url: null,
    guest_count: 3,
    from: 3,
    nights: 6,
    check_in_time: '14:00',
    check_out_time: '10:00',
    status: 'confirmed',
    channel: 'direct',
    nightly_price: 255,
  },
  {
    listing_id: 'l_tabarka_pine_retreat',
    guest_name: 'Rami Haddad',
    guest_avatar_url: null,
    guest_count: 4,
    from: 20,
    nights: 4,
    check_in_time: '15:00',
    check_out_time: '11:00',
    status: 'not_confirmed',
    channel: 'booking_com',
    nightly_price: 250,
  },
  {
    listing_id: 'l_tabarka_pine_retreat',
    guest_name: 'Stove service',
    guest_avatar_url: null,
    guest_count: 0,
    from: 27,
    nights: 2,
    check_in_time: '09:00',
    check_out_time: '17:00',
    status: 'blocked',
    channel: 'owner_block',
    nightly_price: 0,
  },
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

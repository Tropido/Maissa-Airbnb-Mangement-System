import type { Booking, Host, Listing } from './types';

/**
 * Canonical seed content. This is the same dataset that supabase/seed.sql loads,
 * kept in TypeScript so the product renders fully without a Supabase project
 * attached (local preview, Vercel preview builds, client demos).
 *
 * v5: the portfolio is two homes — Djerba Villa and Ezzahra Apartment Loft.
 * The Hammamet, Sidi Bou Said and Tabarka properties are retired; if you need
 * their history, take it from git rather than re-adding them here.
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
      'A whitewashed courtyard house four streets back from the Houmt Souk fish market, rebuilt around its original vaulted rooms.',
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
    gallery_urls: gallery('ezzahra-apartment-loft', 5),
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
      { label: 'Residents parking', icon: 'parking' },
      { label: 'Washing machine', icon: 'washer' },
      { label: 'Dedicated workspace', icon: 'workspace' },
    ],
    rating: 4.85,
    review_count: 41,
  },
];

export const getListingBySlug = (slug: string) => LISTINGS.find((l) => l.slug === slug);

/** Booking rows are authored as offsets in nights from the anchor date. */
interface SeedBooking {
  listing: 'l_djerba_villa' | 'l_ezzahra_apartment_loft';
  guest: string;
  from: number;
  nights: number;
  guests: number;
  status: Booking['status'];
  channel: Booking['channel'];
  price: number;
  checkIn?: string;
  checkOut?: string;
}

/**
 * Two months of plausible traffic across the two homes: no double-bookings on a
 * listing, a spread of channels, and one owner block each so the calendar's
 * hatched state is always visible.
 */
const SEED: SeedBooking[] = [
  // Djerba Villa
  { listing: 'l_djerba_villa', guest: 'Amira Ben Salah', from: 0, nights: 5, guests: 4, status: 'confirmed', channel: 'airbnb', price: 320 },
  { listing: 'l_djerba_villa', guest: 'Lukas Weber', from: 6, nights: 4, guests: 2, status: 'not_confirmed', channel: 'booking_com', price: 320 },
  { listing: 'l_djerba_villa', guest: 'Mehdi Gharbi', from: 12, nights: 3, guests: 3, status: 'early_check_in', channel: 'airbnb', price: 320, checkIn: '11:00' },
  { listing: 'l_djerba_villa', guest: 'Sofia Marchetti', from: 18, nights: 7, guests: 6, status: 'confirmed', channel: 'airbnb', price: 340 },
  { listing: 'l_djerba_villa', guest: 'Ines Ferchichi', from: 27, nights: 5, guests: 5, status: 'confirmed', channel: 'direct', price: 330 },
  { listing: 'l_djerba_villa', guest: 'Owner', from: 34, nights: 6, guests: 0, status: 'blocked', channel: 'owner_block', price: 0 },
  { listing: 'l_djerba_villa', guest: 'Hanna Vogt', from: 44, nights: 6, guests: 5, status: 'confirmed', channel: 'airbnb', price: 320 },

  // Ezzahra Apartment Loft
  { listing: 'l_ezzahra_apartment_loft', guest: 'Rami Haddad', from: 0, nights: 3, guests: 2, status: 'confirmed', channel: 'booking_com', price: 280 },
  { listing: 'l_ezzahra_apartment_loft', guest: 'Nadia Cherif', from: 3, nights: 7, guests: 3, status: 'awaiting_payment', channel: 'direct', price: 280 },
  { listing: 'l_ezzahra_apartment_loft', guest: 'Claire Dubois', from: 12, nights: 5, guests: 3, status: 'confirmed', channel: 'booking_com', price: 280 },
  { listing: 'l_ezzahra_apartment_loft', guest: 'Jonas Lind', from: 24, nights: 4, guests: 2, status: 'confirmed', channel: 'airbnb', price: 290 },
  { listing: 'l_ezzahra_apartment_loft', guest: 'Owner', from: 30, nights: 3, guests: 0, status: 'blocked', channel: 'owner_block', price: 0 },
  { listing: 'l_ezzahra_apartment_loft', guest: 'Yuki Tanaka', from: 40, nights: 4, guests: 2, status: 'awaiting_payment', channel: 'airbnb', price: 280 },
  { listing: 'l_ezzahra_apartment_loft', guest: 'Tomas Novak', from: 48, nights: 5, guests: 3, status: 'confirmed', channel: 'booking_com', price: 280 },
];

const iso = (anchor: Date, offsetDays: number) => {
  const d = new Date(anchor);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

const slugFor = (name: string) => name.toLowerCase().replace(/[^a-z]+/g, '-');

/**
 * Bookings are generated relative to `anchor` (today, by default) so the
 * calendar and the overview always have live traffic either side of now,
 * however long after the seed was written the product is being looked at.
 *
 * The window starts two nights BEFORE the anchor, which is what gives the
 * calendar its past-nights hatching without needing a separate fixture.
 */
export function getSeedBookings(anchor: Date = new Date()): Booking[] {
  return SEED.map((b, i) => ({
    id: `b_${slugFor(b.guest)}_${i}`,
    listing_id: b.listing,
    guest_name: b.guest,
    guest_avatar_url: b.guest === 'Owner' ? null : `/images/guests/${slugFor(b.guest)}.svg`,
    guest_count: b.guests,
    check_in: iso(anchor, b.from - 2),
    check_out: iso(anchor, b.from - 2 + b.nights),
    check_in_time: b.checkIn ?? '15:00',
    check_out_time: b.checkOut ?? '10:00',
    status: b.status,
    channel: b.channel,
    nightly_price: b.price,
  }));
}

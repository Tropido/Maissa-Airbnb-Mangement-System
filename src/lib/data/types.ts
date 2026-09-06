/**
 * Domain types. These mirror the Supabase schema in supabase/migrations/0001_init.sql
 * one-to-one — if you change one, change the other.
 */

export type ListingStatus = 'active' | 'pending' | 'featured' | 'inactive';

export type BookingStatus =
  | 'confirmed'
  | 'awaiting_payment'
  | 'not_confirmed'
  | 'early_check_in'
  | 'cancelled'
  | 'blocked';

export type Channel = 'airbnb' | 'booking_com' | 'direct' | 'owner_block';

export interface Host {
  id: string;
  display_name: string;
  tagline: string;
  bio: string;
  avatar_url: string | null;
  response_time: string;
  hosting_since: number;
  average_rating: number;
}

export interface Amenity {
  label: string;
  icon: AmenityIcon;
}

export type AmenityIcon =
  | 'wifi'
  | 'pool'
  | 'ac'
  | 'kitchen'
  | 'parking'
  | 'sea'
  | 'terrace'
  | 'workspace'
  | 'washer'
  | 'fireplace'
  | 'garden'
  | 'bbq';

export interface Listing {
  id: string;
  host_id: string;
  slug: string;
  title: string;
  location: string;
  region: string;
  style_tag: string;
  status: ListingStatus;
  price_per_night: number;
  currency: 'TND';
  hero_photo_url: string;
  gallery_urls: string[];
  spin_photo_urls: string[];
  video_tour_url: string | null;
  lat: number;
  lng: number;
  summary: string;
  description: string[];
  bedrooms: number;
  beds: number;
  bathrooms: number;
  max_guests: number;
  amenities: Amenity[];
  rating: number;
  review_count: number;
}

export interface Booking {
  id: string;
  listing_id: string;
  guest_name: string;
  guest_avatar_url: string | null;
  guest_count: number;
  check_in: string; // ISO date, YYYY-MM-DD
  check_out: string; // ISO date, YYYY-MM-DD
  check_in_time: string;
  check_out_time: string;
  status: BookingStatus;
  channel: Channel;
  nightly_price: number;
}

export const CHANNEL_LABEL: Record<Channel, string> = {
  airbnb: 'Airbnb',
  booking_com: 'Booking.com',
  direct: 'Direct',
  owner_block: 'Owner block',
};

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  confirmed: 'Confirmed',
  awaiting_payment: 'Awaiting payment',
  not_confirmed: 'Not confirmed',
  early_check_in: 'Early check-in',
  cancelled: 'Cancelled',
  blocked: 'Blocked',
};

export const LISTING_STATUS_LABEL: Record<ListingStatus, string> = {
  active: 'Active',
  pending: 'Pending',
  featured: 'Featured',
  inactive: 'Inactive',
};

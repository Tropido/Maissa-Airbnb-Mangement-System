import 'server-only';

import { createServerSupabase } from '@/lib/supabase/server';

import { HOST, LISTINGS, getSeedBookings } from './seed';
import type { Booking, Host, Listing } from './types';

/**
 * Read layer. Every function tries Supabase first and falls back to the bundled
 * seed dataset when no project is configured or the query fails, so the preview
 * a client opens is never empty.
 */

async function fromSupabase<T>(
  run: (db: NonNullable<Awaited<ReturnType<typeof createServerSupabase>>>) => Promise<T | null>,
): Promise<T | null> {
  const db = await createServerSupabase();
  if (!db) return null;
  try {
    return await run(db);
  } catch (error) {
    console.error('[data] Supabase read failed, falling back to seed data:', error);
    return null;
  }
}

export async function getHost(): Promise<Host> {
  const remote = await fromSupabase(async (db) => {
    const { data, error } = await db.from('hosts').select('*').limit(1).maybeSingle();
    if (error || !data) return null;
    return data as Host;
  });
  return remote ?? HOST;
}

export async function getListings(): Promise<Listing[]> {
  const remote = await fromSupabase(async (db) => {
    const { data, error } = await db
      .from('listings')
      .select('*')
      .order('price_per_night', { ascending: false });
    if (error || !data?.length) return null;
    return data as Listing[];
  });
  return remote ?? LISTINGS;
}

/** Listings that are publicly bookable — drives the marketing site. */
export async function getPublicListings(): Promise<Listing[]> {
  const all = await getListings();
  return all.filter((l) => l.status !== 'inactive');
}

export async function getListing(slug: string): Promise<Listing | null> {
  const remote = await fromSupabase(async (db) => {
    const { data, error } = await db.from('listings').select('*').eq('slug', slug).maybeSingle();
    if (error || !data) return null;
    return data as Listing;
  });
  if (remote) return remote;
  return LISTINGS.find((l) => l.slug === slug) ?? null;
}

export async function getBookings(): Promise<Booking[]> {
  const remote = await fromSupabase(async (db) => {
    const { data, error } = await db.from('bookings').select('*').order('check_in');
    if (error || !data?.length) return null;
    return data as Booking[];
  });
  return remote ?? getSeedBookings();
}

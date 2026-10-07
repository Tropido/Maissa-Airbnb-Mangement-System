import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from './client';

/**
 * Server-side Supabase client bound to the request cookie jar.
 * Returns null when no project is configured, so callers can fall back to seed data.
 */
export async function createServerSupabase() {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component — the proxy (src/proxy.ts) refreshes the session
          // instead, so this is safe to ignore.
        }
      },
    },
  });
}

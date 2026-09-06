import { NextResponse, type NextRequest } from 'next/server';

import { createServerSupabase } from '@/lib/supabase/server';

/**
 * Magic-link landing. Exchanges the one-time code for a session cookie, then
 * sends the operator on to the dashboard.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const db = await createServerSupabase();
  if (!db) {
    return NextResponse.redirect(`${origin}/login?error=not_configured`);
  }

  const { error } = await db.auth.exchangeCodeForSession(code);
  if (error) {
    console.error('[auth] code exchange failed:', error);
    return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}

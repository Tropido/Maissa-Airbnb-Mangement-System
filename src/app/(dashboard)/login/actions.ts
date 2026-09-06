'use server';

import { headers } from 'next/headers';

import { createServerSupabase } from '@/lib/supabase/server';
import type { LoginState } from '@/lib/forms/login';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Magic-link sign-in. No passwords to leak, and the operator is one person on a
 * phone rather than a team needing SSO.
 */
export async function signInWithMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();

  if (!EMAIL.test(email)) {
    return { status: 'error', message: 'That email address does not look right.' };
  }

  const db = await createServerSupabase();

  if (!db) {
    return {
      status: 'unconfigured',
      message:
        'Supabase is not connected on this deployment, so no link can be sent. The dashboard is open in preview mode.',
    };
  }

  const headerList = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    `https://${headerList.get('host') ?? 'localhost:3000'}`;

  const { error } = await db.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    console.error('[auth] magic link failed:', error);
    return { status: 'error', message: 'Could not send the link. Try again in a moment.' };
  }

  return {
    status: 'sent',
    message: `Check ${email}. The link signs you straight in and expires in an hour.`,
  };
}

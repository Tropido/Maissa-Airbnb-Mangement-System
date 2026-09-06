'use server';

import { createServerSupabase } from '@/lib/supabase/server';
import { LISTINGS } from '@/lib/data/seed';
import type { EnquiryState } from '@/lib/forms/enquiry';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Enquiry handler. Validates on the server, then writes to Supabase when a
 * project is configured. Without one it still validates and confirms, so the
 * preview a client clicks through behaves correctly end to end — and it says so
 * rather than pretending a message was delivered.
 */
export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  const listingSlug = String(formData.get('listing') ?? '').trim();
  const guests = Number(formData.get('guests') ?? 0);
  const arriving = String(formData.get('arriving') ?? '').trim();

  const fieldErrors: EnquiryState['fieldErrors'] = {};
  if (name.length < 2) fieldErrors.name = 'Please give a name we can reply to.';
  if (!EMAIL.test(email)) fieldErrors.email = 'That email address does not look right.';
  if (message.length < 10) fieldErrors.message = 'A sentence or two about your stay, please.';
  if (listingSlug && !LISTINGS.some((l) => l.slug === listingSlug)) {
    fieldErrors.listing = 'That home is not in the portfolio.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Check the highlighted fields.', fieldErrors };
  }

  const db = await createServerSupabase();

  if (!db) {
    return {
      status: 'success',
      message:
        'Thanks. This preview is not yet connected to a mailbox, so nothing was sent — connect Supabase to start capturing enquiries.',
      fieldErrors: {},
    };
  }

  const { error } = await db.from('enquiries').insert({
    name,
    email,
    message,
    listing_slug: listingSlug || null,
    guest_count: Number.isFinite(guests) && guests > 0 ? guests : null,
    arriving: arriving || null,
  });

  if (error) {
    console.error('[enquiry] insert failed:', error);
    return {
      status: 'error',
      message: 'Something went wrong on our side. Please email direct and we will pick it up.',
      fieldErrors: {},
    };
  }

  return {
    status: 'success',
    message: 'Thanks. Your enquiry is in, and you will have a reply within the hour.',
    fieldErrors: {},
  };
}

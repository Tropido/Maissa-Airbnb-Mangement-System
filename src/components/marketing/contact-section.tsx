'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { AlertTriangle, Check } from 'lucide-react';

import { submitEnquiry } from '@/app/(marketing)/actions';
import { initialEnquiryState } from '@/lib/forms/enquiry';
import { cn } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

const fieldClass =
  'mt-[9px] h-12 w-full rounded-xl border border-ink/[.18] bg-bg-card px-[15px] text-sm text-ink placeholder:text-muted-soft transition-colors duration-300 focus-visible:border-ink/40 aria-[invalid=true]:border-danger';

const labelClass = 'block text-[11px] uppercase tracking-[0.16em] text-muted-soft';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-[50px] items-center whitespace-nowrap rounded-full bg-ink px-7 text-sm tracking-[-0.01em] text-ink-foreground transition-colors duration-300 hover:bg-ink-raised disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Send enquiry'}
    </button>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mb-0 mt-1.5 text-xs text-danger">
      {message}
    </p>
  );
}

/**
 * Enquiry section from the home reference. The form posts to the existing
 * `submitEnquiry` server action — validation, Supabase insert and the honest
 * "nothing was sent" preview message are all unchanged.
 *
 * The home is preselected from `defaultListingSlug`, or from `?home=<slug>`
 * when a listing page sends the visitor here.
 */
export function ContactSection({
  listings,
  defaultListingSlug,
}: {
  listings: Listing[];
  defaultListingSlug?: string;
}) {
  const [state, formAction] = useActionState(submitEnquiry, initialEnquiryState);
  const [home, setHome] = useState(defaultListingSlug ?? '');
  const errors = state.fieldErrors;
  const values = state.values ?? {};

  useEffect(() => {
    if (defaultListingSlug) return;
    const fromUrl = new URLSearchParams(window.location.search).get('home');
    if (fromUrl && listings.some((l) => l.slug === fromUrl)) {
      const id = window.setTimeout(() => setHome(fromUrl), 0);
      return () => window.clearTimeout(id);
    }
  }, [defaultListingSlug, listings]);

  const selected = listings.find((l) => l.slug === home);
  const maxGuests = selected?.max_guests ?? (listings.length ? Math.max(...listings.map((l) => l.max_guests)) : 12);

  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-bg-sunken">
      <div className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(34px,5vw,80px)] px-gutter py-[clamp(70px,9vw,130px)]">
        <div data-reveal>
          <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-muted-soft">Enquire</p>
          <h2
            id="contact-heading"
            className="mb-0 mt-6 max-w-[16ch] text-[clamp(30px,4.2vw,58px)] font-normal leading-[1.02] tracking-[-0.045em] text-ink"
          >
            Come and see it before you decide anything from a photo.
          </h2>
          <p className="mb-0 mt-[22px] max-w-[44ch] text-pretty text-sm leading-[1.7] text-muted-fg">
            Tell me roughly when and how many, and I will come back within the hour with what is free
            and what it costs.
          </p>
        </div>

        <form
          data-reveal
          action={formAction}
          noValidate
          className="rounded-3xl bg-bg-raised p-[clamp(24px,3vw,40px)] shadow-form"
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-[18px]">
            <div>
              <label htmlFor="enquiry-name" className={labelClass}>
                Name
              </label>
              <input
                id="enquiry-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                defaultValue={values.name}
                placeholder="Your name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
                className={fieldClass}
              />
              <FieldError id="enquiry-name-error" message={errors.name} />
            </div>
            <div>
              <label htmlFor="enquiry-email" className={labelClass}>
                Email
              </label>
              <input
                id="enquiry-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                defaultValue={values.email}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'enquiry-email-error' : undefined}
                className={fieldClass}
              />
              <FieldError id="enquiry-email-error" message={errors.email} />
            </div>
          </div>

          <div className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-[18px]">
            <div>
              <label htmlFor="enquiry-listing" className={labelClass}>
                Which home
              </label>
              <select
                id="enquiry-listing"
                name="listing"
                value={home}
                onChange={(event) => setHome(event.target.value)}
                aria-invalid={Boolean(errors.listing)}
                aria-describedby={errors.listing ? 'enquiry-listing-error' : undefined}
                className={cn(fieldClass, 'px-3')}
              >
                <option value="">No preference yet</option>
                {listings.map((listing) => (
                  <option key={listing.id} value={listing.slug}>
                    {listing.title}
                  </option>
                ))}
              </select>
              <FieldError id="enquiry-listing-error" message={errors.listing} />
            </div>
            <div>
              <label htmlFor="enquiry-arriving" className={labelClass}>
                Arrival
              </label>
              <input
                id="enquiry-arriving"
                name="arriving"
                type="date"
                defaultValue={values.arriving}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="enquiry-guests" className={labelClass}>
                Guests
              </label>
              <input
                id="enquiry-guests"
                name="guests"
                type="number"
                min={1}
                max={maxGuests}
                defaultValue={values.guests || 2}
                className={fieldClass}
              />
            </div>
          </div>

          <div className="mt-[18px]">
            <label htmlFor="enquiry-message" className={labelClass}>
              Message
            </label>
            <textarea
              id="enquiry-message"
              name="message"
              rows={4}
              required
              defaultValue={values.message}
              placeholder="Dates, how many of you, anything you need to know."
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'enquiry-message-error' : undefined}
              className={cn(fieldClass, 'h-auto resize-y py-3.5 leading-[1.6]')}
            />
            <FieldError id="enquiry-message-error" message={errors.message} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-[18px]">
            <SubmitButton />
            <p
              role="status"
              aria-live="polite"
              className={cn(
                'm-0 flex flex-1 basis-[220px] items-start gap-2 text-[12.5px] leading-normal',
                state.status === 'error' ? 'text-danger' : state.status === 'success' ? 'text-ink' : 'text-muted-fg',
              )}
            >
              {state.status === 'success' ? <Check className="mt-0.5 size-3.5 shrink-0" aria-hidden /> : null}
              {state.status === 'error' ? <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden /> : null}
              <span>
                {state.status === 'idle' || !state.message
                  ? 'Answered within the hour. Bookings are completed on Airbnb.'
                  : state.message}
              </span>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

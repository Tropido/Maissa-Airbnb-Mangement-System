'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { AlertTriangle, Check } from 'lucide-react';

import { submitEnquiry } from '@/app/(marketing)/actions';
import { initialEnquiryState } from '@/lib/forms/enquiry';
import { PropertyMap } from '@/components/marketing/property-map';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

const fieldClass =
  'w-full border-b border-muted bg-transparent px-1 py-2.5 text-sm text-ink placeholder:text-muted-fg transition-colors focus-visible:outline-none focus-visible:border-ink';

const labelClass = 'block text-[11px] uppercase tracking-[0.16em] text-muted-fg';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Sending…' : 'Send enquiry'}
    </Button>
  );
}

export function ContactSection({
  listings,
  defaultListingSlug,
}: {
  listings: Listing[];
  defaultListingSlug?: string;
}) {
  const [state, formAction] = useActionState(submitEnquiry, initialEnquiryState);

  return (
    <section id="contact" aria-labelledby="contact-heading" className="shell py-section">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-fg">Enquire</p>
          <h2 id="contact-heading" className="mt-4 font-display text-display-md font-normal">
            Ask about
            <br />
            a stay.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-fg">
            Bookings are completed on Airbnb, but questions are answered here first. Tell me the
            dates and the house, and I will confirm availability and anything the listing does not
            cover.
          </p>

          <PropertyMap
            listings={listings}
            activeId={listings.find((l) => l.slug === defaultListingSlug)?.id}
            interactive={false}
            className="mt-10 hidden h-72 w-full lg:block"
          />
        </div>

        <form action={formAction} className="bg-bg-raised p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="name" className={labelClass}>
                Your name
              </label>
              <input
                id="name"
                name="name"
                required
                autoComplete="name"
                placeholder="Maissa T."
                aria-invalid={Boolean(state.fieldErrors.name)}
                aria-describedby={state.fieldErrors.name ? 'name-error' : undefined}
                className={cn(fieldClass, 'mt-2', state.fieldErrors.name && 'border-danger')}
              />
              {state.fieldErrors.name ? (
                <p id="name-error" className="mt-1.5 text-xs text-danger">
                  {state.fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(state.fieldErrors.email)}
                aria-describedby={state.fieldErrors.email ? 'email-error' : undefined}
                className={cn(fieldClass, 'mt-2', state.fieldErrors.email && 'border-danger')}
              />
              {state.fieldErrors.email ? (
                <p id="email-error" className="mt-1.5 text-xs text-danger">
                  {state.fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="listing" className={labelClass}>
                Which home
              </label>
              <select
                id="listing"
                name="listing"
                defaultValue={defaultListingSlug ?? ''}
                className={cn(fieldClass, 'mt-2')}
              >
                <option value="">Not sure yet</option>
                {listings.map((listing) => (
                  <option key={listing.id} value={listing.slug}>
                    {listing.title} — {listing.location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="arriving" className={labelClass}>
                Arriving
              </label>
              <input
                id="arriving"
                name="arriving"
                type="date"
                className={cn(fieldClass, 'mt-2')}
              />
            </div>

            <div>
              <label htmlFor="guests" className={labelClass}>
                Guests
              </label>
              <input
                id="guests"
                name="guests"
                type="number"
                min={1}
                max={12}
                defaultValue={2}
                className={cn(fieldClass, 'mt-2')}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="message" className={labelClass}>
                Your message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Dates, how many of you, anything you need to know before booking."
                aria-invalid={Boolean(state.fieldErrors.message)}
                aria-describedby={state.fieldErrors.message ? 'message-error' : undefined}
                className={cn(fieldClass, 'mt-2 resize-y', state.fieldErrors.message && 'border-danger')}
              />
              {state.fieldErrors.message ? (
                <p id="message-error" className="mt-1.5 text-xs text-danger">
                  {state.fieldErrors.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SubmitButton />
            <p className="text-xs text-muted-fg">Replies within the hour, every day.</p>
          </div>

          <div aria-live="polite" role="status">
            {state.status !== 'idle' && state.message ? (
              <p
                className={cn(
                  'mt-5 flex items-start gap-2 text-sm',
                  state.status === 'success' ? 'text-accent' : 'text-danger',
                )}
              >
                {state.status === 'success' ? (
                  <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
                ) : (
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                )}
                {state.message}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}

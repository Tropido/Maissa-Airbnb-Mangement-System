'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { AlertTriangle, Check, Info } from 'lucide-react';

import { signInWithMagicLink } from './actions';
import { initialLoginState } from '@/lib/forms/login';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? 'Sending…' : 'Send magic link'}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(signInWithMagicLink, initialLoginState);

  const tone =
    state.status === 'sent'
      ? 'bg-accent text-accent-foreground'
      : state.status === 'unconfigured'
        ? 'bg-bg-sunken text-ink'
        : 'bg-ink text-ink-foreground';

  const Icon =
    state.status === 'sent' ? Check : state.status === 'unconfigured' ? Info : AlertTriangle;

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="font-display text-xl font-extrabold uppercase tracking-[-0.03em]"
        >
          Maissa
        </Link>

        <div className="mt-6 border-2 border-ink bg-bg-raised p-7 shadow-brutal-lg sm:p-8">
          <h1 className="font-display text-display-sm uppercase">Operator sign-in</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-fg">
            One link, no password. It goes to the address on the account and signs you in on this
            device.
          </p>

          <form action={formAction} className="mt-7">
            <label
              htmlFor="email"
              className="block text-[11px] font-bold uppercase tracking-[0.16em] text-muted-fg"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 w-full border-2 border-ink bg-bg px-4 py-3 text-sm placeholder:text-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            />

            <div className="mt-5">
              <SubmitButton />
            </div>

            <div aria-live="polite" role="status">
              {state.status !== 'idle' ? (
                <p
                  className={cn(
                    'mt-5 flex items-start gap-2 border-2 border-ink p-4 text-sm font-semibold',
                    tone,
                  )}
                >
                  <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {state.message}
                </p>
              ) : null}
            </div>
          </form>

          <p className="mt-7 border-t-2 border-ink pt-5 text-xs leading-relaxed text-muted-fg">
            Without Supabase connected, the dashboard runs on the bundled seed data and is open to
            anyone with the link.{' '}
            <Link
              href="/dashboard"
              className="font-semibold text-ink underline decoration-2 underline-offset-4"
            >
              Open it in preview mode
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

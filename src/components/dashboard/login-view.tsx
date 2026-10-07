'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { AlertTriangle, Check, Info } from 'lucide-react';

import { signInWithMagicLink } from '@/app/(dashboard)/login/actions';
import { ListingImage } from '@/components/marketing/listing-image';
import { MOTION_QUERIES } from '@/components/motion/gsap';
import { initialLoginState } from '@/lib/forms/login';
import { cn, numberWord } from '@/lib/utils';

/** Messages for the `?error=` codes the magic-link callback can send back. */
const CALLBACK_ERRORS: Record<string, string> = {
  missing_code: 'That sign-in link was incomplete. Request a new one below.',
  not_configured: 'Sign-in is not connected on this deployment yet.',
  exchange_failed: 'That link has expired or was already used. Request a new one below.',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[14px] bg-ink-foreground text-[14.5px] tracking-[-0.01em] text-ink transition-opacity duration-300 hover:opacity-[.86] disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Send the link'}
    </button>
  );
}

/**
 * Operator sign-in from `Maissa Redesign/Maissa Login.dc.html`: dark ambient
 * backdrop, a translucent two-panel card that tilts gently toward the pointer.
 *
 * The form is the existing magic-link server action, with its real states —
 * sending, sent, error, and "unconfigured" when no Supabase project exists.
 * Nothing is simulated, and the copy promises nothing about delivery time.
 */
export function LoginView({
  imageSrc,
  homesCount,
  configured,
}: {
  imageSrc?: string;
  homesCount: number;
  configured: boolean;
}) {
  const [state, formAction] = useActionState(signInWithMagicLink, initialLoginState);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('error');
    if (!code) return;
    const id = window.setTimeout(() => setCallbackError(CALLBACK_ERRORS[code] ?? 'Sign-in did not complete. Try again.'), 0);
    return () => window.clearTimeout(id);
  }, []);

  // A few degrees of tilt toward the pointer — fine pointers, full motion only.
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia(MOTION_QUERIES.reduce).matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1400px) rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 4).toFixed(2)}deg)`;
    };
    const onLeave = () => {
      el.style.transform = 'perspective(1400px)';
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      el.style.transform = '';
    };
  }, []);

  const idleNote = configured
    ? 'One link to the address on the account. It signs you in on this device.'
    : 'Supabase is not connected on this deployment, so no link can be sent. The dashboard is open in preview mode.';

  const note = state.status !== 'idle' ? state.message : (callbackError ?? idleNote);
  const tone = state.status === 'sent' ? 'sent' : state.status === 'error' || (state.status === 'idle' && callbackError) ? 'error' : 'info';
  const Icon = tone === 'sent' ? Check : tone === 'error' ? AlertTriangle : Info;

  return (
    <main className="theme-dark relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-night p-[clamp(16px,4vw,48px)] text-ink-foreground">
      <div aria-hidden className="absolute inset-[-8%] [filter:blur(3px)_saturate(.8)_brightness(.55)]">
        {imageSrc ? <ListingImage src={imageSrc} alt="" sizes="100vw" priority /> : null}
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(120deg,rgb(16_14_11/.9),rgb(16_14_11/.6)_55%,rgb(16_14_11/.88))]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[12%] -top-[22%] size-[62vw] rounded-full bg-[radial-gradient(circle,rgb(201_143_160/.22),transparent_62%)] motion-safe:animate-drift1"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[26%] -right-[10%] size-[56vw] rounded-full bg-[radial-gradient(circle,rgb(120_88_130/.18),transparent_64%)] motion-safe:animate-drift2"
      />

      <div
        ref={panel}
        className="relative z-[2] grid w-full max-w-login grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] overflow-hidden rounded-[28px] border border-ink-foreground/[.14] bg-ink/[.62] shadow-panel backdrop-blur-[20px] transition-transform duration-500 ease-quiet [transform-style:preserve-3d]"
      >
        <div className="relative min-h-[clamp(240px,32vw,420px)] overflow-hidden">
          {imageSrc ? <ListingImage src={imageSrc} alt="" sizes="(max-width: 700px) 100vw, 460px" /> : null}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(16_14_11/.3),rgb(16_14_11/.55)_45%,rgb(16_14_11/.86))]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-[clamp(22px,3vw,34px)]">
            <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-ink-foreground/75">Operator</p>
            <p className="mb-0 mt-3.5 text-[clamp(22px,2.6vw,32px)] leading-[1.06] tracking-[-0.04em] text-ink-foreground">
              {numberWord(homesCount)} {homesCount === 1 ? 'home' : 'homes'},
              <br />
              one quiet console.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-[clamp(28px,3.4vw,48px)]">
          <Link href="/" className="text-[19px] font-medium tracking-[-0.035em] text-ink-foreground hover:text-ink-foreground">
            Maissa
          </Link>
          <h1
            data-intro
            className="mb-0 mt-[26px] text-[clamp(26px,3vw,38px)] font-normal leading-[1.04] tracking-[-0.04em] text-ink-foreground"
          >
            Sign in
          </h1>
          <p className="mb-0 mt-3.5 max-w-[36ch] text-[13.5px] leading-[1.7] text-ink-foreground/[.62]">
            A magic link, no password. It goes to the address on the account.
          </p>

          <form action={formAction} className="mt-7">
            <label htmlFor="login-email" className="block text-[11px] uppercase tracking-[0.18em] text-ink-foreground/55">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="maissa@example.com"
              aria-invalid={state.status === 'error'}
              aria-describedby="login-note"
              className="mt-2.5 h-[52px] w-full rounded-[14px] border border-ink-foreground/20 bg-ink-foreground/[.06] px-4 text-[14.5px] text-ink-foreground placeholder:text-ink-foreground/45"
            />
            <SubmitButton />
          </form>

          <p
            id="login-note"
            role="status"
            aria-live="polite"
            className={cn(
              'mb-0 mt-[18px] flex items-start gap-2 text-[12.5px] leading-[1.6]',
              tone === 'sent' ? 'text-accent' : tone === 'error' ? 'text-ink-foreground' : 'text-ink-foreground/60',
            )}
          >
            <Icon className="mt-[3px] size-3.5 shrink-0" aria-hidden />
            <span>{note}</span>
          </p>

          <div className="mt-[26px] flex flex-wrap gap-[18px] border-t border-ink-foreground/[.14] pt-[22px] text-[12.5px]">
            {!configured ? (
              <Link
                href="/dashboard"
                className="border-b border-accent/40 pb-0.5 text-accent hover:text-ink-foreground"
              >
                Open it in preview mode
              </Link>
            ) : null}
            <Link href="/" className="text-ink-foreground/60 hover:text-accent">
              Back to the site
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

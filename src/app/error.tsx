'use client';

import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

/** Route-level error boundary, in the same quiet register as the 404. */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-bg p-[clamp(16px,4vw,48px)]">
      <div className="w-full max-w-[560px] rounded-[28px] border border-ink/10 bg-bg-raised p-[clamp(28px,4vw,48px)] shadow-form">
        <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-muted-soft">Something went wrong</p>
        <h1 className="mb-0 mt-5 text-[clamp(26px,3.4vw,42px)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">
          This page did not load.
        </h1>
        <p className="mb-0 mt-4 max-w-[44ch] text-[14px] leading-[1.7] text-muted-fg">
          Nothing you entered has been lost on our side. Try again, or head back to the start.
        </p>
        <div className="mt-8 flex flex-wrap gap-2.5">
          <button type="button" onClick={reset} className={buttonVariants({ variant: 'primary' })}>
            Try again
          </button>
          <Link href="/" className={buttonVariants({ variant: 'outline' })}>
            Back to the site
          </Link>
        </div>
      </div>
    </main>
  );
}

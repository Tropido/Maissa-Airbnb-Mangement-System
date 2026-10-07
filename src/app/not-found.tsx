import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="theme-dark relative flex min-h-screen items-center justify-center overflow-hidden bg-ink p-[clamp(16px,4vw,48px)] text-ink-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[12%] -top-[22%] size-[62vw] rounded-full bg-[radial-gradient(circle,rgb(201_143_160/.22),transparent_62%)] motion-safe:animate-drift1"
      />
      <div className="relative w-full max-w-[560px] rounded-[28px] border border-ink-foreground/[.14] bg-ink-raised/40 p-[clamp(28px,4vw,48px)] backdrop-blur-[20px]">
        <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-ink-foreground/55">404</p>
        <h1 className="mb-0 mt-5 text-[clamp(30px,4.4vw,52px)] font-normal leading-[1.02] tracking-[-0.045em]">
          Nothing here.
        </h1>
        <p className="mb-0 mt-4 max-w-[40ch] text-[14px] leading-[1.7] text-ink-foreground/65">
          That page does not exist. The homes and the operator dashboard are both a click away.
        </p>
        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link href="/" className={buttonVariants({ variant: 'inverse' })}>
            Back to the site
          </Link>
          <Link href="/listings" className={buttonVariants({ variant: 'ghost' })}>
            See the homes
          </Link>
        </div>
      </div>
    </main>
  );
}

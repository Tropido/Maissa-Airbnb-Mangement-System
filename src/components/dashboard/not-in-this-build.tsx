import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardLabel } from '@/components/ui/card';

/**
 * Honest page for nav destinations scoped out of this build. It says what the
 * section will do and points at what works today; nothing on it pretends to
 * be implemented, and nothing is filled with sample data.
 */
export function NotInThisBuild({
  title,
  eyebrow,
  summary,
  planned,
}: {
  title: string;
  eyebrow: string;
  summary: string;
  planned: string[];
}) {
  return (
    <div className="mx-auto w-full max-w-console px-gutter-console pb-[clamp(50px,6vw,90px)] pt-[clamp(22px,3vw,40px)]">
      <p data-intro className="m-0 text-[11px] uppercase tracking-[0.2em] text-muted-soft">
        {eyebrow} &middot; planned
      </p>
      <h1
        data-intro
        className="mb-0 mt-3.5 text-[clamp(26px,3.4vw,42px)] font-normal leading-[1.02] tracking-[-0.045em] text-ink"
      >
        {title}
      </h1>
      <p data-intro className="mb-0 mt-4 max-w-[60ch] text-[13.5px] leading-[1.7] text-muted-fg">
        {summary}
      </p>

      <Card data-reveal className="mt-[clamp(22px,3vw,34px)] overflow-hidden">
        <section aria-labelledby="planned-heading">
          <div className="border-b border-ink/[.08] px-[clamp(20px,2.4vw,30px)] py-[22px]">
            <CardLabel id="planned-heading">Planned for this section</CardLabel>
            <p className="mb-0 mt-2 text-[12.5px] text-muted-fg">Not built yet, and labelled as such.</p>
          </div>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-px bg-ink/[.08] p-0">
            {planned.map((item, i) => (
              <li key={item} className="flex gap-3.5 bg-bg-card px-[clamp(20px,2.4vw,30px)] py-[22px]">
                <span className="text-[11px] tracking-[0.2em] text-primary">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[13.5px] leading-[1.6] text-ink">{item}</span>
              </li>
            ))}
          </ol>
        </section>
      </Card>

      <div className="mt-[clamp(22px,3vw,34px)] flex flex-wrap gap-2.5">
        <Link href="/dashboard" className={buttonVariants({ variant: 'primary' })}>
          Back to overview
        </Link>
        <Link href="/dashboard/calendar" className={buttonVariants({ variant: 'outline' })}>
          Open calendar
        </Link>
      </div>
    </div>
  );
}

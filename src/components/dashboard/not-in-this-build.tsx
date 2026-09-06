import Link from 'next/link';

import { Button } from '@/components/ui/button';

/**
 * Honest stub for nav destinations that are scoped out of this build.
 *
 * The nav in the reference screenshots carries these items, so removing them
 * would break the match; leaving them as dead links would be worse. This states
 * what the section will do and points at what does work today.
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
    <div className="mx-auto w-full max-w-shell px-4 py-8 sm:px-6 lg:py-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-fg">{eyebrow}</p>
      <h1 className="mt-2 font-display text-display-sm uppercase sm:text-display-md">{title}</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-fg">{summary}</p>

      <div className="mt-8 border-2 border-ink bg-bg-raised">
        <h2 className="border-b-2 border-ink p-5 text-sm font-bold uppercase tracking-[0.12em]">
          Planned for this section
        </h2>
        <ul className="grid gap-px bg-ink sm:grid-cols-2">
          {planned.map((item, i) => (
            <li key={item} className="flex gap-3 bg-bg-raised p-5">
              <span className="font-mono text-xs font-bold text-primary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="md">
          <Link href="/dashboard">Back to overview</Link>
        </Button>
        <Button asChild variant="outline" size="md">
          <Link href="/dashboard/calendar">Open calendar</Link>
        </Button>
      </div>
    </div>
  );
}

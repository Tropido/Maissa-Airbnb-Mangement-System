import type { Listing } from '@/lib/data/types';

/**
 * Continuously scrolling name ticker — a quiet transition beat between
 * sections. Uses the `marquee` keyframe already defined in tailwind.config.ts.
 * The list renders twice back to back so the -50% loop point is seamless.
 */
export function ListingMarquee({ listings }: { listings: Listing[] }) {
  const names = listings.map((l) => l.title);
  const track = [...names, ...names];

  return (
    <div aria-hidden className="overflow-hidden border-y border-muted/30 bg-bg-raised py-6">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {track.map((name, i) => (
          <span key={`${name}-${i}`} className="flex items-center gap-10">
            <span className="font-display text-2xl font-normal text-muted-fg/60">{name}</span>
            <span className="text-muted/50">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RESOURCES = [
  {
    title: 'Set your turnover window',
    body: 'Same-day check-outs and check-ins are the only slot the cleaning team cannot absorb. Block an hour either side.',
    tag: 'Operations',
  },
  {
    title: 'Price the shoulder weeks',
    body: 'October and May fill on price, not photography. A ten percent drop moves occupancy more than a new listing photo.',
    tag: 'Pricing',
  },
  {
    title: 'Answer inside the hour',
    body: 'Response time is the single ranking factor you fully control, and the one guests mention most in reviews.',
    tag: 'Guests',
  },
  {
    title: 'Reshoot after every renovation',
    body: 'A listing photographed before the work reads as a bait-and-switch, even when the change is an improvement.',
    tag: 'Listings',
  },
  {
    title: 'Keep one direct channel open',
    body: 'Repeat guests who book direct cost nothing to acquire and are the least likely to cancel late.',
    tag: 'Channels',
  },
];

export function ResourceCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * (track.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="resources-heading">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="resources-heading" className="text-sm font-bold uppercase tracking-[0.12em]">
            Running the portfolio
          </h2>
          <p className="mt-1 text-xs text-muted-fg">
            Short notes from six years of hosting these four houses.
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous resources"
            className="flex size-10 items-center justify-center border-2 border-ink bg-bg-raised transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next resources"
            className="flex size-10 items-center justify-center border-2 border-ink bg-bg-raised transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1"
      >
        {RESOURCES.map((resource) => (
          <li
            key={resource.title}
            className="w-[17rem] shrink-0 snap-start border-2 border-ink bg-bg-raised p-5 sm:w-[20rem]"
          >
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
              {resource.tag}
            </p>
            <h3 className="mt-3 font-display text-lg font-extrabold uppercase leading-tight tracking-[-0.02em]">
              {resource.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-fg">{resource.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

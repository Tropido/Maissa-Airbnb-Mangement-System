import { Reveal } from '@/components/motion/reveal';
import { SpinViewer } from '@/components/marketing/spin-viewer';
import { slideInLeft } from '@/lib/motion';
import type { Listing } from '@/lib/data/types';

export function SpinSection({ listing }: { listing: Listing }) {
  return (
    <section aria-labelledby="spin-heading" className="shell py-section">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-center">
        <Reveal variants={slideInLeft}>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-fg">Walk around it</p>
          <h2 id="spin-heading" className="mt-4 font-display text-display-md font-normal">
            The whole
            <br />
            outside.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-fg">
            Twenty-four frames shot in a circle around {listing.title}, so you can see the garden
            side, the pool side and the approach before you commit to a week of it. Drag it, scroll
            it, or use the arrow keys.
          </p>
          <dl className="mt-8 grid grid-cols-2 divide-x divide-muted/30 border border-muted/30">
            <div className="p-4">
              <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-fg">Frames</dt>
              <dd className="mt-1 font-display text-2xl font-normal leading-none">
                {listing.spin_photo_urls.length}
              </dd>
            </div>
            <div className="p-4">
              <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-fg">Coverage</dt>
              <dd className="mt-1 font-display text-2xl font-normal leading-none">360&deg;</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <SpinViewer frames={listing.spin_photo_urls} alt={`${listing.title} in ${listing.location}`} />
        </Reveal>
      </div>
    </section>
  );
}

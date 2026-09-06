'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

/**
 * Token-free fallback for the property map.
 *
 * This is not a decorative stand-in: the pins are the real coordinates from the
 * listings table, plotted on an equirectangular projection of the bounding box
 * below. Someone reading it learns the same thing the Mapbox layer tells them —
 * how far apart the homes actually are — and it costs no third-party request.
 */
const BOUNDS = { west: 7.6, east: 11.8, south: 33.0, north: 37.6 };

const toXY = (lng: number, lat: number) => ({
  x: ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * 100,
  // Latitude runs the other way in screen space.
  y: ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * 100,
});

export function SchematicMap({
  listings,
  activeId,
  className,
}: {
  listings: Listing[];
  activeId?: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const gridLngs = [8, 9, 10, 11];
  const gridLats = [34, 35, 36, 37];

  return (
    <div className={cn('relative overflow-hidden bg-bg-sunken', className)}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        {gridLngs.map((lng) => {
          const { x } = toXY(lng, 0);
          return (
            <line
              key={`v${lng}`}
              x1={x}
              y1={0}
              x2={x}
              y2={100}
              stroke="currentColor"
              strokeWidth={0.15}
              className="text-muted"
            />
          );
        })}
        {gridLats.map((lat) => {
          const { y } = toXY(0, lat);
          return (
            <line
              key={`h${lat}`}
              x1={0}
              y1={y}
              x2={100}
              y2={y}
              stroke="currentColor"
              strokeWidth={0.15}
              className="text-muted"
            />
          );
        })}
      </svg>

      <ul className="absolute inset-0">
        {listings.map((listing) => {
          const { x, y } = toXY(listing.lng, listing.lat);
          const isActive = activeId === listing.id || hovered === listing.id;
          return (
            <li
              key={listing.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <button
                type="button"
                onMouseEnter={() => setHovered(listing.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(listing.id)}
                onBlur={() => setHovered(null)}
                className="group relative flex flex-col items-center focus-visible:outline-none"
              >
                <span
                  className={cn(
                    'size-2.5 rounded-full transition-all duration-200',
                    isActive ? 'scale-150 bg-ink' : 'bg-primary',
                  )}
                />
                <span
                  className={cn(
                    'pointer-events-none absolute top-6 whitespace-nowrap bg-bg px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-ink shadow-sm transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  {listing.title}
                </span>
                <span className="sr-only">
                  {listing.title}, {listing.location}. Latitude {listing.lat}, longitude{' '}
                  {listing.lng}.
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="absolute bottom-3 left-3 bg-bg/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-fg">
        Tunisia / {BOUNDS.west}&deg;E &ndash; {BOUNDS.east}&deg;E
      </p>
    </div>
  );
}

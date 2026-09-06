'use client';

import dynamic from 'next/dynamic';

import { SchematicMap } from '@/components/marketing/schematic-map';
import { cn } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

/**
 * Map switch. mapbox-gl is heavy and useless without a token, so it is only
 * ever code-split in, and only when a token exists. Without one the visitor
 * still gets a real, coordinate-accurate plot rather than an empty grey box.
 */
const MapboxMap = dynamic(() => import('@/components/marketing/mapbox-map'), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-bg-sunken" />,
});

export function PropertyMap({
  listings,
  activeId,
  interactive = true,
  className,
}: {
  listings: Listing[];
  activeId?: string;
  interactive?: boolean;
  className?: string;
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return <SchematicMap listings={listings} activeId={activeId} className={className} />;
  }

  return (
    <div className={cn('overflow-hidden bg-bg-sunken', className)}>
      <MapboxMap
        listings={listings}
        token={token}
        activeId={activeId}
        interactive={interactive}
      />
    </div>
  );
}

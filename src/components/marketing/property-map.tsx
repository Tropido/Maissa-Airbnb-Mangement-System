'use client';

import dynamic from 'next/dynamic';

import { SchematicMap } from '@/components/marketing/schematic-map';
import { cn } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

/**
 * Map switch. mapbox-gl is heavy and useless without a token, so it is only
 * ever code-split in, and only when a token exists. Without one the visitor
 * gets the Natural Earth outline of Tunisia with coordinate-accurate pins.
 */
const MapboxMap = dynamic(() => import('@/components/marketing/mapbox-map'), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse rounded-[inherit] bg-bg-deep" />,
});

export const hasMapboxToken = () => Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

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

  if (!token || listings.length === 0) {
    return <SchematicMap listings={listings} activeId={activeId} className={className} />;
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[16px] bg-bg-deep',
        listings.length === 1 ? 'aspect-[4/5] max-h-[300px] w-full' : 'aspect-[3/4] max-h-[520px] w-full',
        className,
      )}
    >
      <MapboxMap listings={listings} token={token} activeId={activeId} interactive={interactive} />
    </div>
  );
}

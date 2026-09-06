'use client';

import { useMemo, useState } from 'react';
import Map, { Marker, NavigationControl, Popup, type MapRef } from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

import { formatTND } from '@/lib/utils';
import { BRAND } from '@/lib/tokens';
import type { Listing } from '@/lib/data/types';

/**
 * Mapbox layer. Only ever reached through property-map.tsx, which imports it
 * dynamically and only when a token exists — so mapbox-gl (a large dependency)
 * stays out of the initial bundle and off token-less deployments entirely.
 *
 * Styling: the muted monochrome base map, with pins in brand `primary`, per the
 * brief. Colours come from `@/lib/tokens` rather than Tailwind classes because
 * they cross into the Mapbox canvas and inline marker styles, which classes
 * cannot reach.
 */
export default function MapboxMap({
  listings,
  token,
  activeId,
  interactive = true,
}: {
  listings: Listing[];
  token: string;
  activeId?: string;
  interactive?: boolean;
}) {
  const [selected, setSelected] = useState<Listing | null>(null);
  const [ref, setRef] = useState<MapRef | null>(null);

  const initialViewState = useMemo(() => {
    if (listings.length === 1) {
      return { longitude: listings[0].lng, latitude: listings[0].lat, zoom: 12 };
    }
    const lngs = listings.map((l) => l.lng);
    const lats = listings.map((l) => l.lat);
    return {
      longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
      latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
      zoom: 5.6,
    };
  }, [listings]);

  return (
    <Map
      ref={setRef}
      mapboxAccessToken={token}
      initialViewState={initialViewState}
      mapStyle="mapbox://styles/mapbox/light-v11"
      interactive={interactive}
      attributionControl
      reuseMaps
      style={{ width: '100%', height: '100%' }}
      onLoad={() => {
        const map = ref?.getMap();
        if (!map) return;
        // Desaturate the base map so the orange pins are the only saturated
        // thing on screen, matching the restraint of the rest of the site.
        for (const layer of map.getStyle()?.layers ?? []) {
          if (layer.type === 'symbol') continue;
          try {
            if (layer.type === 'fill') map.setPaintProperty(layer.id, 'fill-opacity', 0.55);
            if (layer.type === 'line') map.setPaintProperty(layer.id, 'line-opacity', 0.4);
          } catch {
            // Some layers reject paint overrides; skipping them is fine.
          }
        }
      }}
    >
      {interactive ? <NavigationControl position="top-right" showCompass={false} /> : null}

      {listings.map((listing) => (
        <Marker
          key={listing.id}
          longitude={listing.lng}
          latitude={listing.lat}
          anchor="bottom"
          onClick={(event) => {
            event.originalEvent.stopPropagation();
            setSelected(listing);
          }}
        >
          <button
            type="button"
            aria-label={`${listing.title}, ${listing.location}`}
            style={{
              width: activeId === listing.id ? 18 : 12,
              height: activeId === listing.id ? 18 : 12,
              borderRadius: '50%',
              background: BRAND.primary,
              border: `2px solid ${BRAND.bg}`,
              cursor: 'pointer',
              display: 'block',
            }}
          />
        </Marker>
      ))}

      {selected ? (
        <Popup
          longitude={selected.lng}
          latitude={selected.lat}
          anchor="top"
          closeButton
          closeOnClick={false}
          onClose={() => setSelected(null)}
          maxWidth="240px"
        >
          <div style={{ fontFamily: 'inherit', color: BRAND.ink, background: BRAND.bg }}>
            <strong style={{ display: 'block', fontSize: 13 }}>{selected.title}</strong>
            <span style={{ fontSize: 11 }}>{selected.location}</span>
            <br />
            <span style={{ fontSize: 11, fontWeight: 700 }}>
              {formatTND(selected.price_per_night)} / night
            </span>
          </div>
        </Popup>
      ) : null}
    </Map>
  );
}

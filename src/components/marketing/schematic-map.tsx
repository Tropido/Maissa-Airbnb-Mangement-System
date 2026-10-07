import { BRAND } from '@/lib/tokens';
import { cn, formatCoord, placeName } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

/**
 * Token-free map: the real Natural Earth boundary of Tunisia (public domain)
 * with each home plotted from its coordinates in the listings table — not an
 * illustration. Used whenever no Mapbox token is configured.
 *
 * Projection: equirectangular with longitude scaled by cos 34°, which keeps
 * the country's proportions honest at this latitude. Calibrated so the
 * reference outline and both reference pins line up exactly:
 *   x = (lng − 7.525) × 82.9    y = (37.35 − lat) × 100
 */
export const TUNISIA_PATH =
  'M162.3 704.2 L126.9 524.7 L75.8 484.4 L75.1 460.2 L7.3 400.6 L0 325.3 L51.1 269.5 L70.6 187 L57.5 91.7 L74.3 40.4 L164.6 0 L222.7 12 L220.2 62.6 L290.5 25.8 L296.4 45 L254.9 94 L254.4 140.3 L283.1 165.1 L272.2 251.6 L217.6 301.9 L233.3 356.4 L276.2 358.1 L297.1 405.7 L328.6 421.3 L323.9 498.1 L283.5 526.8 L258 558.9 L201.1 597.4 L209.9 638.8 L202.7 681.1 Z';

const LNG0 = 7.525;
const LAT0 = 37.35;
const KX = 100 * Math.cos((34 * Math.PI) / 180);
const KY = 100;

export const project = (lat: number, lng: number) => ({ x: (lng - LNG0) * KX, y: (LAT0 - lat) * KY });

export function SchematicMap({
  listings,
  activeId,
  className,
}: {
  listings: Listing[];
  activeId?: string;
  className?: string;
}) {
  const single = listings.length === 1;
  const label = listings.length
    ? `Map of Tunisia showing ${listings.map((l) => l.title).join(' and ')}`
    : 'Map of Tunisia';

  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox="-30 -30 389 765"
        role="img"
        aria-label={label}
        className={cn('mx-auto block w-full', single ? 'max-h-[300px]' : 'max-h-[520px]')}
      >
        <path
          d={TUNISIA_PATH}
          data-draw
          data-path
          fill="rgba(142,66,87,.1)"
          stroke={BRAND.ink}
          strokeWidth={single ? 3 : 2.4}
          strokeLinejoin="round"
        />
        <circle data-mote={single ? 26 : 22} r={single ? 6 : 5} fill={BRAND.primary} opacity="0" />
        {listings.map((listing, i) => {
          const { x, y } = project(listing.lat, listing.lng);
          const active = single || listing.id === activeId;
          const fill = active || i % 2 === 1 ? BRAND.primary : BRAND.ink;
          const ring = fill === BRAND.primary ? 'rgba(142,66,87,.45)' : 'rgba(26,10,15,.35)';
          return (
            <g key={listing.id}>
              <circle cx={x} cy={y} r={single ? 11 : 8} fill={fill} />
              <circle cx={x} cy={y} r={single ? 22 : 17} fill="none" stroke={ring} strokeWidth={single ? 3 : 2} />
              {single ? null : (
                <>
                  <text x={x + 17} y={y - 3} fontSize="18" fontFamily="inherit" fill={BRAND.ink}>
                    {placeName(listing.title)}
                  </text>
                  <text x={x + 17} y={y + 17} fontSize="13" fontFamily="inherit" fill={BRAND.mutedSoft}>
                    {formatCoord(listing.lat)}, {formatCoord(listing.lng)}
                  </text>
                </>
              )}
            </g>
          );
        })}
        {single ? null : (
          <text x="0" y="730" fontSize="12" fontFamily="inherit" fill={BRAND.mutedSoft} letterSpacing="1.6">
            TUNISIA · NATURAL EARTH OUTLINE
          </text>
        )}
      </svg>
      {single && listings[0] ? (
        <p className="mb-0 mt-3.5 text-center text-[10.5px] uppercase tracking-[0.14em] text-muted-soft">
          {formatCoord(listings[0].lat)}, {formatCoord(listings[0].lng)}
        </p>
      ) : null}
    </div>
  );
}

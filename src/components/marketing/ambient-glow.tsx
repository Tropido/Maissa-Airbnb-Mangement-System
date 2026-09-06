import { cn } from '@/lib/utils';
import { BRAND } from '@/lib/tokens';

/**
 * Barely-there ambient atmosphere — two large, heavily blurred gradient blobs
 * drifting slowly behind a section. Pure CSS (no JS), frozen (still visible,
 * not animating) under prefers-reduced-motion via Tailwind's `motion-reduce:`.
 *
 * Colours come from `@/lib/tokens` rather than Tailwind classes because a
 * `radial-gradient` in an inline style is a place Tailwind classes can't
 * reach — same documented exception as `mapbox-map.tsx`.
 *
 * `onPhoto`: for use over a full-bleed photo (e.g. the closing CTA) rather
 * than the plain cream surface — blends into the image instead of sitting
 * under it, and reads a little stronger since a dark scrim usually sits above it.
 */
export function AmbientGlow({ onPhoto = false }: { onPhoto?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        onPhoto ? 'z-[1] mix-blend-overlay' : '-z-10',
      )}
    >
      <div
        className={cn(
          'absolute left-1/4 top-0 size-[42rem] rounded-full blur-3xl motion-reduce:animate-none animate-drift1',
          onPhoto ? 'opacity-30' : 'opacity-[0.12]',
        )}
        style={{ background: `radial-gradient(circle, ${BRAND.primary} 0%, transparent 70%)` }}
      />
      <div
        className={cn(
          'absolute bottom-0 right-1/4 size-[38rem] rounded-full blur-3xl motion-reduce:animate-none animate-drift2',
          onPhoto ? 'opacity-25' : 'opacity-[0.10]',
        )}
        style={{ background: `radial-gradient(circle, ${BRAND.accent} 0%, transparent 70%)` }}
      />
    </div>
  );
}

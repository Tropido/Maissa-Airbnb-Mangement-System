'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

import { cn } from '@/lib/utils';

/**
 * The bundled imagery is procedural SVG art — architectural studies of each
 * house — until the real shoots land. Anything that is not an SVG is treated
 * as photography and loses the note automatically.
 */
export const isStudyArt = (src: string) => src.toLowerCase().endsWith('.svg');

/**
 * next/image with a quiet failure mode: a missing or broken file leaves the
 * container's own surface colour showing instead of a broken-image glyph.
 * Always used inside a sized, `relative` container.
 */
export function ListingImage({ className, alt, ...props }: Omit<ImageProps, 'fill'> & { alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <Image
      {...props}
      alt={alt}
      fill
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  );
}

/** Small honest label on placeholder renders. */
export function StudyNote({ src, className }: { src: string; className?: string }) {
  if (!isStudyArt(src)) return null;
  return (
    <span
      className={cn(
        'pointer-events-none absolute z-[1] rounded-full bg-ink/70 px-2.5 py-1 text-[9.5px] uppercase tracking-[0.14em] text-ink-foreground backdrop-blur-sm',
        className,
      )}
    >
      Architectural study · photos to come
    </span>
  );
}

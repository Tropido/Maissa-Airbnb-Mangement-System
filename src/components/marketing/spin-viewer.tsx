'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { isStudyArt } from '@/components/marketing/listing-image';
import { BRAND } from '@/lib/tokens';
import { cn } from '@/lib/utils';

/**
 * Photo-sequence spinner over frames shot in a circle around the property.
 * No 3D runtime — it is a flipbook, and labelled as one; it is not a
 * commissioned 3D walkthrough.
 *
 * Input: drag (18px per frame, as in the reference), wheel scrub, or the
 * arrow keys while the viewer has focus — exposed as a slider so the
 * keyboard path is announced. An idle rotation advertises the affordance
 * while it is on screen, stops for good on first interaction and never runs
 * under reduced motion. The whole sequence preloads before input is enabled.
 */
export function SpinViewer({ frames, alt, className }: { frames: string[]; alt: string; className?: string }) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [visible, setVisible] = useState(false);
  const viewer = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; index: number; id: number } | null>(null);
  const wheel = useRef(0);

  const total = frames.length;
  const ready = total > 0 && loaded >= total;

  useEffect(() => {
    if (!total) return;
    let cancelled = false;
    let settled = 0;
    frames.forEach((src) => {
      const img = new window.Image();
      const done = () => {
        if (cancelled) return;
        settled += 1;
        setLoaded(settled);
      };
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });
    return () => {
      cancelled = true;
    };
  }, [frames, total]);

  useEffect(() => {
    const el = viewer.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!ready || interacted || !visible) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), 140);
    return () => window.clearInterval(id);
  }, [ready, interacted, visible, total]);

  const step = useCallback(
    (delta: number) => {
      setInteracted(true);
      setIndex((i) => (((i + delta) % total) + total) % total);
    },
    [total],
  );

  if (!total) return null;

  const degrees = Math.round((index / total) * 360);
  const pct = total > 1 ? (index / (total - 1)) * 100 : 0;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <h2 className="m-0 text-[11px] font-normal uppercase tracking-[0.22em] text-muted-soft">Walk around it</h2>
        <p className="m-0 text-[11.5px] text-muted-soft">
          Drag or use &larr; &rarr; &middot; frame{' '}
          <span className="text-ink">{String(index + 1).padStart(2, '0')}</span> of {total}
        </p>
      </div>
      <div
        ref={viewer}
        role="slider"
        tabIndex={0}
        aria-label={`Rotate the photo sequence of ${alt}`}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        aria-valuetext={`Frame ${index + 1} of ${total}, ${degrees} degrees`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            step(1);
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            step(-1);
          }
        }}
        onWheel={(e) => {
          wheel.current += e.deltaX || e.deltaY;
          if (Math.abs(wheel.current) < 40) return;
          step(wheel.current > 0 ? 1 : -1);
          wheel.current = 0;
        }}
        onPointerDown={(e) => {
          if (!ready) return;
          setInteracted(true);
          drag.current = { x: e.clientX, index, id: e.pointerId };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || d.id !== e.pointerId) return;
          const next = d.index + Math.round((e.clientX - d.x) / 18);
          setIndex(((next % total) + total) % total);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        className={cn(
          'relative mt-[18px] aspect-video select-none overflow-hidden rounded-[22px] bg-ink touch-pan-y',
          ready ? 'cursor-grab active:cursor-grabbing' : 'cursor-progress',
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- frame swapping needs one stable element with a mutable src. */}
        <img
          src={frames[index]}
          alt=""
          draggable={false}
          className={cn(
            'pointer-events-none size-full object-cover transition-opacity duration-300',
            ready ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgb(26_10_15/.55))]" />
        {!ready ? (
          <p className="absolute inset-0 m-0 flex items-center justify-center text-[11px] uppercase tracking-[0.16em] text-ink-foreground/70">
            Loading frame {loaded} of {total}
          </p>
        ) : null}
        {isStudyArt(frames[0]) ? (
          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-ink/70 px-2.5 py-1 text-[9.5px] uppercase tracking-[0.14em] text-ink-foreground">
            Architectural study · photos to come
          </span>
        ) : null}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[18px] flex justify-center">
          <span
            className="block h-[3px] w-[140px] rounded-full"
            style={{
              background: `linear-gradient(90deg,${BRAND.bg} 0,${BRAND.bg} ${pct}%,rgba(246,230,234,.28) ${pct}%,rgba(246,230,234,.28) 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

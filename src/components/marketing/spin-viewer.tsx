'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { MoveHorizontal, RotateCw } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Phase 1 of the 360 viewer: a photo-sequence spinner over frames shot in a
 * circle around the property. No 3D runtime, no WebGL — it works with the
 * photography that already exists.
 *
 * Phase 2 swaps this component for a Spline scene once a real .splinecode model
 * has been authored. That is a different asset pipeline, not a different
 * component API, so the props here are deliberately frame-agnostic.
 *
 * Interaction: drag, scrub with the wheel, or use the arrow keys. The element
 * is exposed as a slider so the keyboard path is announced, and an auto-rotate
 * runs until the first interaction to make the affordance obvious.
 */
export function SpinViewer({
  frames,
  alt,
  className,
}: {
  frames: string[];
  alt: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const dragStart = useRef({ x: 0, index: 0 });
  const wheelAccumulator = useRef(0);

  const total = frames.length;
  const ready = total > 0 && loaded >= total;

  // Preload the whole sequence before enabling the control — a half-loaded
  // spinner that flashes white on drag is worse than a short wait.
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

  // Idle auto-rotate, stopped for good on first interaction and never started
  // for visitors who asked for reduced motion.
  useEffect(() => {
    if (!ready || interacted) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), 110);
    return () => window.clearInterval(id);
  }, [ready, interacted, total]);

  const step = useCallback(
    (delta: number) => {
      setInteracted(true);
      setIndex((i) => (((i + delta) % total) + total) % total);
    },
    [total],
  );

  const onDragStart = (_: unknown, info: PanInfo) => {
    setInteracted(true);
    dragStart.current = { x: info.point.x, index };
  };

  const onDrag = (_: unknown, info: PanInfo) => {
    const dx = info.point.x - dragStart.current.x;
    // One full revolution per ~440px of travel.
    const frameDelta = Math.round((dx / 440) * total);
    const next = (((dragStart.current.index - frameDelta) % total) + total) % total;
    setIndex(next);
  };

  const onWheel = (event: React.WheelEvent) => {
    wheelAccumulator.current += event.deltaY;
    if (Math.abs(wheelAccumulator.current) < 40) return;
    step(wheelAccumulator.current > 0 ? 1 : -1);
    wheelAccumulator.current = 0;
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      step(1);
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      step(-1);
    }
  };

  const degrees = Math.round((index / Math.max(total, 1)) * 360);

  return (
    <div className={cn('relative select-none bg-bg-sunken', className)}>
      <motion.div
        role="slider"
        tabIndex={0}
        aria-label={`Rotate the view of ${alt}`}
        aria-valuemin={0}
        aria-valuemax={359}
        aria-valuenow={degrees}
        aria-valuetext={`${degrees} degrees`}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        className="relative aspect-[3/2] w-full cursor-grab touch-pan-y active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- frame swapping
            needs a stable element with a mutable src; the optimizer would fight it. */}
        <img
          src={frames[index]}
          alt={`${alt}, rotated ${degrees} degrees`}
          draggable={false}
          className={cn(
            'pointer-events-none size-full object-cover transition-opacity duration-200',
            ready ? 'opacity-100' : 'opacity-0',
          )}
        />

        {!ready ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <RotateCw className="size-6 animate-spin text-muted-fg" aria-hidden />
            <p className="text-xs uppercase tracking-[0.16em] text-muted-fg">
              Loading view {loaded} of {total}
            </p>
          </div>
        ) : null}
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-bg/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-ink">
          <MoveHorizontal className="size-3" aria-hidden />
          Drag to rotate
        </span>
        <span className="rounded-full bg-ink/80 px-2.5 py-1 font-mono text-[10px] text-ink-foreground">
          {String(degrees).padStart(3, '0')}&deg;
        </span>
      </div>

      {/* Frame ticks — a physical read on where you are in the revolution. */}
      <div aria-hidden className="absolute inset-x-0 top-0 flex gap-px p-2">
        {frames.map((frame, i) => (
          <span
            key={frame}
            className={cn('h-0.5 flex-1 rounded-full', i === index ? 'bg-primary' : 'bg-ink/15')}
          />
        ))}
      </div>
    </div>
  );
}

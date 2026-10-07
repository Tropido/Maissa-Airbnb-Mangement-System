'use client';

import type { RefObject } from 'react';

import { MOTION_QUERIES, Observer, gsap, useGSAP } from '@/components/motion/gsap';

/**
 * Retreats a bar on scroll-down and brings it back on scroll-up (Observer,
 * 0.45s). It never hides while the bar holds keyboard focus, returns as soon
 * as it receives focus, and does nothing under reduced motion.
 */
export function useHideOnScroll(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const bar = ref.current;
      if (!bar) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.motion, () => {
        const show = () => gsap.to(bar, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
        const hide = () => gsap.to(bar, { yPercent: -140, opacity: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
        const observer = Observer.create({
          target: window,
          type: 'wheel,touch,scroll',
          tolerance: 14,
          onDown: () => {
            if (!bar.contains(document.activeElement)) hide();
          },
          onUp: show,
        });
        bar.addEventListener('focusin', show);
        return () => {
          observer.kill();
          bar.removeEventListener('focusin', show);
          gsap.set(bar, { clearProps: 'transform,opacity' });
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
}

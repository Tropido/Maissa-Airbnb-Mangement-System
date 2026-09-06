'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll, mounted on the marketing shell only — the dashboard needs
 * native scrolling for its virtualised calendar grid.
 *
 * Disabled outright when the visitor asks for reduced motion, and torn down on
 * unmount so a client-side navigation into the dashboard leaves no listener behind.
 *
 * Lenis smooths scroll position independently of native `scroll` events, so any
 * GSAP `ScrollTrigger` on the page (see section-divider.tsx) would desync from
 * what's actually on screen unless it's told about Lenis's own scroll updates —
 * hence `lenis.on('scroll', ScrollTrigger.update)` and driving both off one
 * `gsap.ticker` clock instead of a separate raw `requestAnimationFrame` loop.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}

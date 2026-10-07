'use client';

import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Flip } from 'gsap/Flip';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Observer } from 'gsap/Observer';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

/**
 * The one place the GSAP plugin set is registered. Every plugin here has been
 * free since GSAP 3.13 and ships in the `gsap` package already installed.
 *
 * Registration is idempotent and happens at module load on the client only;
 * importing this file on the server is harmless (GSAP guards `window`).
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin,
    Observer,
    SplitText,
    ScrambleTextPlugin,
    Flip,
    Draggable,
    InertiaPlugin,
    DrawSVGPlugin,
    MorphSVGPlugin,
    MotionPathPlugin,
  );
}

export {
  gsap,
  useGSAP,
  Draggable,
  Flip,
  Observer,
  ScrollSmoother,
  ScrollTrigger,
  SplitText,
};

/** Media-query conditions shared by every `gsap.matchMedia()` in the product. */
export const MOTION_QUERIES = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
} as const;

/** Reference easing and durations: ~1–1.1s reveals, 0.3–0.45s interactions. */
export const EASE = 'power3.out';

/** Fired by the intro curtain the moment it starts to lift. */
export const INTRO_EVENT = 'maissa:intro';

/** True while the branded entrance is (or is about to be) on screen. */
export function introPlaying() {
  return typeof document !== 'undefined' && document.documentElement.dataset.intro === 'play';
}

/**
 * Runs `fn` when the curtain lifts — or straight away if there is no curtain
 * this visit. Returns an unsubscribe for effect cleanup.
 */
export function onIntro(fn: () => void) {
  if (!introPlaying()) {
    fn();
    return () => {};
  }
  let fired = false;
  const run = () => {
    if (fired) return;
    fired = true;
    fn();
  };
  document.addEventListener(INTRO_EVENT, run, { once: true });
  // Same ceiling as the CSS fail-safe: never wait on a curtain that stalled.
  const timer = window.setTimeout(run, 3400);
  return () => {
    document.removeEventListener(INTRO_EVENT, run);
    window.clearTimeout(timer);
  };
}

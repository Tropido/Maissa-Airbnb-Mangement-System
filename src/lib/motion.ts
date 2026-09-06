import type { Transition, Variants } from 'framer-motion';

/**
 * Shared motion language. Everything on the marketing site uses these, so the
 * whole site accelerates and settles the same way.
 *
 * Standard ease-out — quick to start, gentle to rest. Quiet editorial motion,
 * not a heavy block landing.
 */
export const EASE_QUIET = [0.22, 1, 0.36, 1] as const;

export const transition = {
  fast: { duration: 0.4, ease: EASE_QUIET } satisfies Transition,
  base: { duration: 0.7, ease: EASE_QUIET } satisfies Transition,
  slow: { duration: 1.1, ease: EASE_QUIET } satisfies Transition,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: transition.base },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.base },
};

/** Blocks that slide in from the left edge, used for section headers. */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: transition.base },
};

/** Wraps a group so children animate in sequence rather than together. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Quiet reveal — a soft fade and rise. Named `wipeUp` for the import sites that use it. */
export const wipeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transition.slow },
};

/** Standard viewport trigger — fires once, slightly before the block is in view. */
export const inView = { once: true, margin: '-80px 0px -80px 0px' } as const;

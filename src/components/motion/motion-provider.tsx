'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Applies the visitor's motion preference to every framer-motion animation on
 * the site at once.
 *
 * `reducedMotion="user"` drops transform and layout animation for anyone who has
 * asked for reduced motion, while leaving opacity alone — movement is what
 * triggers vestibular symptoms, and stripping the fade too would leave content
 * appearing with no transition at all.
 *
 * Doing this here rather than branching inside each component matters: a
 * component that renders a different element on the server than on the client
 * (because the server has no media query to read) produces a hydration mismatch.
 * The provider changes behaviour, not markup.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

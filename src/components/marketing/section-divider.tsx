'use client';

import { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(MorphSVGPlugin, ScrollTrigger);

const SHAPE_FLAT = 'M0,60 C360,20 1080,100 1440,60 L1440,120 L0,120 Z';
const SHAPE_WAVE = 'M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z';

/**
 * One tasteful morphing accent between the hero and the listings grid — a
 * wave divider that flattens and swells as the visitor scrolls past it,
 * scrubbed by ScrollTrigger via MorphSVGPlugin.
 */
export function SectionDivider() {
  const container = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !pathRef.current || !container.current) return;

      gsap.to(pathRef.current, {
        morphSVG: SHAPE_WAVE,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    },
    { scope: container, dependencies: [reduced] },
  );

  return (
    <div ref={container} aria-hidden className="-mb-px w-full text-bg-raised">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-16 w-full sm:h-24">
        <path ref={pathRef} d={SHAPE_FLAT} fill="currentColor" />
      </svg>
    </div>
  );
}

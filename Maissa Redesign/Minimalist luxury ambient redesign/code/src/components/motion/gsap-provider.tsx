'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Observer } from 'gsap/Observer';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

/**
 * Registers the GSAP plugin set once, mounts ScrollSmoother on the marketing
 * shell, and wires the behaviours that are page-agnostic:
 *
 *   - [data-reveal]              fade + rise as it enters the viewport
 *   - [data-split]               SplitText line reveal
 *   - [data-scramble]            ScrambleText settle on entry
 *   - [data-scroll-link]         ScrollTo glide instead of an anchor jump
 *   - [data-hide-on-scroll]      Observer-driven retreat on scroll-down
 *   - [data-draw]                DrawSVG stroke-in
 *   - [data-path] + [data-mote]  MotionPath loop along an SVG path
 *   - [data-morph-from]/[-to]    MorphSVG scrubbed by scroll
 *   - [data-drag]                Draggable + Inertia
 *
 * ScrollSmoother, SplitText, ScrambleText, Draggable, Inertia, DrawSVG, MorphSVG
 * and MotionPath are GSAP's formerly-paid plugins, free since GSAP 3.13. They
 * ship in the `gsap` package — no Club install step, no auth token in CI.
 *
 * Anything that fails here must not cost the visitor the page: the whole build
 * is wrapped, and `motion-ready` is removed in a `finally` so hidden elements
 * always become visible again.
 */
export function GsapProvider({
  children,
  smooth = false,
}: {
  children: React.ReactNode;
  smooth?: boolean;
}) {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.registerPlugin(
      ScrollTrigger, ScrollSmoother, ScrollToPlugin, Observer, SplitText,
      ScrambleTextPlugin, Flip, Draggable, InertiaPlugin, DrawSVGPlugin,
      MorphSVGPlugin, MotionPathPlugin,
    );

    if (reduced) root.classList.add('no-smooth');
    root.classList.add('motion-ready');

    let smoother: ScrollSmoother | undefined;
    const splits: SplitText[] = [];
    const observers: Observer[] = [];
    const draggables: Draggable[] = [];
    let onLink: ((e: MouseEvent) => void) | undefined;

    const ctx = gsap.context(() => {
      try {
        // Loading screen. Lifts once the first paint is genuinely ready.
        const loader = document.querySelector<HTMLElement>('[data-loader]');
        if (loader) {
          const intro = gsap.timeline();
          intro.from('[data-loader-mark]', { yPercent: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
          if (document.querySelector('[data-loader-line]')) {
            intro.from('[data-loader-line]', { drawSVG: '50% 50%', duration: 1.1, ease: 'power2.inOut' }, 0.1);
          }
          intro
            .from('[data-loader-note]', { opacity: 0, duration: 0.7 }, 0.5)
            .to(loader, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '+=0.35')
            .set(loader, { display: 'none' });
          if (document.querySelector('[data-intro]')) {
            intro.from('[data-intro]', { y: 28, opacity: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }, '-=0.6');
          }
        }

        if (smooth && !reduced) {
          smoother = ScrollSmoother.create({
            wrapper: '#smooth-wrapper',
            content: '#smooth-content',
            smooth: 1.2,
            effects: false,
            normalizeScroll: false,
          });
        } else {
          root.classList.add('no-smooth');
        }

        gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
          const split = new SplitText(el, { type: 'lines' });
          splits.push(split);
          gsap.set(el, { visibility: 'visible' });
          gsap.from(split.lines, {
            yPercent: 60, opacity: 0, duration: 1, stagger: 0.09, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.set(el, { visibility: 'visible' });
          gsap.from(el, {
            y: 34, opacity: 0, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-scramble]').forEach((el) => {
          const text = el.textContent ?? '';
          gsap.to(el, {
            duration: 1.1,
            scrambleText: { text, chars: 'upperCase', speed: 0.5, revealDelay: 0.2 },
            scrollTrigger: { trigger: el, start: 'top 92%' },
          });
        });

        gsap.utils.toArray<SVGElement>('[data-draw]').forEach((el) => {
          gsap.from(el, {
            drawSVG: '0%', duration: 2.2, ease: 'power2.inOut',
            scrollTrigger: { trigger: el, start: 'top 82%' },
          });
        });

        const path = document.querySelector<SVGPathElement>('[data-path]');
        const mote = document.querySelector<SVGElement>('[data-mote]');
        if (path && mote) {
          gsap.to(mote, { opacity: 1, duration: 0.6, scrollTrigger: { trigger: path, start: 'top 75%' } });
          gsap.to(mote, {
            duration: 22, repeat: -1, ease: 'none',
            motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
          });
        }

        const morphFrom = document.querySelector<SVGPathElement>('[data-morph-from]');
        const morphTo = document.querySelector<SVGPathElement>('[data-morph-to]');
        if (morphFrom && morphTo) {
          gsap.to(morphFrom, {
            morphSVG: morphTo, ease: 'none',
            scrollTrigger: { trigger: morphFrom, start: 'top bottom', end: 'bottom top', scrub: 1 },
          });
        }

        const bar = document.querySelector<HTMLElement>('[data-hide-on-scroll]');
        if (bar) {
          observers.push(
            Observer.create({
              target: window, type: 'wheel,touch,scroll', tolerance: 16,
              onDown: () => gsap.to(bar, { yPercent: -130, opacity: 0, duration: 0.45, ease: 'power2.out' }),
              onUp: () => gsap.to(bar, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }),
            }),
          );
        }

        document.querySelectorAll<HTMLElement>('[data-drag]').forEach((el) => {
          const boundsSel = el.dataset.dragBounds;
          const [d] = Draggable.create(el, {
            type: (el.dataset.dragAxis as 'x,y') ?? 'x,y',
            bounds: boundsSel ? document.querySelector(boundsSel) : undefined,
            inertia: true,
            edgeResistance: 0.72,
            onPress() { gsap.to(this.target, { scale: 1.03, duration: 0.3 }); },
            onRelease() { gsap.to(this.target, { scale: 1, duration: 0.4, ease: 'power2.out' }); },
          });
          draggables.push(d);
        });

        onLink = (e: MouseEvent) => {
          const a = (e.target as HTMLElement)?.closest?.('[data-scroll-link]');
          if (!a) return;
          const href = a.getAttribute('href');
          if (!href?.startsWith('#')) return;
          const target = href === '#top' ? 0 : document.querySelector(href);
          if (target === null) return;
          e.preventDefault();
          if (smoother) smoother.scrollTo(target as Element | number, true, 'top 0px');
          else gsap.to(window, { duration: 1.1, ease: 'power3.inOut', scrollTo: target });
        };
        document.addEventListener('click', onLink);

        ScrollTrigger.refresh();
      } finally {
        // Whatever happened above, nothing stays hidden.
        root.classList.remove('motion-ready');
      }
    });

    return () => {
      if (onLink) document.removeEventListener('click', onLink);
      observers.forEach((o) => o.kill());
      draggables.forEach((d) => d?.kill());
      splits.forEach((s) => s.revert());
      smoother?.kill();
      ctx.revert();
      root.classList.remove('motion-ready');
    };
  }, [smooth]);

  if (!smooth) return <>{children}</>;

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}

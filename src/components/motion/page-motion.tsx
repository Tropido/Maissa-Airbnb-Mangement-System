'use client';

import { useRef } from 'react';

import {
  EASE,
  MOTION_QUERIES,
  Observer,
  ScrollSmoother,
  ScrollTrigger,
  SplitText,
  gsap,
  introPlaying,
  onIntro,
  useGSAP,
} from '@/components/motion/gsap';
import { cn } from '@/lib/utils';

/**
 * Page-scoped motion, driven by data attributes in server-rendered markup:
 *
 *   [data-reveal]            fade + rise on entry (1.1s, power3.out)
 *   [data-split-lines]       SplitText line reveal (1s, 0.09s stagger)
 *   [data-intro]             staggered entrance after the curtain lifts
 *   [data-scramble]          ScrambleText settle (decorative copy only)
 *   [data-draw]              DrawSVG stroke-in
 *   [data-mote]              a dot travelling the [data-path] in its SVG
 *   [data-morph-from/-to]    MorphSVG scrubbed by scroll
 *   [data-hide-on-scroll]    Observer retreat on scroll-down
 *   a[data-scroll-link]      ScrollTo glide to an in-page anchor
 *
 * Everything is scoped to this component's own subtree and owned by one
 * gsap.context: unmounting (or a client-side route change) reverts exactly the
 * tweens, triggers, splits and observers created here — never anyone else's.
 *
 * Always render it inside the page (or a segment template), never in a
 * persistent layout: its effects must run after the markup it rewrites
 * (SplitText, ScrambleText) has hydrated.
 *
 * Content is visible in the server HTML; motion only ever hides something it
 * is about to animate, and skips elements already on screen so nothing
 * flashes. Under prefers-reduced-motion none of the motion is created.
 *
 * `smooth` mounts ScrollSmoother. Only use it on a page with no sticky or
 * fixed descendants: the content wrapper is transformed, which would break
 * both. (The home page qualifies; listings and detail keep native scroll for
 * their sticky header and sticky booking card.)
 */
export function PageMotion({
  children,
  smooth = false,
  className,
}: {
  children: React.ReactNode;
  smooth?: boolean;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const q = <T extends Element = HTMLElement>(sel: string) =>
        Array.from(root.querySelectorAll<T>(sel));
      // Hashes come from the URL, so look them up by id rather than as a CSS
      // selector — `#1` or `#a:b` would make querySelector throw.
      const byHash = (hash: string) => {
        let id = hash.slice(1);
        try {
          id = decodeURIComponent(id);
        } catch {
          // Malformed escape: use it as written.
        }
        const el = id ? document.getElementById(id) : null;
        return el && root.contains(el) ? el : null;
      };

      let smoother: ScrollSmoother | undefined;
      let alive = true;
      const intro = introPlaying();
      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERIES, (ctx) => {
        if (ctx.conditions?.reduce) return;

        const splits: SplitText[] = [];
        const observers: Observer[] = [];
        const unsubs: (() => void)[] = [];

        if (smooth && wrapper.current && content.current) {
          smoother = ScrollSmoother.create({
            wrapper: wrapper.current,
            content: content.current,
            smooth: 1.2,
            effects: false,
            normalizeScroll: false,
          });
          // Arriving on /#section: land on it once the smoother owns scroll.
          const target = byHash(window.location.hash);
          if (target) requestAnimationFrame(() => smoother?.scrollTo(target, false, 'top top'));
        }

        const inView = (el: Element) => ScrollTrigger.isInViewport(el, 0.05);

        // Entrance stagger, tied to the curtain. Without a curtain the
        // content is simply there — no replayed choreography per navigation.
        const introEls = q('[data-intro]');
        if (intro && introEls.length) {
          gsap.set(introEls, { y: 26, opacity: 0 });
          unsubs.push(
            onIntro(() =>
              gsap.to(introEls, { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: EASE, delay: 0.25 }),
            ),
          );
        }

        q('[data-reveal]').forEach((el) => {
          if (el.closest('[data-intro]')) return;
          if (inView(el)) {
            if (!intro) return;
            gsap.set(el, { y: 34, opacity: 0 });
            unsubs.push(onIntro(() => gsap.to(el, { y: 0, opacity: 1, duration: 1.1, ease: EASE, delay: 0.35 })));
            return;
          }
          gsap.from(el, {
            y: 34,
            opacity: 0,
            duration: 1.1,
            ease: EASE,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });

        q('[data-split-lines]').forEach((el) => {
          if (inView(el) && !intro) return;
          // autoSplit re-measures once Archivo has loaded and on resize, so
          // lines are never computed against the fallback face.
          const split = SplitText.create(el, {
            type: 'lines',
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.09,
                ease: EASE,
                scrollTrigger: { trigger: el, start: 'top 85%', once: true },
              });
            },
          });
          splits.push(split);
        });

        q('[data-scramble]').forEach((el) => {
          const text = el.textContent ?? '';
          const run = () =>
            gsap.to(el, {
              duration: 1.1,
              scrambleText: { text, chars: 'upperCase', speed: 0.5, revealDelay: 0.2 },
            });
          unsubs.push(onIntro(run));
        });

        q<SVGGeometryElement>('[data-draw]').forEach((el) => {
          gsap.from(el, {
            drawSVG: '0%',
            duration: 2.4,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          });
        });

        q<SVGElement>('[data-mote]').forEach((mote) => {
          const svg = mote.closest('svg');
          const path = svg?.querySelector<SVGPathElement>('[data-path]');
          if (!svg || !path) return;
          gsap.to(mote, { opacity: 1, duration: 0.6, scrollTrigger: { trigger: svg, start: 'top 70%', once: true } });
          gsap.to(mote, {
            duration: Number(mote.dataset.mote) || 22,
            repeat: -1,
            ease: 'none',
            motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
            // Only travel while the map is on screen.
            scrollTrigger: { trigger: svg, start: 'top bottom', end: 'bottom top', toggleActions: 'play pause resume pause' },
          });
        });

        q<SVGPathElement>('[data-morph-from]').forEach((from) => {
          const to = from.parentElement?.querySelector<SVGPathElement>('[data-morph-to]');
          if (!to) return;
          gsap.to(from, {
            morphSVG: to,
            ease: 'none',
            scrollTrigger: { trigger: from, start: 'top bottom', end: 'bottom top', scrub: 1 },
          });
        });

        const bars = q('[data-hide-on-scroll]');
        if (bars.length) {
          const show = () => gsap.to(bars, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
          const hide = () => gsap.to(bars, { yPercent: -140, opacity: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
          observers.push(
            Observer.create({
              target: window,
              type: 'wheel,touch,scroll',
              tolerance: 14,
              onDown: () => {
                // Never hide a bar that holds keyboard focus.
                if (!bars.some((b) => b.contains(document.activeElement))) hide();
              },
              onUp: show,
            }),
          );
          bars.forEach((b) => b.addEventListener('focusin', show));
          unsubs.push(() => bars.forEach((b) => b.removeEventListener('focusin', show)));
        }

        // Archivo arriving can shift line breaks and section heights.
        document.fonts?.ready.then(() => {
          if (alive) ScrollTrigger.refresh();
        });

        return () => {
          unsubs.forEach((u) => u());
          observers.forEach((o) => o.kill());
          splits.forEach((s) => s.revert());
          smoother?.kill();
          smoother = undefined;
        };
      });

      // Anchor glide. Works with or without the smoother; under reduced motion
      // the browser's own jump is left alone. Listens on the document so links
      // in portalled sheets (the mobile menu) glide too, but only ever to a
      // target inside this page.
      const onClick = (event: MouseEvent) => {
        const link = (event.target as Element | null)?.closest?.('a[data-scroll-link]');
        if (!link) return;
        const href = link.getAttribute('href') ?? '';
        const hash = href.startsWith('#') ? href : href.startsWith('/#') && window.location.pathname === '/' ? href.slice(1) : '';
        if (!hash) return;
        if (window.matchMedia(MOTION_QUERIES.reduce).matches) return;
        const target = hash === '#top' ? null : byHash(hash);
        if (hash !== '#top' && !target) return;
        event.preventDefault();
        const land = () => {
          if (!target) return;
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        };
        if (smoother) {
          smoother.scrollTo(target ?? 0, true, 'top top');
          window.setTimeout(land, 900);
        } else {
          gsap.to(window, { duration: 1.1, ease: 'power3.inOut', scrollTo: target ? { y: target, offsetY: 0 } : 0, onComplete: land });
        }
      };
      document.addEventListener('click', onClick);

      return () => {
        alive = false;
        document.removeEventListener('click', onClick);
        mm.revert();
      };
    },
    { scope, dependencies: [smooth], revertOnUpdate: true },
  );

  if (!smooth) {
    return (
      <div ref={scope} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={scope} className={className}>
      <div ref={wrapper} data-smooth-wrapper>
        <div ref={content} data-smooth-content className={cn('relative')}>
          {children}
        </div>
      </div>
    </div>
  );
}

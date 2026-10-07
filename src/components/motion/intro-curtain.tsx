'use client';

import { useRef } from 'react';

import { INTRO_EVENT, gsap, introPlaying, useGSAP } from '@/components/motion/gsap';
import { BRAND } from '@/lib/tokens';

/**
 * The branded entrance from the references: the mark rises, a rose rule draws
 * out from the centre, then the curtain lifts on `expo.inOut`.
 *
 * Plays once per browser session on whichever page is entered first, never
 * under reduced motion, and never again on client-side navigation — the root
 * layout's intro gate decides before first paint. Timings are trimmed from the
 * prototype (~2.5s) to ~1.7s, and any click or key press skips straight to the
 * page. Without JavaScript a <noscript> rule hides it; if the timeline never
 * runs, a CSS fail-safe removes it at 3.4s.
 */
export function IntroCurtain({ mark = 'Maissa', note = 'Two homes · Tunisia' }: { mark?: string; note?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!introPlaying()) {
        el.style.display = 'none';
        return;
      }

      const finish = () => {
        try {
          sessionStorage.setItem('maissa:intro', '1');
        } catch {
          // Private mode: the intro may replay next session, which is harmless.
        }
        document.documentElement.dataset.intro = 'seen';
      };

      const tl = gsap.timeline({ onComplete: finish });
      tl.from('[data-curtain-mark]', { yPercent: 40, opacity: 0, duration: 0.7, ease: 'power3.out' })
        .fromTo(
          '[data-curtain-line]',
          { drawSVG: '50% 50%' },
          { drawSVG: '0% 100%', duration: 0.8, ease: 'power2.inOut' },
          0.05,
        )
        .from('[data-curtain-note]', { opacity: 0, duration: 0.5 }, 0.3)
        .addLabel('lift', '+=0.15')
        .call(() => document.dispatchEvent(new CustomEvent(INTRO_EVENT)), [], 'lift')
        .to(el, { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, 'lift')
        .set(el, { display: 'none' });

      const skip = () => {
        if (tl.progress() < 1) tl.progress(1);
      };
      window.addEventListener('keydown', skip, { once: true });
      el.addEventListener('pointerdown', skip, { once: true });

      return () => {
        window.removeEventListener('keydown', skip);
        el.removeEventListener('pointerdown', skip);
      };
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      data-intro-curtain
      aria-hidden
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-[26px] bg-ink"
    >
      <p
        data-curtain-mark
        className="m-0 text-[clamp(30px,5vw,58px)] font-normal tracking-[-0.05em] text-ink-foreground"
      >
        {mark}
      </p>
      <svg width="220" height="2" viewBox="0 0 220 2" className="block overflow-visible">
        <line data-curtain-line x1="0" y1="1" x2="220" y2="1" stroke={BRAND.accent} strokeWidth="2" />
      </svg>
      <p
        data-curtain-note
        className="m-0 whitespace-nowrap text-center text-[10.5px] uppercase tracking-[0.28em] text-ink-foreground/50"
      >
        {note}
      </p>
    </div>
  );
}

'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatTND } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

interface ScrollExpandHeroProps {
  listing: Listing;
  eyebrow: string;
  title: string[];
  subtitle: string;
}

/**
 * Scroll-expansion hero. The photo starts inset and grows to full bleed as the
 * visitor scrolls the first viewport; the headline simply fades as it does.
 *
 * Reduced-motion visitors get the expanded end-state immediately, with no
 * scroll-linked movement at all.
 */
export function ScrollExpandHero({ listing, eyebrow, title, subtitle }: ScrollExpandHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const mediaWidth = useTransform(scrollYProgress, [0, 0.85], ['72%', '100%']);
  const mediaHeight = useTransform(scrollYProgress, [0, 0.85], ['58vh', '100vh']);
  const titleOpacity = useTransform(scrollYProgress, [0.2, 0.55], [1, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.55, 0.9], [0, 1]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const style = reduced
    ? { width: '100%', height: '100vh' as const }
    : { width: mediaWidth, height: mediaHeight };

  return (
    <section ref={ref} className="relative h-[200vh]" aria-labelledby="hero-title">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-ink">
        <motion.div
          style={style}
          className="relative flex min-w-[92vw] items-center justify-center overflow-hidden sm:min-w-0"
        >
          <Image
            src={listing.hero_photo_url}
            alt={`${listing.title} in ${listing.location}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-ink/20" />

          <motion.div
            style={reduced ? undefined : { opacity: captionOpacity }}
            className="absolute inset-x-0 bottom-0 z-20 p-[var(--shell-gutter)] pb-10"
          >
            <div className="mx-auto flex max-w-shell flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-bg/70">
                  Flagship home
                </p>
                <p className="mt-3 font-display text-3xl font-medium leading-tight text-ink-foreground sm:text-4xl">
                  {listing.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-bg/70">{listing.summary}</p>
              </div>
              <div className="flex shrink-0 items-center gap-5">
                <p className="text-sm text-ink-foreground">
                  {formatTND(listing.price_per_night)}
                  <span className="text-bg/60"> / night</span>
                </p>
                <Button asChild variant="link" className="text-ink-foreground">
                  <Link href={`/listings/${listing.slug}`}>
                    See the home <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Headline, fading as the photo expands beneath it. */}
        <motion.div
          style={reduced ? undefined : { opacity: titleOpacity }}
          aria-hidden={reduced ? undefined : true}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-[var(--shell-gutter)] text-center"
        >
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-bg/70">
            {eyebrow}
          </p>
          <h1 id="hero-title" className="sr-only">
            {title.join(' ')} — {subtitle}
          </h1>
          <div className="flex flex-col items-center font-display text-display-lg font-normal leading-[0.98] text-bg">
            {title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <p className="mt-6 max-w-md text-sm text-bg/70 sm:text-base">{subtitle}</p>
        </motion.div>

        <motion.div
          style={reduced ? undefined : { opacity: cueOpacity }}
          className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-bg/70"
        >
          <ArrowDown className="size-3 animate-bounce" aria-hidden />
          Scroll
        </motion.div>
      </div>
    </section>
  );
}

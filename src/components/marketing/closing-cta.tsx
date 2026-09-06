import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { AmbientGlow } from '@/components/marketing/ambient-glow';
import { Reveal } from '@/components/motion/reveal';
import type { Listing } from '@/lib/data/types';

interface ClosingCtaProps {
  listing: Listing;
  line: string;
  href: string;
  cta: string;
}

/**
 * Full-bleed closing moment — one photo, one line, one understated link.
 * Replaces the old dark aurora-gradient banner entirely; no boxed CTA here.
 */
export function ClosingCta({ listing, line, href, cta }: ClosingCtaProps) {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <Image
        src={listing.hero_photo_url}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <AmbientGlow onPhoto />
      <div aria-hidden className="absolute inset-0 bg-ink/35" />

      <Reveal className="relative z-10 mx-auto max-w-2xl px-[var(--shell-gutter)] text-center">
        <p className="font-display text-2xl font-normal leading-snug text-bg sm:text-3xl">
          {line}
        </p>
        <Link
          href={href}
          className="mt-8 inline-flex items-center gap-2 text-sm text-bg underline decoration-bg/40 underline-offset-4 transition-colors hover:decoration-bg"
        >
          {cta}
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </Reveal>
    </section>
  );
}

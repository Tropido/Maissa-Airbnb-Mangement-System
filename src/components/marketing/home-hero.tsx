'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import { ListingImage, StudyNote } from '@/components/marketing/listing-image';
import { useAmbientSound } from '@/components/marketing/use-ambient-sound';
import {
  Draggable,
  MOTION_QUERIES,
  SplitText,
  gsap,
  introPlaying,
  onIntro,
  useGSAP,
} from '@/components/motion/gsap';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AMBIENT_PHASES, currentPhase, type AmbientPhase } from '@/lib/tokens';
import { cn, formatTND, numberWord } from '@/lib/utils';
import type { Listing } from '@/lib/data/types';

export const HOME_NAV = [
  { href: '#top', label: 'Home' },
  { href: '#homes', label: 'The homes' },
  { href: '#host', label: 'The host' },
  { href: '#where', label: 'Where' },
  { href: '#contact', label: 'Enquire' },
] as const;

/** Server and first client render agree on this; the real phase lands after mount. */
const DEFAULT_PHASE: AmbientPhase = 'dusk';

function SoundToggle({ on, onToggle, compact = false }: { on: boolean; onToggle: () => void; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      aria-label="Ambient sound"
      className={cn(
        'flex items-center rounded-full border border-ink-foreground/40 bg-ink/65 uppercase text-ink-foreground backdrop-blur-[8px] transition-colors duration-300 hover:bg-ink/80',
        compact ? 'h-[34px] gap-[7px] px-[13px] text-[10px] tracking-[0.14em]' : 'h-[38px] gap-2 px-3.5 text-[11px] tracking-[0.14em]',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'block rounded-full transition-colors duration-300',
          compact ? 'size-[5px]' : 'size-1.5',
          on ? 'bg-accent' : 'bg-ink-foreground/45',
        )}
      />
      <span>{on ? 'Ambience on' : 'Ambience'}</span>
    </button>
  );
}

/**
 * Home hero, translated from `Maissa Home.dc.html`.
 *
 * Desktop (>760px): an inset rounded card over a blurred, dimmed backdrop —
 * photo across the top two-thirds, pill navigation, a blush text panel in the
 * lower left and a draggable tour card in the lower right. Phones get their
 * own composition rather than a squeezed desktop: photo background, centred
 * copy, stacked actions. The inactive variant is `display:none`, so assistive
 * technology only ever meets one heading and one navigation.
 *
 * Accessibility adjustment: the reference scrims (40% at the top of the
 * desktop photo, 14–34% on the phone) assume a dark photograph. Blush text
 * only clears 4.5:1 over a near-white image at ~65% ink, so the scrims and the
 * chip / Operator backings are set to that — legible whatever photo lands.
 */
export function HomeHero({ listing, homesCount }: { listing?: Listing; homesCount: number }) {
  const root = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<AmbientPhase>(DEFAULT_PHASE);
  const sound = useAmbientSound();
  const glow = AMBIENT_PHASES[phase];
  const tourStill = listing?.gallery_urls[0] ?? listing?.hero_photo_url;

  // The visitor's clock, not the server's — resolved after hydration.
  useEffect(() => {
    const tick = () => setPhase(currentPhase());
    const id = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 5 * 60_000);
    return () => {
      window.clearTimeout(id);
      window.clearInterval(interval);
    };
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERIES, (ctx) => {
        const reduce = Boolean(ctx.conditions?.reduce);
        const drags: Draggable[] = [];
        const cleanups: (() => void)[] = [];

        // Bounded drag for the tour card; inertia only when motion is welcome.
        const card = el.querySelector<HTMLElement>('[data-drag-card]');
        const bounds = el.querySelector<HTMLElement>('[data-hero-card]');
        if (card && bounds) {
          drags.push(
            ...Draggable.create(card, {
              type: 'x,y',
              bounds,
              inertia: !reduce,
              edgeResistance: 0.72,
              onPress() {
                if (!reduce) gsap.to(this.target, { scale: 1.03, duration: 0.3 });
              },
              onRelease() {
                if (!reduce) gsap.to(this.target, { scale: 1, duration: 0.4, ease: 'power2.out' });
              },
            }),
          );
        }

        if (reduce) return () => drags.forEach((d) => d.kill());

        // Ambient warmth that trails the pointer (fine pointers only).
        const warmth = el.querySelector<HTMLElement>('[data-warmth]');
        if (warmth && window.matchMedia('(pointer: fine)').matches) {
          const toX = gsap.quickTo(warmth, 'x', { duration: 1.1, ease: 'power3.out' });
          const toY = gsap.quickTo(warmth, 'y', { duration: 1.1, ease: 'power3.out' });
          const onMove = (e: PointerEvent) => {
            toX(e.clientX);
            toY(e.clientY);
            gsap.to(warmth, { opacity: 1, duration: 0.6, overwrite: 'auto' });
          };
          window.addEventListener('pointermove', onMove, { passive: true });
          cleanups.push(() => window.removeEventListener('pointermove', onMove));
        }

        // Coordinated introduction, only behind the first-visit curtain.
        if (introPlaying()) {
          const cards = el.querySelectorAll('[data-hero-card], [data-hero-mobile-card]');
          gsap.set(cards, { scale: 0.94, opacity: 0 });
          const title = el.querySelector<HTMLElement>('[data-hero-title]');
          let split: SplitText | undefined;
          if (title) {
            split = SplitText.create(title, { type: 'lines,chars' });
            gsap.set(split.chars, { yPercent: 110, opacity: 0 });
          }
          cleanups.push(
            onIntro(() => {
              gsap.to(cards, { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out' });
              if (split) {
                gsap.to(split.chars, {
                  yPercent: 0,
                  opacity: 1,
                  duration: 0.9,
                  stagger: 0.014,
                  ease: 'power4.out',
                  delay: 0.2,
                  onComplete: () => split?.revert(),
                });
              }
            }),
          );
          cleanups.push(() => split?.revert());
        }

        return () => {
          cleanups.forEach((c) => c());
          drags.forEach((d) => d.kill());
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  // Settle the time-of-day chip into its label.
  useGSAP(
    () => {
      const chip = root.current?.querySelector<HTMLElement>('[data-phase]');
      if (!chip || window.matchMedia(MOTION_QUERIES.reduce).matches) return;
      gsap.to(chip, {
        duration: 1.1,
        scrambleText: { text: AMBIENT_PHASES[phase].label, chars: 'upperCase', speed: 0.5, revealDelay: 0.2 },
      });
    },
    { scope: root, dependencies: [phase] },
  );

  const glowBase = 'pointer-events-none absolute rounded-full opacity-90 blur-[10px]';

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="theme-dark relative min-h-screen overflow-hidden bg-ink p-2.5 min-[761px]:p-[clamp(10px,2.2vw,26px)]"
    >
      {/* Ambient backdrop: the photograph, blurred and dimmed, plus time-of-day glow. */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {listing ? (
          <div className="absolute inset-[-6%] [filter:blur(3px)_saturate(.8)_brightness(.6)]">
            <ListingImage src={listing.hero_photo_url} alt="" sizes="100vw" priority />
          </div>
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(26_10_15/.55),rgb(26_10_15/.28)_40%,rgb(26_10_15/.7))]" />
        <div
          className={cn(glowBase, '-left-[14%] -top-[24%] size-[66vw] motion-safe:animate-drift1')}
          style={{ background: `radial-gradient(circle, ${glow.a}, transparent 62%)` }}
        />
        <div
          className={cn(glowBase, '-bottom-[28%] -right-[12%] size-[58vw] motion-safe:animate-drift2')}
          style={{ background: `radial-gradient(circle, ${glow.b}, transparent 64%)` }}
        />
        <div
          data-warmth
          className="pointer-events-none absolute left-0 top-0 -ml-[22vmax] -mt-[22vmax] size-[44vmax] rounded-full bg-[radial-gradient(circle,rgb(201_143_160/.2),transparent_62%)] opacity-0 will-change-transform"
        />
      </div>

      {/* ---------------- Desktop composition ---------------- */}
      <div className="relative hidden min-[761px]:block">
        <div
          data-hero-card
          className="relative h-[calc(100vh-clamp(20px,4.4vw,52px))] min-h-[640px] w-full overflow-hidden rounded-[clamp(20px,2.2vw,30px)] bg-bg shadow-hero"
        >
          <div className="absolute inset-x-0 top-0 h-[66%] overflow-hidden bg-bg-deep">
            {listing ? (
              <>
                <ListingImage src={listing.hero_photo_url} alt={`${listing.title}, ${listing.location}`} sizes="(max-width: 760px) 1px, 100vw" priority />
                <StudyNote src={listing.hero_photo_url} className="left-[clamp(18px,2vw,28px)] top-[104px]" />
              </>
            ) : null}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(26_10_15/.66),rgb(26_10_15/.6)_17%,rgb(26_10_15/0)_42%,rgb(26_10_15/.06))]"
            />
          </div>

          <header
            data-hide-on-scroll
            className="absolute inset-x-0 top-0 z-[4] flex items-center justify-between gap-6 px-[clamp(18px,2vw,28px)] py-[22px]"
          >
            <a href="#top" data-scroll-link className="text-[20px] font-medium tracking-[-0.035em] text-ink-foreground hover:text-ink-foreground">
              Maissa
            </a>
            <nav
              aria-label="Main"
              className="flex items-center gap-0.5 rounded-full bg-bg p-[7px] shadow-pill"
            >
              {HOME_NAV.map((item, i) => (
                <a
                  key={item.href}
                  href={item.href}
                  data-scroll-link
                  aria-current={i === 0 ? 'page' : undefined}
                  className={cn(
                    'block rounded-full px-[18px] py-[9px] text-sm tracking-[-0.01em] transition-colors duration-300',
                    i === 0 ? 'bg-ink/[.07] text-ink' : 'text-muted-soft hover:bg-ink/5 hover:text-ink',
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="block rounded-full border border-ink-foreground/50 bg-ink/65 px-5 py-[11px] text-[13.5px] tracking-[-0.01em] text-ink-foreground backdrop-blur-[8px] transition-colors duration-300 hover:bg-ink-foreground hover:text-ink"
              >
                Operator
              </Link>
              <a
                href="#contact"
                data-scroll-link
                className="block rounded-full bg-bg px-[22px] py-[11px] text-[13.5px] tracking-[-0.01em] text-ink transition-opacity duration-300 hover:text-ink hover:opacity-[.82]"
              >
                Enquire
              </a>
            </div>
          </header>

          <div className="absolute right-[clamp(18px,2vw,28px)] top-24 z-[4] flex flex-col items-end gap-2">
            <SoundToggle on={sound.on} onToggle={sound.toggle} />
            <p className="m-0 flex h-[38px] items-center rounded-full bg-ink/65 px-3.5 text-[11px] uppercase tracking-[0.14em] text-ink-foreground backdrop-blur-[8px]">
              <span className="sr-only">Light in Tunisia: </span>
              <span key={phase} data-phase>
                {glow.label}
              </span>
            </p>
          </div>

          <div className="absolute bottom-0 left-0 z-[2] w-[min(57%,760px)] rounded-tr-[clamp(20px,2.2vw,30px)] bg-bg pb-[clamp(28px,3vw,42px)] pl-[clamp(24px,2.6vw,40px)] pr-[clamp(30px,3.4vw,52px)] pt-[clamp(28px,3vw,44px)]">
            <h1
              id="hero-title"
              data-hero-title
              className="m-0 text-balance text-[clamp(34px,5.1vw,74px)] font-normal leading-[.96] tracking-[-0.05em] text-ink"
            >
              Where the Light
              <br />
              Stays Longer.
            </h1>
            <div className="mt-[clamp(22px,2.6vw,36px)] flex flex-wrap items-center gap-[clamp(14px,1.8vw,26px)]">
              <p className="m-0 text-[13px] leading-[1.35] tracking-[-0.01em] text-ink">
                {numberWord(homesCount)}
                <br />
                {homesCount === 1 ? 'home' : 'homes'}
              </p>
              <span aria-hidden className="block h-[34px] w-px bg-ink/[.18]" />
              <p className="m-0 max-w-[340px] text-pretty text-[12.5px] leading-[1.55] text-muted-fg">
                A courtyard villa in Djerba and a terrace loft in Ezzahra — renovated and hosted by
                Maissa. Photographed at the hour they actually look like that.
              </p>
              <a
                href="#contact"
                data-scroll-link
                className="inline-flex h-12 items-center gap-2.5 whitespace-nowrap rounded-full bg-ink px-[26px] text-[13.5px] tracking-[-0.01em] text-ink-foreground transition-colors duration-300 hover:bg-ink-raised hover:text-ink-foreground"
              >
                Check availability
              </a>
            </div>
          </div>

          {listing ? (
            <figure
              data-drag-card
              className="absolute bottom-[clamp(18px,2vw,28px)] right-[clamp(18px,2vw,28px)] z-[3] m-0 w-[clamp(250px,22vw,306px)] cursor-grab touch-none rounded-[18px] bg-bg px-[11px] pb-[15px] pt-[11px] shadow-float active:cursor-grabbing"
            >
              <div className="relative h-[132px] overflow-hidden rounded-[11px] bg-ink">
                {tourStill ? <ListingImage src={tourStill} alt="" sizes="306px" /> : null}
                <Link
                  href={`/listings/${listing.slug}#walk-around`}
                  aria-label={`Walk around ${listing.title}`}
                  className="absolute bottom-[9px] right-[9px] flex size-[30px] items-center justify-center rounded-full bg-bg pl-0.5 text-[10px] text-ink hover:text-ink"
                >
                  <span aria-hidden>&#9654;</span>
                </Link>
              </div>
              <figcaption>
                <p className="mb-0 mt-[13px] flex items-center gap-[7px] text-[14.5px] tracking-[-0.02em] text-ink">
                  {listing.title}
                  <span
                    aria-hidden
                    className="inline-flex size-[15px] items-center justify-center rounded-full bg-ink text-[9.5px] font-medium text-ink-foreground"
                  >
                    i
                  </span>
                </p>
                <p className="mb-0 mt-[9px] text-[11px] leading-normal text-muted-soft">
                  {listing.location}. {formatTND(listing.price_per_night)} a night.{' '}
                  <span aria-hidden>Drag me.</span>
                </p>
              </figcaption>
            </figure>
          ) : null}
        </div>
      </div>

      {/* ---------------- Phone composition ---------------- */}
      <div className="relative min-[761px]:hidden">
        <div
          data-hero-mobile-card
          className="relative flex min-h-[calc(100svh-20px)] w-full flex-col overflow-hidden rounded-[26px] bg-ink shadow-hero-mobile"
        >
          <div className="absolute inset-0">
            {listing ? (
              <ListingImage src={listing.hero_photo_url} alt={`${listing.title}, ${listing.location}`} sizes="(max-width: 760px) 100vw, 1px" priority />
            ) : null}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(26_10_15/.66),rgb(26_10_15/.62)_30%,rgb(26_10_15/.68)_58%,rgb(26_10_15/.86))]"
            />
          </div>

          <div className="relative z-[2] flex items-center justify-between gap-3 px-5 pt-5">
            <span className="text-[17px] font-medium tracking-[-0.03em] text-ink-foreground">Maissa</span>
            <div className="flex items-center gap-2">
              <SoundToggle compact on={sound.on} onToggle={sound.toggle} />
              <Sheet>
                <SheetTrigger
                  aria-label="Open menu"
                  className="flex size-[34px] items-center justify-center rounded-full border border-ink-foreground/40 bg-ink/65 text-ink-foreground"
                >
                  <Menu className="size-4" aria-hidden />
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetTitle className="text-[22px] font-normal tracking-[-0.03em]">Maissa</SheetTitle>
                  <SheetDescription className="mt-1 text-[12.5px] text-muted-fg">
                    {numberWord(homesCount)} {homesCount === 1 ? 'home' : 'homes'} in Tunisia
                  </SheetDescription>
                  <nav aria-label="Mobile" className="mt-8 flex flex-col">
                    {HOME_NAV.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <a
                          href={item.href}
                          data-scroll-link
                          className="border-b border-ink/10 py-4 text-[22px] tracking-[-0.03em] text-ink hover:text-primary"
                        >
                          {item.label}
                        </a>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="mt-auto flex flex-col gap-2.5 pt-8">
                    <SheetClose asChild>
                      <Link
                        href="/listings"
                        className="flex h-14 items-center justify-center rounded-2xl bg-ink text-[15px] text-ink-foreground hover:text-ink-foreground"
                      >
                        All homes
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/login"
                        className="flex h-12 items-center justify-center rounded-2xl border border-ink/20 text-[13.5px] text-ink"
                      >
                        Operator sign-in
                      </Link>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="relative z-[2] flex flex-1 flex-col items-center justify-center px-[30px] py-14 text-center">
            <p className="m-0 text-[21px] font-light tracking-[-0.02em] text-ink-foreground/95">
              Come and stay where
            </p>
            <h1 className="mb-0 mt-0.5 text-[clamp(38px,12vw,52px)] font-medium leading-none tracking-[-0.045em] text-ink-foreground">
              the light stays
            </h1>
            <p className="mb-0 mt-5 max-w-[250px] text-[13.5px] leading-[1.6] text-ink-foreground/90">
              {numberWord(homesCount)} design-forward {homesCount === 1 ? 'home' : 'homes'} in Tunisia,
              honestly photographed and answered within the hour.
            </p>
          </div>

          <div className="relative z-[2] flex flex-col gap-2.5 px-[18px] pb-[18px]">
            <a
              href="#homes"
              data-scroll-link
              className="flex h-14 items-center justify-center rounded-2xl bg-bg text-[15px] tracking-[-0.01em] text-ink hover:text-ink"
            >
              Explore the homes
            </a>
            <a
              href="#contact"
              data-scroll-link
              className="flex h-12 items-center justify-center rounded-2xl border border-ink-foreground/30 bg-ink-foreground/[.14] text-[13.5px] tracking-[-0.01em] text-ink-foreground hover:text-ink-foreground"
            >
              Enquire
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ContactSection } from '@/components/marketing/contact-section';
import { HomeHero } from '@/components/marketing/home-hero';
import { FaqSection, HostSection, PromiseSection, WhereSection } from '@/components/marketing/home-sections';
import { HomesShowcase } from '@/components/marketing/homes-showcase';
import { SiteFooter } from '@/components/marketing/site-footer';
import { IntroCurtain } from '@/components/motion/intro-curtain';
import { PageMotion } from '@/components/motion/page-motion';
import { getHost, getPublicListings } from '@/lib/data/queries';
import { BRAND } from '@/lib/tokens';
import { numberWord } from '@/lib/utils';

/**
 * Home — `Maissa Redesign/Maissa Home.dc.html`, in the reference's order:
 * hero, promise, both homes, host, where, FAQ, enquire, footer.
 *
 * ScrollSmoother runs here only: nothing on this page is sticky or fixed
 * inside the smoothed content (the curtain sits outside it).
 */
export default async function HomePage() {
  const [host, listings] = await Promise.all([getHost(), getPublicListings()]);
  const featured = listings.find((l) => l.status === 'featured') ?? listings[0];

  return (
    <>
      <IntroCurtain mark="Maissa" note={`${numberWord(listings.length)} homes · Tunisia`} />
      <PageMotion smooth className="bg-ink">
        <HomeHero listing={featured} homesCount={listings.length} />

        <main
          id="main"
          className="relative z-[5] -mt-3.5 overflow-hidden rounded-t-[clamp(20px,2.4vw,34px)] bg-bg"
        >
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden className="block h-11 w-full">
            <path
              data-morph-from
              d="M0 60 C240 10 480 54 720 26 C960 -2 1200 46 1440 14 L1440 60 Z"
              fill={BRAND.ink}
              opacity="0.06"
            />
            <path
              data-morph-to
              d="M0 60 C240 46 480 6 720 40 C960 58 1200 8 1440 44 L1440 60 Z"
              fill="none"
              visibility="hidden"
            />
          </svg>

          <PromiseSection />
          <HomesShowcase listings={listings} />
          <HostSection host={host} homesCount={listings.length} />
          <WhereSection listings={listings} />
          <FaqSection />
          <ContactSection listings={listings} />
        </main>
        {/* Outside <main> so it stays the page's contentinfo landmark. */}
        <SiteFooter listings={listings} />
      </PageMotion>
    </>
  );
}

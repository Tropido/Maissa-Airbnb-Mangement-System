import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { MotionProvider } from '@/components/motion/motion-provider';
import { SmoothScroll } from '@/components/motion/smooth-scroll';
import { getPublicListings } from '@/lib/data/queries';

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const listings = await getPublicListings();

  return (
    <MotionProvider>
      <SmoothScroll />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col overflow-x-clip">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter listings={listings} />
      </div>
    </MotionProvider>
  );
}

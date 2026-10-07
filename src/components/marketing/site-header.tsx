'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Menu } from 'lucide-react';

import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/listings', label: 'The homes' },
  { href: '/#host', label: 'The host' },
];

/**
 * Sticky blush header for the inner marketing pages.
 *
 *   listings  brand · pill nav · Enquire (menu sheet on phones)
 *   detail    brand · "← Both homes"
 *
 * It retreats on scroll-down and returns on scroll-up (PageMotion's
 * Observer), and comes back whenever it receives keyboard focus.
 */
export function SiteHeader({
  variant = 'listings',
  backLabel = 'All homes',
}: {
  variant?: 'listings' | 'detail';
  backLabel?: string;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : !href.includes('#') && pathname.startsWith(href));

  return (
    <header
      data-hide-on-scroll
      className="sticky top-0 z-20 border-b border-ink/10 bg-bg/[.86] backdrop-blur-[14px]"
    >
      <div
        className={cn(
          'mx-auto flex max-w-site items-center justify-between gap-5 px-gutter',
          variant === 'detail' ? 'py-[15px]' : 'py-4',
        )}
      >
        <Link href="/" className="text-[19px] font-medium tracking-[-0.035em] text-ink">
          Maissa
        </Link>

        {variant === 'detail' ? (
          <Link href="/listings" className="inline-flex items-center gap-1.5 text-[13px] text-muted-fg">
            <ArrowLeft className="size-3.5" aria-hidden />
            {backLabel}
          </Link>
        ) : (
          <>
            <nav
              aria-label="Main"
              className="hidden items-center gap-0.5 rounded-full border border-ink/[.08] bg-bg-raised p-1.5 min-[640px]:flex"
            >
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-4 py-2 text-[13.5px] transition-colors duration-300',
                    isActive(item.href) ? 'bg-ink/[.07] text-ink' : 'text-muted-soft hover:bg-ink/5 hover:text-ink',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href="/#contact"
                className="inline-flex h-[42px] items-center whitespace-nowrap rounded-full bg-ink px-[22px] text-[13px] text-ink-foreground transition-colors duration-300 hover:bg-ink-raised hover:text-ink-foreground"
              >
                Enquire
              </Link>
              <Sheet>
                <SheetTrigger
                  aria-label="Open menu"
                  className="flex size-[42px] items-center justify-center rounded-full border border-ink/15 text-ink min-[640px]:hidden"
                >
                  <Menu className="size-4" aria-hidden />
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetTitle className="text-[22px] font-normal tracking-[-0.03em]">Maissa</SheetTitle>
                  <nav aria-label="Mobile" className="mt-8 flex flex-col">
                    {NAV.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isActive(item.href) ? 'page' : undefined}
                          className="border-b border-ink/10 py-4 text-[22px] tracking-[-0.03em] text-ink hover:text-primary"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="mt-auto flex flex-col gap-2.5 pt-8">
                    <SheetClose asChild>
                      <Link
                        href="/#contact"
                        className="flex h-14 items-center justify-center rounded-2xl bg-ink text-[15px] text-ink-foreground hover:text-ink-foreground"
                      >
                        Enquire
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
          </>
        )}
      </div>
    </header>
  );
}

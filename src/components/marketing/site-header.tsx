'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu } from 'lucide-react';

import { LiveClock } from '@/components/marketing/live-clock';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/listings', label: 'The homes' },
  { href: '/#host', label: 'The host' },
  { href: '/#map', label: 'Where' },
  { href: '/#contact', label: 'Enquire' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href.startsWith('/#') ? false : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-[background-color,border-color] duration-300',
        scrolled ? 'border-b border-muted/40 bg-bg/95 backdrop-blur' : 'border-b border-transparent',
      )}
    >
      <div className="shell flex h-20 items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-display text-xl font-normal tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
          >
            Maissa
          </Link>
          <LiveClock />
        </div>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative px-3 py-2 text-sm tracking-tight transition-colors hover:text-ink',
                isActive(item.href) ? 'text-ink' : 'text-muted-fg',
              )}
            >
              {item.label}
              {isActive(item.href) ? (
                <span aria-hidden className="absolute inset-x-3 -bottom-0.5 h-px bg-primary" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="link" size="sm" className="hidden sm:inline-flex">
            <Link href="/#contact">
              Check availability <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="font-display text-2xl font-normal">Menu</SheetTitle>
              <nav aria-label="Mobile" className="mt-10 flex flex-col">
                {NAV.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="border-b border-muted/40 py-5 font-display text-2xl font-normal transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3 pt-8">
                <SheetClose asChild>
                  <Button asChild size="lg">
                    <Link href="/#contact">Check availability</Link>
                  </Button>
                </SheetClose>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard">Operator dashboard</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

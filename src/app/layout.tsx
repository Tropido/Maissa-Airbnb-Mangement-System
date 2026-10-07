import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';

import { BRAND } from '@/lib/tokens';

import './globals.css';

/**
 * Archivo, as specified by every reference page — light/regular display
 * weights with tight tracking. One family for the whole product.
 */
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Maissa — Two design-forward homes in Tunisia',
    template: '%s — Maissa',
  },
  description:
    'A courtyard villa in Djerba and a terrace loft in Ezzahra, renovated and hosted by Maissa. Photographed honestly, managed by one team.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Maissa',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: BRAND.ink,
  width: 'device-width',
  initialScale: 1,
};

/**
 * Decides, before first paint, whether the branded entrance plays. It runs
 * once per browser session and never under reduced motion; everything else
 * (repeat visits, client-side navigation) renders straight to content.
 * The attribute is read by CSS, so a failed script can only ever hide the
 * curtain, never strand someone behind it.
 */
const INTRO_GATE = `try{var d=document.documentElement;if(sessionStorage.getItem('maissa:intro')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.intro='seen'}else{d.dataset.intro='play'}}catch(e){document.documentElement.dataset.intro='seen'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The intro gate writes data-intro on <html> before hydration.
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
        <noscript>
          <style>{'[data-intro-curtain]{display:none!important}'}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import { Fraunces, Geist } from 'next/font/google';

import { BRAND } from '@/lib/tokens';

import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Maissa — Design-forward stays in Tunisia',
    template: '%s — Maissa',
  },
  description:
    'A small portfolio of personally renovated homes across Djerba, Hammamet, Sidi Bou Said and Tabarka. Photographed honestly, managed by one team.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Maissa',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: BRAND.bg,
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}

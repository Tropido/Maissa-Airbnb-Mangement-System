import type { Metadata } from 'next';

import { LoginView } from '@/components/dashboard/login-view';
import { IntroCurtain } from '@/components/motion/intro-curtain';
import { PageMotion } from '@/components/motion/page-motion';
import { getPublicListings } from '@/lib/data/queries';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export const metadata: Metadata = {
  title: 'Operator sign-in',
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const listings = await getPublicListings();
  const featured = listings.find((l) => l.status === 'featured') ?? listings[0];

  return (
    <>
      <IntroCurtain mark="Maissa" note="Operator sign-in" />
      <PageMotion>
        <LoginView
          imageSrc={featured?.hero_photo_url}
          homesCount={listings.length}
          configured={isSupabaseConfigured}
        />
      </PageMotion>
    </>
  );
}

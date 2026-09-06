import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-16">
      <div className="w-full max-w-lg bg-bg-raised p-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">404</p>
        <h1 className="mt-4 font-display text-display-md font-normal">Nothing here.</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-fg">
          That page does not exist. The four homes and the operator dashboard are both a click away.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="md">
            <Link href="/">Back to the site</Link>
          </Button>
          <Button asChild variant="outline" size="md">
            <Link href="/listings">See the homes</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

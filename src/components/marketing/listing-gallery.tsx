'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Listing gallery: a hero frame plus a thumbnail rail, with a full-screen
 * lightbox. Arrow keys page through the lightbox; Escape closes it (Radix).
 */
export function ListingGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const total = images.length;
  const go = useCallback(
    (delta: number) => setIndex((i) => (((i + delta) % total) + total) % total),
    [total],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go]);

  if (!total) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="grid gap-3 lg:grid-cols-[1.9fr_1fr]">
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="group relative aspect-[4/3] w-full overflow-hidden bg-bg-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 lg:aspect-auto lg:h-[32rem]"
            aria-label={`Open gallery for ${title}, image ${index + 1} of ${total}`}
          >
            <Image
              src={images[index]}
              alt={`${title}, view ${index + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 62vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-bg/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-ink">
              <Expand className="size-3" aria-hidden />
              {index + 1} / {total}
            </span>
          </button>
        </Dialog.Trigger>

        <ul className="no-scrollbar grid grid-cols-3 gap-3 lg:max-h-[32rem] lg:grid-cols-2 lg:content-start lg:overflow-y-auto">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show view ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'relative aspect-[4/3] w-full overflow-hidden transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2',
                  i === index ? 'opacity-100 ring-2 ring-primary' : 'opacity-70 hover:opacity-100',
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 30vw, 18vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/90 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col p-4 focus:outline-none sm:p-8">
          <Dialog.Title className="sr-only">{title} gallery</Dialog.Title>
          <Dialog.Description className="sr-only">
            Image {index + 1} of {total}. Use the left and right arrow keys to move between images.
          </Dialog.Description>

          <div className="flex items-center justify-between">
            <p className="rounded-full bg-bg/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-ink">
              {title} — {index + 1} / {total}
            </p>
            <Dialog.Close
              aria-label="Close gallery"
              className="flex size-11 items-center justify-center rounded-full bg-bg/90 text-ink transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bg"
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>

          <div className="relative mt-4 flex-1">
            <Image
              src={images[index]}
              alt={`${title}, view ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="flex size-11 items-center justify-center rounded-full bg-bg/90 text-ink transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bg"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="flex size-11 items-center justify-center rounded-full bg-bg/90 text-ink transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bg"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

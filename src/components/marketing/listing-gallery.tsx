'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import { ListingImage, StudyNote } from '@/components/marketing/listing-image';
import { cn } from '@/lib/utils';

function Tile({
  src,
  index,
  title,
  total,
  onOpen,
  className,
  sizes,
  priority = false,
}: {
  src: string;
  index: number;
  title: string;
  total: number;
  onOpen: (index: number) => void;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open ${title}, image ${index + 1} of ${total}`}
      className={cn('group relative block min-w-0 overflow-hidden bg-bg-deep', className)}
    >
      <ListingImage
        src={src}
        alt=""
        sizes={sizes}
        priority={priority}
        className="transition-transform duration-700 ease-quiet group-hover:scale-[1.03]"
      />
    </button>
  );
}

/**
 * Detail gallery in the reference arrangement — a large 16:10 frame, two
 * stacked images beside it and a row of 3:2 thumbnails — with the existing
 * full-screen lightbox behind every tile: arrow keys and on-screen arrows page
 * through, a horizontal swipe does the same on touch, Escape closes and focus
 * returns to the tile (Radix Dialog).
 */
export function ListingGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const swipe = useRef<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const total = images.length;
  const go = useCallback((delta: number) => setIndex((i) => (((i + delta) % total) + total) % total), [total]);

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

  const openAt = (i: number) => {
    // Tiles are not Radix triggers, so remember which one to hand focus back to.
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIndex(i);
    setOpen(true);
  };

  const [hero, ...rest] = images;
  const stacked = rest.slice(0, 2);
  const thumbs = rest.slice(2, 6);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div
        data-reveal
        className="mt-[clamp(24px,3vw,40px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3"
      >
        <div className={cn('relative min-w-0', stacked.length ? 'min-[560px]:col-span-2' : 'col-span-full')}>
          <Tile
            src={hero}
            index={0}
            title={title}
            total={total}
            onOpen={openAt}
            priority
            sizes="(max-width: 900px) 100vw, 66vw"
            className="aspect-[16/10] w-full rounded-[22px]"
          />
          <StudyNote src={hero} className="bottom-4 left-4" />
        </div>
        {stacked.length ? (
          <div className="grid min-w-0 grid-rows-2 gap-3">
            {stacked.map((src, i) => (
              <Tile
                key={src}
                src={src}
                index={i + 1}
                title={title}
                total={total}
                onOpen={openAt}
                sizes="(max-width: 900px) 100vw, 33vw"
                className="h-full min-h-[120px] w-full rounded-[22px]"
              />
            ))}
          </div>
        ) : null}
      </div>
      {thumbs.length ? (
        <div
          data-reveal
          className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-3"
        >
          {thumbs.map((src, i) => (
            <Tile
              key={src}
              src={src}
              index={i + 3}
              title={title}
              total={total}
              onOpen={openAt}
              sizes="(max-width: 700px) 50vw, 25vw"
              className="aspect-[3/2] w-full rounded-2xl"
            />
          ))}
        </div>
      ) : null}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[150] bg-ink/[.92] backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          onCloseAutoFocus={(event) => {
            if (!opener.current) return;
            event.preventDefault();
            opener.current.focus();
          }}
          className="theme-dark fixed inset-0 z-[151] flex flex-col p-4 duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:p-8">
          <Dialog.Title className="sr-only">{title} gallery</Dialog.Title>
          <Dialog.Description className="sr-only">
            Image {index + 1} of {total}. Use the arrow keys or swipe to move between images.
          </Dialog.Description>

          <div className="flex items-center justify-between gap-4">
            <p className="m-0 rounded-full bg-ink-foreground/10 px-3.5 py-2 text-[10.5px] uppercase tracking-[0.16em] text-ink-foreground/85">
              {title} — {index + 1} / {total}
            </p>
            <Dialog.Close
              aria-label="Close gallery"
              className="flex size-11 items-center justify-center rounded-full bg-ink-foreground text-ink transition-opacity duration-300 hover:opacity-85"
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>

          <div
            className="relative mt-4 flex-1 touch-pan-y"
            onPointerDown={(e) => {
              swipe.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (swipe.current === null) return;
              const dx = e.clientX - swipe.current;
              swipe.current = null;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            }}
            onPointerCancel={() => {
              swipe.current = null;
            }}
          >
            <ListingImage
              key={images[index]}
              src={images[index]}
              alt={`${title}, view ${index + 1} of ${total}`}
              sizes="100vw"
              className="select-none object-contain"
              draggable={false}
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="flex size-11 items-center justify-center rounded-full border border-ink-foreground/30 text-ink-foreground transition-colors duration-300 hover:bg-ink-foreground hover:text-ink"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="flex size-11 items-center justify-center rounded-full border border-ink-foreground/30 text-ink-foreground transition-colors duration-300 hover:bg-ink-foreground hover:text-ink"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

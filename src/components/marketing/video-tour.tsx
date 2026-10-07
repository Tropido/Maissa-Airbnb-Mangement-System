import type { Listing } from '@/lib/data/types';

/**
 * Home-tour video slot. Set `video_tour_url` on the listing and the player
 * replaces the placeholder — no code change. Accepts a YouTube or Vimeo
 * watch/share URL, or a direct MP4. Until then the slot says plainly that no
 * tour exists; nothing stands in for it.
 */
function toEmbed(url: string): { kind: 'iframe' | 'video'; src: string } {
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (youtube) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${youtube[1]}` };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}` };
  return { kind: 'video', src: url };
}

export function VideoTour({ listing }: { listing: Listing }) {
  if (!listing.video_tour_url) {
    return (
      <div className="mt-[18px] flex flex-wrap items-center gap-[18px] rounded-[20px] border border-dashed border-ink/[.22] bg-bg-raised p-[26px]">
        <span aria-hidden className="flex size-11 items-center justify-center rounded-full bg-ink/[.07] pl-0.5 text-xs text-ink">
          &#9654;
        </span>
        <p className="m-0 max-w-[46ch] text-[13.5px] leading-[1.65] text-muted-fg">
          No tour filmed for this house yet. When one exists it plays here — nothing fake stands in
          for it in the meantime.
        </p>
      </div>
    );
  }

  const embed = toEmbed(listing.video_tour_url);

  return (
    <div className="relative mt-[18px] aspect-video w-full overflow-hidden rounded-[22px] bg-ink">
      {embed.kind === 'iframe' ? (
        <iframe
          src={embed.src}
          title={`Home tour of ${listing.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="size-full"
        />
      ) : (
        <video src={embed.src} controls preload="none" poster={listing.hero_photo_url} className="size-full object-cover" />
      )}
    </div>
  );
}

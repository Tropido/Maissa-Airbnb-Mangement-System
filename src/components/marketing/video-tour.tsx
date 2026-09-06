import { Film } from 'lucide-react';

import type { Listing } from '@/lib/data/types';

/**
 * Home-tour video slot. This is the socket the photo-to-video output plugs into:
 * set `video_tour_url` on the listing and the player replaces the placeholder,
 * no code change.
 *
 * Accepts a YouTube or Vimeo watch/share URL, or a direct MP4.
 */
function toEmbed(url: string): { kind: 'iframe' | 'video'; src: string } {
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  );
  if (youtube) {
    return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${youtube[1]}` };
  }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}` };
  return { kind: 'video', src: url };
}

export function VideoTour({ listing }: { listing: Listing }) {
  if (!listing.video_tour_url) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 border border-dashed border-muted bg-bg-sunken p-8 text-center">
        <Film className="size-6 text-muted-fg" aria-hidden />
        <p className="font-display text-lg font-normal">Home tour coming</p>
        <p className="max-w-sm text-sm leading-relaxed text-muted-fg">
          The walkthrough film for {listing.title} is in production. It will appear here as soon as
          it is cut.
        </p>
      </div>
    );
  }

  const embed = toEmbed(listing.video_tour_url);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-ink">
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
        // eslint-disable-next-line jsx-a11y/media-has-caption -- captions ship with the film when it is delivered
        <video
          src={embed.src}
          controls
          preload="none"
          poster={listing.hero_photo_url}
          className="size-full object-cover"
        />
      )}
    </div>
  );
}

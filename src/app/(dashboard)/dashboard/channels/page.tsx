import type { Metadata } from 'next';

import { NotInThisBuild } from '@/components/dashboard/not-in-this-build';

export const metadata: Metadata = { title: 'Channels' };

export default function ChannelsPage() {
  return (
    <NotInThisBuild
      eyebrow="Distribution"
      title="Channels"
      summary="Airbnb, Booking.com and direct bookings already flow into the calendar as colour-coded bars. This section is where those connections get managed rather than just displayed."
      planned={[
        'Connect and disconnect each channel account, with the last sync time per connection.',
        'Per-channel rate and minimum-stay rules, so a direct booking can undercut the platforms deliberately.',
        'Import history and conflict log, showing any double-booking the sync caught.',
        'Per-channel commission tracking, netted against the gross figures on the calendar.',
      ]}
    />
  );
}

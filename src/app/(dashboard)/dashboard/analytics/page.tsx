import type { Metadata } from 'next';

import { NotInThisBuild } from '@/components/dashboard/not-in-this-build';

export const metadata: Metadata = { title: 'Analytics' };

export default function AnalyticsPage() {
  return (
    <NotInThisBuild
      eyebrow="Performance"
      title="Analytics"
      summary="The overview page carries the running numbers a host checks daily. This section is the longer view: season over season, listing against listing."
      planned={[
        'Revenue and occupancy by month, with the previous year on the same axis.',
        'Per-listing contribution, so an underperforming house is obvious before the season ends.',
        'Lead time and length-of-stay distributions, which drive the minimum-stay rules.',
        'Cancellation and no-show rates split by channel.',
      ]}
    />
  );
}

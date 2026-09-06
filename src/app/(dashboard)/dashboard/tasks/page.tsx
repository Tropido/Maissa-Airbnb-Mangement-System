import type { Metadata } from 'next';

import { NotInThisBuild } from '@/components/dashboard/not-in-this-build';

export const metadata: Metadata = { title: 'Tasks' };

export default function TasksPage() {
  return (
    <NotInThisBuild
      eyebrow="Operations"
      title="Tasks"
      summary="Turnovers are already derived on the overview chart, since a same-day check-out and check-in is the hardest slot to staff. This section turns those into assigned work."
      planned={[
        'A cleaning and linen task auto-created from every check-out on the calendar.',
        'Assignment to a named person, with confirmation from their phone.',
        'Maintenance items raised against a listing and carried until closed.',
        'A blocked-dates request flow, so maintenance can take a night off the market.',
      ]}
    />
  );
}

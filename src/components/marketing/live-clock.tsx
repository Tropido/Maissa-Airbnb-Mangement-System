'use client';

import { useEffect, useState } from 'react';

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Tunis',
  hour: '2-digit',
  minute: '2-digit',
});

/** "Djerba, TN · 14:32" — ticks locally, renders nothing until mounted to avoid an SSR/client time mismatch. */
export function LiveClock({ label = 'Djerba, TN' }: { label?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <span className="hidden items-center gap-1.5 text-xs text-muted-fg sm:inline-flex">
      {label} · {time}
    </span>
  );
}

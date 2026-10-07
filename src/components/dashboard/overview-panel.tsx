'use client';

import { useState } from 'react';

import { MovementsChart } from '@/components/dashboard/movements-chart';
import { Card, CardLabel } from '@/components/ui/card';
import { RANGE_OPTIONS, type OverviewMetrics, type RangeKey } from '@/lib/data/metrics';
import { cn, formatTND } from '@/lib/utils';

const SHORT: Record<RangeKey, string> = { next_7: '7d', next_30: '30d', next_90: '90d' };

/**
 * Revenue, occupancy and daily movements for the selected window. Every
 * figure comes from buildOverviewMetrics on the server; the pills only choose
 * which precomputed window is shown.
 */
export function OverviewPanel({ metricsByRange }: { metricsByRange: Record<RangeKey, OverviewMetrics> }) {
  const [range, setRange] = useState<RangeKey>('next_7');
  const m = metricsByRange[range];
  const occupancy = Math.min(m.occupancyPct, 100);

  return (
    <Card data-reveal className="p-[clamp(20px,2.4vw,30px)]">
      <section aria-labelledby="overview-heading">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CardLabel id="overview-heading">Next {m.days} days</CardLabel>
          <div role="group" aria-label="Date range" className="flex gap-0.5 rounded-full bg-ink/5 p-[3px]">
            {RANGE_OPTIONS.map((option) => {
              const on = option.key === range;
              return (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={on}
                  aria-label={option.label}
                  onClick={() => setRange(option.key)}
                  className={cn(
                    'rounded-full px-3.5 py-[7px] text-[12.5px] transition-colors duration-300',
                    on ? 'bg-ink text-ink-foreground' : 'bg-transparent text-muted-fg hover:text-ink',
                  )}
                >
                  {SHORT[option.key]}
                </button>
              );
            })}
          </div>
        </div>

        <div aria-live="polite" className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-[22px]">
          <div>
            <p className="m-0 text-[10.5px] uppercase tracking-[0.18em] text-muted-soft">Estimated revenue</p>
            <p className="mb-0 mt-3 text-[clamp(26px,3vw,38px)] leading-none tracking-[-0.04em] text-ink">
              {formatTND(m.estimatedRevenue, { suffix: false })}{' '}
              <span className="text-[13px] tracking-normal text-muted-soft">TND</span>
            </p>
            <p className="mb-0 mt-2.5 text-[11.5px] leading-normal text-muted-fg">
              Confirmed and pending stays, {m.rangeLabel.toLowerCase()}.
            </p>
          </div>
          <div>
            <p className="m-0 text-[10.5px] uppercase tracking-[0.18em] text-muted-soft">Occupancy</p>
            <p className="mb-0 mt-3 text-[clamp(26px,3vw,38px)] leading-none tracking-[-0.04em] text-ink">
              {m.occupancyPct}
              <span className="text-[15px] tracking-normal text-muted-soft">%</span>
            </p>
            <div aria-hidden className="mt-3 h-[5px] overflow-hidden rounded-full bg-ink/[.08]">
              <div
                className="h-full rounded-full bg-chart-checkin transition-[width] duration-700 ease-quiet"
                style={{ width: `${occupancy}%` }}
              />
            </div>
            <p className="mb-0 mt-2.5 text-[11.5px] leading-normal text-muted-fg">
              {m.bookedNights} of {m.availableNights} available nights sold.
            </p>
          </div>
        </div>

        <div className="mt-7">
          <p className="m-0 text-[10.5px] uppercase tracking-[0.18em] text-muted-soft">Daily movements</p>
          <MovementsChart series={m.series} />
          <ul className="m-0 mt-[22px] flex list-none flex-wrap gap-5 p-0 text-xs text-muted-fg">
            <li className="flex items-center gap-2">
              <span aria-hidden className="block size-[9px] rounded-[2px] bg-chart-checkin" />
              Check-ins {m.totalCheckIns}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="block size-[9px] rounded-[2px] bg-chart-checkout" />
              Check-outs {m.totalCheckOuts}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="block size-[9px] rounded-[2px] bg-chart-turnover" />
              Turnovers {m.totalTurnovers}
            </li>
          </ul>
        </div>
      </section>
    </Card>
  );
}

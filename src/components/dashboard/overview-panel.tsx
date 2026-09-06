'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { MovementsChart } from '@/components/dashboard/movements-chart';
import { RANGE_OPTIONS, type OverviewMetrics, type RangeKey } from '@/lib/data/metrics';
import { cn, formatTND } from '@/lib/utils';

export function OverviewPanel({
  metricsByRange,
}: {
  metricsByRange: Record<RangeKey, OverviewMetrics>;
}) {
  const [range, setRange] = useState<RangeKey>('next_30');
  const metrics = metricsByRange[range];

  const summary = [
    { label: 'Check-ins', value: metrics.totalCheckIns },
    { label: 'Check-outs', value: metrics.totalCheckOuts },
    { label: 'Turnovers', value: metrics.totalTurnovers },
  ];

  return (
    <section
      aria-labelledby="overview-heading"
      className="min-w-0 border-2 border-ink bg-bg-raised"
    >
      <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink p-5">
        <h2 id="overview-heading" className="text-sm font-bold uppercase tracking-[0.12em]">
          Overview
        </h2>

        <div className="relative">
          <label htmlFor="range" className="sr-only">
            Date range
          </label>
          <select
            id="range"
            value={range}
            onChange={(event) => setRange(event.target.value as RangeKey)}
            className="h-10 appearance-none border-2 border-ink bg-bg pl-3 pr-9 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            {RANGE_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2"
            aria-hidden
          />
        </div>
      </header>

      <div className="grid gap-px bg-ink sm:grid-cols-2">
        <div className="bg-bg-raised p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-fg">
            Estimated revenue
          </p>
          {/* Hero number: the one figure the operator opens this page for. */}
          <p className="mt-2 font-display text-4xl font-extrabold leading-none tracking-tight">
            {formatTND(metrics.estimatedRevenue, { suffix: false })}
            <span className="ml-2 align-baseline text-xs font-semibold uppercase tracking-[0.14em] text-muted-fg">
              TND
            </span>
          </p>
          <p className="mt-2 text-xs text-muted-fg">
            Confirmed and pending stays over the {metrics.rangeLabel.toLowerCase()}.
          </p>
        </div>

        <div className="bg-bg-raised p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-fg">
            Occupancy
          </p>
          <p className="mt-2 font-display text-4xl font-extrabold leading-none tracking-tight">
            {metrics.occupancyPct}
            <span className="text-2xl">%</span>
          </p>
          <p className="mt-2 text-xs text-muted-fg">
            {metrics.bookedNights} of {metrics.availableNights} available nights sold.
          </p>
          <div
            aria-hidden
            className="mt-3 h-3 w-full border-2 border-ink bg-bg"
            role="presentation"
          >
            <div
              className="h-full bg-accent"
              style={{ width: `${Math.min(metrics.occupancyPct, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="border-t-2 border-ink p-5">
        <MovementsChart series={metrics.series} />
      </div>

      <dl className="grid grid-cols-3 gap-px border-t-2 border-ink bg-ink">
        {summary.map((item) => (
          <div key={item.label} className="bg-bg-raised p-4 text-center sm:text-left">
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-fg">
              {item.label}
            </dt>
            <dd
              className={cn(
                'mt-1 font-display text-2xl font-extrabold leading-none tracking-tight',
              )}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

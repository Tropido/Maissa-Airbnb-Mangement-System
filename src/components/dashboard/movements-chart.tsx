'use client';

import { useMemo, useState } from 'react';

import { cn, formatDateMedium, parseISODate } from '@/lib/utils';
import type { DayBar } from '@/lib/data/metrics';

/**
 * Daily guest movements: check-ins, check-outs and turnovers.
 *
 * Stacked rather than grouped because the operational question is "how busy is
 * that day for the team", which is the column total; the composition then says
 * what kind of busy. A 2px surface gap separates the segments so the stack never
 * reads as one solid block.
 *
 * A turnover is a same-day check-out and check-in on one listing — the hardest
 * kind of day to staff — and it is counted only in its own series, never double
 * counted into the other two.
 *
 * Series colours are the validated `chart` tokens. Square ends are deliberate:
 * the design system is zero-radius throughout, and a rounded data-end here would
 * be the only curve on the page.
 */
const SERIES = [
  { key: 'turnovers', label: 'Turnovers', className: 'fill-chart-turnover' },
  { key: 'checkIns', label: 'Check-ins', className: 'fill-chart-checkin' },
  { key: 'checkOuts', label: 'Check-outs', className: 'fill-chart-checkout' },
] as const;

const LEGEND_SWATCH: Record<string, string> = {
  turnovers: 'bg-chart-turnover',
  checkIns: 'bg-chart-checkin',
  checkOuts: 'bg-chart-checkout',
};

const PLOT_HEIGHT = 168;
const GAP = 2;

export function MovementsChart({ series }: { series: DayBar[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const { max, ticks } = useMemo(() => {
    const peak = Math.max(1, ...series.map((d) => d.checkIns + d.checkOuts + d.turnovers));
    const rounded = Math.max(2, Math.ceil(peak));
    const stepCount = rounded <= 4 ? rounded : 4;
    return {
      max: rounded,
      ticks: Array.from({ length: stepCount + 1 }, (_, i) => (rounded / stepCount) * i),
    };
  }, [series]);

  const columnWidth = 100 / Math.max(series.length, 1);
  const barWidth = Math.min(columnWidth * 0.6, 2.4);

  const peakIndex = series.reduce(
    (best, d, i) =>
      d.checkIns + d.checkOuts + d.turnovers >
      series[best].checkIns + series[best].checkOuts + series[best].turnovers
        ? i
        : best,
    0,
  );

  const active = hovered ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-2 text-xs font-semibold text-muted-fg">
            <span aria-hidden className={cn('size-3 border-2 border-ink', LEGEND_SWATCH[s.key])} />
            {s.label}
          </span>
        ))}
      </div>

      <div className="relative mt-5">
        {/* Y axis labels sit outside the plot so they never overlap a bar. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 flex w-6 flex-col-reverse justify-between text-[10px] font-semibold text-muted-fg"
          style={{ height: PLOT_HEIGHT }}
        >
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 leading-none first:translate-y-0">
              {Math.round(t)}
            </span>
          ))}
        </div>

        <div className="min-w-0 overflow-x-auto pl-8 no-scrollbar">
          <div className="min-w-[36rem]">
            <svg
              viewBox={`0 0 100 ${PLOT_HEIGHT}`}
              preserveAspectRatio="none"
              width="100%"
              height={PLOT_HEIGHT}
              role="presentation"
              onMouseLeave={() => setHovered(null)}
            >
              {ticks.map((t) => {
                const y = PLOT_HEIGHT - (t / max) * PLOT_HEIGHT;
                return (
                  <line
                    key={t}
                    x1="0"
                    x2="100"
                    y1={y}
                    y2={y}
                    className="stroke-chart-grid"
                    strokeWidth={t === 0 ? 1.5 : 1}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}

              {series.map((day, i) => {
                const cx = columnWidth * i + columnWidth / 2;
                let cursorY = PLOT_HEIGHT;
                return (
                  <g key={day.date} opacity={active === null || active === i ? 1 : 0.45}>
                    {SERIES.map((s) => {
                      const value = day[s.key];
                      if (!value) return null;
                      const height = (value / max) * PLOT_HEIGHT;
                      cursorY -= height;
                      const y = cursorY;
                      cursorY -= GAP;
                      return (
                        <rect
                          key={s.key}
                          x={cx - barWidth / 2}
                          y={y}
                          width={barWidth}
                          height={Math.max(height - GAP, 1)}
                          className={s.className}
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Full-height hit targets — bigger than the marks, per column. */}
              {series.map((day, i) => (
                <rect
                  key={`hit-${day.date}`}
                  x={columnWidth * i}
                  y={0}
                  width={columnWidth}
                  height={PLOT_HEIGHT}
                  fill="transparent"
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                />
              ))}
            </svg>

            {/* X axis: label the first, last, peak and hovered day only — a number
                under all 30 columns would be unreadable. */}
            <div className="relative mt-2 h-4">
              {series.map((day, i) => {
                const show = i === 0 || i === series.length - 1 || i === peakIndex || i === active;
                if (!show) return null;
                return (
                  <span
                    key={day.date}
                    className={cn(
                      'absolute -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold',
                      i === active ? 'text-ink' : 'text-muted-fg',
                    )}
                    style={{ left: `${columnWidth * i + columnWidth / 2}%` }}
                  >
                    {formatDateMedium(parseISODate(day.date))}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {active !== null ? (
          <div
            role="status"
            className="mt-4 inline-flex flex-wrap items-center gap-x-4 gap-y-1 border-2 border-ink bg-bg px-3 py-2 text-xs"
          >
            <span className="font-bold">{formatDateMedium(parseISODate(series[active].date))}</span>
            {SERIES.map((s) => (
              <span key={s.key} className="inline-flex items-center gap-1.5 text-muted-fg">
                <span aria-hidden className={cn('size-2.5 border border-ink', LEGEND_SWATCH[s.key])} />
                {s.label}
                <strong className="text-ink">{series[active][s.key]}</strong>
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* Non-visual equivalent — the chart is never the only way to read this. */}
      <details className="mt-4">
        <summary className="cursor-pointer text-xs font-semibold text-muted-fg underline decoration-2 underline-offset-4">
          View as table
        </summary>
        <div className="mt-3 max-h-64 overflow-auto border-2 border-ink">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="sticky top-0 bg-ink text-ink-foreground">
              <tr>
                <th scope="col" className="p-2 font-semibold">Date</th>
                <th scope="col" className="p-2 font-semibold">Check-ins</th>
                <th scope="col" className="p-2 font-semibold">Check-outs</th>
                <th scope="col" className="p-2 font-semibold">Turnovers</th>
              </tr>
            </thead>
            <tbody>
              {series.map((day) => (
                <tr key={day.date} className="border-t border-muted bg-bg-raised">
                  <th scope="row" className="p-2 font-medium">
                    {formatDateMedium(parseISODate(day.date))}
                  </th>
                  <td className="p-2">{day.checkIns}</td>
                  <td className="p-2">{day.checkOuts}</td>
                  <td className="p-2">{day.turnovers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

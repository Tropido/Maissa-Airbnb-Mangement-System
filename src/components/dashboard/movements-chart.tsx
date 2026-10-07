import { cn, formatDateMedium, formatDayShort, parseISODate } from '@/lib/utils';
import type { DayBar } from '@/lib/data/metrics';

const PLOT = 118;

/**
 * Daily guest movements as stacked columns, from the overview reference:
 * check-ins at the base, check-outs above, turnovers on top. A turnover is a
 * same-day check-out and check-in on one listing and is counted only in its
 * own series, never double counted (see buildOverviewMetrics).
 *
 * Each column carries its exact counts as a tooltip and in its accessible
 * description; the legend states the totals.
 */
export function MovementsChart({ series }: { series: DayBar[] }) {
  const max = Math.max(4, ...series.map((d) => d.checkIns + d.checkOuts + d.turnovers));
  const dense = series.length > 31;
  const labelEvery = series.length <= 7 ? 1 : series.length <= 31 ? 3 : 10;
  const h = (n: number) => Math.round((n / max) * PLOT);

  return (
    <div
      className={cn(
        'mt-[18px] flex h-[150px] items-end border-b border-ink/10 pb-[22px]',
        series.length <= 7 ? 'gap-2.5' : dense ? 'gap-0.5' : 'gap-1',
      )}
    >
      {series.map((d, i) => {
        const date = parseISODate(d.date);
        const title = `${formatDateMedium(date)}: ${d.checkIns} in, ${d.checkOuts} out, ${d.turnovers} turnover${d.turnovers === 1 ? '' : 's'}`;
        const label = series.length <= 7 ? formatDayShort(date) : i % labelEvery === 0 ? d.label : '';
        return (
          <div
            key={d.date}
            title={title}
            className="relative flex h-full min-w-0 flex-1 basis-0 flex-col justify-end gap-0.5"
          >
            <span className="sr-only">{title}</span>
            {[
              { n: d.turnovers, cls: 'rounded-t-[3px] bg-chart-turnover' },
              { n: d.checkOuts, cls: 'bg-chart-checkout' },
              { n: d.checkIns, cls: 'rounded-b-[3px] bg-chart-checkin' },
            ].map((seg, s) =>
              seg.n > 0 ? (
                <span
                  key={s}
                  aria-hidden
                  className={cn('block min-h-[3px] transition-[height] duration-700 ease-quiet', seg.cls)}
                  style={{ height: h(seg.n) }}
                />
              ) : null,
            )}
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-5 overflow-hidden whitespace-nowrap text-center text-[9.5px] tracking-[0.04em] text-muted-soft"
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

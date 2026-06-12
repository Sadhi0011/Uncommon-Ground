import { formatPrice, cn } from '../../utils/format';

export const money = (cents) => formatPrice((Number(cents) || 0) / 100);

export function StatCard({ label, value, sub, icon: Icon, accent = 'ember' }) {
  const ring = accent === 'teal' ? 'bg-teal/15 text-teal' : 'bg-ember/15 text-ember';
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-800/60 p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-luxe text-haze">{label}</p>
        {Icon && (
          <span className={cn('grid h-9 w-9 place-items-center rounded-xl', ring)}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-3xl text-sand">{value}</p>
      {sub && <p className="mt-1 text-xs text-haze">{sub}</p>}
    </div>
  );
}

// Horizontal bars for ranked data (e.g. revenue by product).
export function RankedBars({ data, labelKey = 'name', valueKey = 'revenueCents', format = money }) {
  const max = Math.max(1, ...data.map((d) => Number(d[valueKey]) || 0));
  if (data.length === 0) {
    return <p className="text-sm text-haze">No data for this range.</p>;
  }
  return (
    <div className="space-y-3">
      {data.map((d) => {
        const val = Number(d[valueKey]) || 0;
        const pct = Math.round((val / max) * 100);
        return (
          <div key={d.id || d[labelKey]}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-sand">{d[labelKey]}</span>
              <span className="text-haze">{format(val)}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-ember-dark to-ember"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Vertical bars for a daily time series.
export function DailyBars({ data }) {
  const max = Math.max(1, ...data.map((d) => Number(d.revenueCents) || 0));
  if (data.length === 0) {
    return <p className="text-sm text-haze">No sales in this range.</p>;
  }
  return (
    <div className="flex h-48 items-end gap-1 overflow-x-auto pb-2">
      {data.map((d) => {
        const val = Number(d.revenueCents) || 0;
        const pct = Math.max(2, Math.round((val / max) * 100));
        return (
          <div key={d.day} className="group flex min-w-[10px] flex-1 flex-col items-center justify-end">
            <div className="relative w-full">
              <div
                className="w-full rounded-t bg-gradient-to-t from-teal-dark to-teal transition-all"
                style={{ height: `${pct * 1.6}px` }}
                title={`${d.day}: ${money(val)} · ${d.orders} orders`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

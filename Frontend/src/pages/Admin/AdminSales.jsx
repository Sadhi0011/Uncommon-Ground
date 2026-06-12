import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useSalesStats } from '../../hooks/useSalesStats';
import DateRangeFilter, { rangeToDates } from '../../components/admin/DateRangeFilter';
import { StatCard, RankedBars, DailyBars, money } from '../../components/admin/charts';
import { Banner } from '../../components/admin/ui';
import { cn } from '../../utils/format';

export default function AdminSales() {
  const [range, setRange] = useState('30d');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('revenue');
  const { from, to } = useMemo(() => rangeToDates(range), [range]);
  const { stats, loading, error, refresh } = useSalesStats({ from, to });

  const products = useMemo(() => {
    let list = [...(stats?.byProduct || [])];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => (p.name || '').toLowerCase().includes(q));
    }
    list.sort((a, b) =>
      sort === 'units' ? b.units - a.units : b.revenueCents - a.revenueCents
    );
    return list;
  }, [stats, search, sort]);

  const t = stats?.totals;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-sand">Sales</h1>
          <p className="text-sm text-haze">Product sales analytics · live</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter value={range} onChange={setRange} />
          <button
            type="button"
            onClick={refresh}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-sand hover:border-ember hover:text-ember"
            aria-label="Refresh"
          >
            <RefreshCw size={15} className={cn(loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {error && <Banner type="error">{error}</Banner>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue" value={money(t?.revenueCents)} sub={`${t?.orderCount ?? 0} orders`} />
        <StatCard label="Units Sold" value={t?.unitsSold ?? 0} accent="teal" />
        <StatCard label="Avg Order Value" value={money(t?.avgOrderValueCents)} />
        <StatCard label="Refunds" value={t?.refundedCount ?? 0} accent="teal" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-800/60 p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold uppercase tracking-luxe text-sand">Revenue Over Time</h2>
        <DailyBars data={stats?.byDay || []} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-ink-800/60 p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold uppercase tracking-luxe text-sand">Revenue by Product</h2>
          <RankedBars data={products} valueKey="revenueCents" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink-800/60 p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold uppercase tracking-luxe text-sand">Units by Product</h2>
          <RankedBars data={products} valueKey="units" format={(v) => `${v} units`} />
        </div>
      </div>

      {/* Detailed table with filters */}
      <div className="rounded-2xl border border-white/10 bg-ink-800/60 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-luxe text-sand">Product Breakdown</h2>
          <div className="flex items-center gap-2">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter products…"
              className="rounded-full border border-white/10 bg-ink-700 px-4 py-2 text-sm text-sand placeholder:text-haze focus:border-ember focus:outline-none"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-white/10 bg-ink-700 px-4 py-2 text-xs uppercase tracking-luxe text-sand focus:border-ember focus:outline-none"
            >
              <option value="revenue">Top Revenue</option>
              <option value="units">Most Units</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-luxe text-haze">
              <tr>
                <th className="py-2 pr-4">Product</th>
                <th className="py-2 pr-4">Units</th>
                <th className="py-2 pr-4">Revenue</th>
                <th className="py-2">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-haze">No sales in this range.</td></tr>
              ) : (
                products.map((p) => {
                  const share = t?.revenueCents ? Math.round((p.revenueCents / t.revenueCents) * 100) : 0;
                  return (
                    <tr key={p.id || p.name} className="text-sand">
                      <td className="py-2 pr-4">{p.name}</td>
                      <td className="py-2 pr-4">{p.units}</td>
                      <td className="py-2 pr-4">{money(p.revenueCents)}</td>
                      <td className="py-2 text-haze">{share}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

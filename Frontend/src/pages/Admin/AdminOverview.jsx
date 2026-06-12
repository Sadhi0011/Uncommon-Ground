import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Package, ReceiptText, TrendingUp } from 'lucide-react';
import { useSalesStats } from '../../hooks/useSalesStats';
import { useProducts } from '../../context/ProductsContext';
import DateRangeFilter, { rangeToDates } from '../../components/admin/DateRangeFilter';
import { StatCard, RankedBars, DailyBars, money } from '../../components/admin/charts';
import { Banner } from '../../components/admin/ui';

export default function AdminOverview() {
  const [range, setRange] = useState('30d');
  const { from, to } = useMemo(() => rangeToDates(range), [range]);
  const { stats, loading, error } = useSalesStats({ from, to });
  const { products } = useProducts();

  const t = stats?.totals;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-sand">Overview</h1>
          <p className="text-sm text-haze">Live store performance · updates automatically</p>
        </div>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      {error && <Banner type="error">{error}</Banner>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue" value={loading && !t ? '—' : money(t?.revenueCents)} sub={`${t?.orderCount ?? 0} orders`} icon={DollarSign} />
        <StatCard label="Units Sold" value={loading && !t ? '—' : (t?.unitsSold ?? 0)} sub="jerky packs" icon={Package} accent="teal" />
        <StatCard label="Avg Order Value" value={loading && !t ? '—' : money(t?.avgOrderValueCents)} sub="per paid order" icon={TrendingUp} />
        <StatCard label="Active Products" value={products.length} sub={`${t?.refundedCount ?? 0} refunds`} icon={ReceiptText} accent="teal" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-ink-800/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-luxe text-sand">Revenue Over Time</h2>
          </div>
          <DailyBars data={stats?.byDay || []} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-ink-800/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-luxe text-sand">Top Sellers</h2>
            <Link to="/admin/sales" className="text-xs text-ember hover:underline">View all →</Link>
          </div>
          <RankedBars data={(stats?.byProduct || []).slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}

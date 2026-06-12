import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import DateRangeFilter, { rangeToDates } from '../../components/admin/DateRangeFilter';
import { money } from '../../components/admin/charts';
import { Banner } from '../../components/admin/ui';
import { cn } from '../../utils/format';

const STATUSES = ['all', 'paid', 'fulfilled', 'refunded', 'pending'];

const statusStyle = (s) =>
  ({
    paid: 'bg-teal/15 text-teal',
    fulfilled: 'bg-ember/15 text-ember',
    refunded: 'bg-red-400/15 text-red-300',
    pending: 'bg-white/10 text-haze',
  }[s] || 'bg-white/10 text-haze');

export default function AdminOrders() {
  const [range, setRange] = useState('30d');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { from, to } = useMemo(() => rangeToDates(range), [range]);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        if (status !== 'all') params.set('status', status);
        if (search.trim()) params.set('q', search.trim());
        const { orders: rows } = await api.get(`/api/orders?${params.toString()}`, { auth: true });
        setOrders(rows);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load orders.');
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [from, to, status, search]
  );

  useEffect(() => {
    load();
  }, [load]);

  // Near real-time: refresh on focus + interval.
  useEffect(() => {
    const onFocus = () => load(true);
    window.addEventListener('focus', onFocus);
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') load(true);
    }, 15000);
    return () => {
      window.removeEventListener('focus', onFocus);
      clearInterval(interval);
    };
  }, [load]);

  const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-sand">Orders</h1>
          <p className="text-sm text-haze">{orders.length} orders · live</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter value={range} onChange={setRange} />
          <button
            type="button"
            onClick={() => load()}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-sand hover:border-ember hover:text-ember"
            aria-label="Refresh"
          >
            <RefreshCw size={15} className={cn(loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {error && <Banner type="error">{error}</Banner>}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-luxe transition-colors',
                status === s ? 'bg-teal text-onink' : 'border border-white/10 text-haze hover:text-sand'
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email…"
          className="flex-1 rounded-full border border-white/10 bg-ink-700 px-4 py-2 text-sm text-sand placeholder:text-haze focus:border-ember focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-700/60 text-xs uppercase tracking-luxe text-haze">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && orders.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-haze">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-haze">No orders match these filters.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="text-sand">
                  <td className="px-4 py-3 font-mono text-xs text-haze">{o.id.slice(0, 12)}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{o.customerName || '—'}</p>
                    <p className="text-xs text-haze">{o.email}</p>
                  </td>
                  <td className="px-4 py-3 text-haze">
                    {(o.items || []).reduce((s, it) => s + it.quantity, 0)} items
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-luxe', statusStyle(o.status))}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-haze">{fmtDate(o.createdAt)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{money(o.totalCents)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

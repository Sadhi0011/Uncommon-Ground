import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/ui/Seo';
import { formatPrice, cn } from '../../utils/format';

const money = (cents) => formatPrice((Number(cents) || 0) / 100);

const statusStyle = (s) =>
  ({
    paid: 'bg-teal/15 text-teal',
    fulfilled: 'bg-ember/15 text-ember',
    refunded: 'bg-red-400/15 text-red-300',
    pending: 'bg-white/10 text-haze',
  }[s] || 'bg-white/10 text-haze');

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { orders: rows } = await api.get('/api/orders/mine', { auth: true });
        if (active) setOrders(rows);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load your orders.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <Seo title="Order History" description="Review your Uncommon Ground orders." path="/account/orders" />

      <section className="bg-ink-900 py-16 lg:py-24">
        <div className="container-luxe max-w-4xl">
          <span className="eyebrow">{user?.name}</span>
          <h1 className="display-hero mt-3 text-4xl text-sand sm:text-5xl">Order History</h1>

          {loading ? (
            <p className="mt-12 text-haze">Loading your orders…</p>
          ) : error ? (
            <p className="mt-12 text-red-400">{error}</p>
          ) : orders.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-6 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-white/5 text-haze">
                <ShoppingBag size={32} />
              </div>
              <p className="text-lg text-haze">You have not placed any orders yet.</p>
              <Link to="/shop" className="btn-primary">Shop Jerky</Link>
            </div>
          ) : (
            <div className="mt-10 space-y-5">
              {orders.map((o) => {
                const units = (o.items || []).reduce((s, it) => s + it.quantity, 0);
                return (
                  <div key={o.id} className="rounded-2xl border border-white/10 bg-ink-800/60 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-heading text-sm font-semibold uppercase tracking-wide text-sand">
                            Order {o.id.slice(0, 14)}
                          </span>
                          <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-luxe', statusStyle(o.status))}>
                            {o.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-haze">
                          {fmtDate(o.createdAt)} · {units} {units === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-2xl text-ember">{money(o.totalCents)}</p>
                        <p className="text-xs text-haze">
                          {o.shippingCents === 0 ? 'Free shipping' : `+ ${money(o.shippingCents)} shipping`}
                        </p>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-2">
                      {(o.items || []).map((it, i) => (
                        <li key={i} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-sand">
                            <Package size={14} className="text-haze" />
                            {it.productName} <span className="text-haze">× {it.quantity}</span>
                          </span>
                          <span className="text-haze">{money(it.unitPriceCents * it.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

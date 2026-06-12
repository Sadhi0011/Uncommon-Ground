import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import { resolveImage } from '../../lib/assetMap';
import { useProducts } from '../../context/ProductsContext';
import { formatPrice, cn } from '../../utils/format';
import { Modal, Banner } from '../../components/admin/ui';
import ProductForm from '../../components/admin/ProductForm';

export default function AdminProducts() {
  const { refresh } = useProducts();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // product | 'new' | null
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | published | hidden
  const [flavorFilter, setFlavorFilter] = useState('All');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { products } = await api.get('/api/products/admin/all', { auth: true });
      setItems(products);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (payload) => {
    if (editing === 'new') {
      await api.post('/api/products', payload, { auth: true });
    } else {
      await api.put(`/api/products/${editing.id}`, payload, { auth: true });
    }
    setEditing(null);
    await load();
    refresh(); // push changes to the public storefront
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.shortName || product.name}"? This cannot be undone.`)) return;
    try {
      await api.del(`/api/products/${product.id}`, { auth: true });
      await load();
      refresh();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  };

  const flavors = useMemo(
    () => ['All', ...Array.from(new Set(items.map((p) => p.flavor).filter(Boolean)))],
    [items]
  );

  const filtered = useMemo(() => {
    let list = [...items];
    if (statusFilter === 'published') list = list.filter((p) => p.active);
    if (statusFilter === 'hidden') list = list.filter((p) => !p.active);
    if (flavorFilter !== 'All') list = list.filter((p) => p.flavor === flavorFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.shortName || '').toLowerCase().includes(q) ||
          (p.meat || '').toLowerCase().includes(q) ||
          (p.flavor || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, search, statusFilter, flavorFilter]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-sand">Products</h1>
          <p className="text-sm text-haze">{filtered.length} of {items.length}</p>
        </div>
        <button type="button" onClick={() => setEditing('new')} className="btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-ink-800/60 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-haze" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-full border border-white/10 bg-ink-700 py-2.5 pl-10 pr-4 text-sm text-sand placeholder:text-haze focus:border-ember focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'published', 'hidden'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-luxe transition-colors',
                statusFilter === s ? 'bg-ember text-onink' : 'border border-white/10 text-haze hover:text-sand'
              )}
            >
              {s}
            </button>
          ))}
          <select
            value={flavorFilter}
            onChange={(e) => setFlavorFilter(e.target.value)}
            className="rounded-full border border-white/10 bg-ink-700 px-4 py-2 text-xs uppercase tracking-luxe text-sand focus:border-ember focus:outline-none"
          >
            {flavors.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="mt-4"><Banner type="error">{error}</Banner></div>}

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-700/60 text-xs uppercase tracking-luxe text-haze">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Flavor</th>
              <th className="px-4 py-3">Meat</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-haze">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-haze">No products match these filters.</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="text-sand">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={resolveImage(p.imageKey)} alt="" className="h-10 w-10 rounded-lg border border-white/10 object-cover" />
                      <div>
                        <p className="font-semibold">{p.shortName || p.name}</p>
                        <p className="text-xs text-haze">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-haze">{p.flavor}</td>
                  <td className="px-4 py-3 text-haze">{p.meat}</td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={p.active ? 'text-teal' : 'text-haze'}>
                      {p.active ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(p)}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-sand hover:border-ember hover:text-ember"
                        aria-label={`Edit ${p.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-sand hover:border-red-400 hover:text-red-400"
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal
          wide
          title={editing === 'new' ? 'Add Product' : `Edit ${editing.shortName || editing.name}`}
          onClose={() => setEditing(null)}
        >
          <ProductForm
            initial={editing === 'new' ? null : editing}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}

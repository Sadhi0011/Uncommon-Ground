import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import { resolveImage } from '../../lib/assetMap';
import { useProducts } from '../../context/ProductsContext';
import { Modal, Banner } from '../../components/admin/ui';
import CollectionForm from '../../components/admin/CollectionForm';

export default function AdminCollections() {
  const { refresh } = useProducts();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { collections } = await api.get('/api/collections');
      setItems(collections);
    } catch (err) {
      setError(err.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (payload) => {
    if (editing === 'new') {
      await api.post('/api/collections', payload, { auth: true });
    } else {
      await api.put(`/api/collections/${editing.id}`, payload, { auth: true });
    }
    setEditing(null);
    await load();
    refresh();
  };

  const handleDelete = async (col) => {
    if (!window.confirm(`Delete category "${col.name}"?`)) return;
    try {
      await api.del(`/api/collections/${col.id}`, { auth: true });
      await load();
      refresh();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl uppercase tracking-wide text-sand">Categories</h2>
          <p className="text-sm text-haze">{items.length} total</p>
        </div>
        <button type="button" onClick={() => setEditing('new')} className="btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {error && <div className="mt-4"><Banner type="error">{error}</Banner></div>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-haze">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-haze">No categories yet.</p>
        ) : (
          items.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800/60">
              <img src={resolveImage(c.imageKey)} alt={c.name} className="h-32 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-base font-semibold uppercase tracking-wide text-sand">{c.name}</h3>
                    <p className="text-xs text-haze">{c.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(c)}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-sand hover:border-ember hover:text-ember"
                      aria-label={`Edit ${c.name}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c)}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-sand hover:border-red-400 hover:text-red-400"
                      aria-label={`Delete ${c.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-haze line-clamp-2">{c.blurb}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && (
        <Modal
          title={editing === 'new' ? 'Add Category' : `Edit ${editing.name}`}
          onClose={() => setEditing(null)}
        >
          <CollectionForm
            initial={editing === 'new' ? null : editing}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}

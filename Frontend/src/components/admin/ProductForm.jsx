import { useMemo, useState } from 'react';
import { imageKeyOptions, resolveImage } from '../../lib/assetMap';
import { Field, inputClass, Banner } from './ui';

const MEATS = ['Elk', 'Venison', 'Buffalo', 'Other'];

const toLines = (arr) => (Array.isArray(arr) ? arr.join('\n') : '');
const fromLines = (str) =>
  String(str || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
const toCsv = (arr) => (Array.isArray(arr) ? arr.join(', ') : '');
const fromCsv = (str) =>
  String(str || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export default function ProductForm({ initial, onSubmit, onCancel }) {
  const isEdit = Boolean(initial);
  const n = initial?.nutrition || {};

  const [form, setForm] = useState({
    name: initial?.name || '',
    slug: initial?.slug || '',
    shortName: initial?.shortName || '',
    flavor: initial?.flavor || '',
    meat: initial?.meat || 'Elk',
    price: initial?.price ?? '',
    weight: initial?.weight || '3.2 oz (92g)',
    imageKey: initial?.imageKey || imageKeyOptions[0],
    rating: initial?.rating ?? 4.8,
    reviewCount: initial?.reviewCount ?? 0,
    badge: initial?.badge || '',
    bestSeller: initial?.bestSeller ?? false,
    active: initial?.active ?? true,
    sortOrder: initial?.sortOrder ?? 0,
    tagline: initial?.tagline || '',
    description: toLines(initial?.description),
    flavorNotes: toCsv(initial?.flavorNotes),
    ingredients: initial?.ingredients || '',
    allergens: initial?.allergens || '',
    pairs: toCsv(initial?.pairs),
    calories: n.calories ?? '',
    protein: n.protein ?? '',
    fat: n.fat ?? '',
    sodium: n.sodium ?? '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const preview = useMemo(() => resolveImage(form.imageKey), [form.imageKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Name is required.');
    if (form.price === '' || Number.isNaN(Number(form.price))) {
      return setError('A valid price is required.');
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      shortName: form.shortName.trim() || form.name.trim(),
      flavor: form.flavor.trim(),
      meat: form.meat,
      price: Number(form.price),
      weight: form.weight.trim(),
      imageKey: form.imageKey.trim(),
      galleryKeys: [form.imageKey.trim(), 'lifestyleBoard'],
      rating: Number(form.rating) || 0,
      reviewCount: Number(form.reviewCount) || 0,
      badge: form.badge.trim() || null,
      bestSeller: Boolean(form.bestSeller),
      active: Boolean(form.active),
      sortOrder: Number(form.sortOrder) || 0,
      tagline: form.tagline.trim(),
      description: fromLines(form.description),
      flavorNotes: fromCsv(form.flavorNotes),
      ingredients: form.ingredients.trim(),
      allergens: form.allergens.trim(),
      pairs: fromCsv(form.pairs),
      nutrition: {
        calories: form.calories === '' ? undefined : Number(form.calories),
        protein: form.protein || undefined,
        fat: form.fat || undefined,
        sodium: form.sodium || undefined,
      },
    };

    setBusy(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.message || 'Save failed.');
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <Banner type="error">{error}</Banner>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" className="sm:col-span-2">
          <input className={inputClass} value={form.name} onChange={set('name')} placeholder="3.2 oz. Original Buffalo Jerky" />
        </Field>
        <Field label="Short Name">
          <input className={inputClass} value={form.shortName} onChange={set('shortName')} placeholder="Original Buffalo" />
        </Field>
        <Field label="Slug" hint="Leave blank to auto-generate from name">
          <input className={inputClass} value={form.slug} onChange={set('slug')} placeholder="original-buffalo-jerky" />
        </Field>
        <Field label="Flavor / Category">
          <input className={inputClass} value={form.flavor} onChange={set('flavor')} placeholder="Original" />
        </Field>
        <Field label="Meat">
          <select className={inputClass} value={form.meat} onChange={set('meat')}>
            {MEATS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </Field>
        <Field label="Price (USD)">
          <input type="number" step="0.01" min="0" className={inputClass} value={form.price} onChange={set('price')} placeholder="13" />
        </Field>
        <Field label="Weight">
          <input className={inputClass} value={form.weight} onChange={set('weight')} placeholder="3.2 oz (92g)" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Image">
          <select className={inputClass} value={form.imageKey} onChange={set('imageKey')}>
            {imageKeyOptions.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </Field>
        <div className="flex items-end">
          <img src={preview} alt="preview" className="h-16 w-16 rounded-xl border border-white/10 object-cover" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Rating">
          <input type="number" step="0.1" min="0" max="5" className={inputClass} value={form.rating} onChange={set('rating')} />
        </Field>
        <Field label="Reviews">
          <input type="number" min="0" className={inputClass} value={form.reviewCount} onChange={set('reviewCount')} />
        </Field>
        <Field label="Badge" hint="Optional">
          <input className={inputClass} value={form.badge} onChange={set('badge')} placeholder="Best Seller" />
        </Field>
        <Field label="Sort Order">
          <input type="number" className={inputClass} value={form.sortOrder} onChange={set('sortOrder')} />
        </Field>
      </div>

      <Field label="Tagline">
        <input className={inputClass} value={form.tagline} onChange={set('tagline')} placeholder="Lean bison. Honest smoke." />
      </Field>

      <Field label="Description" hint="One paragraph per line">
        <textarea rows={4} className={`${inputClass} resize-none`} value={form.description} onChange={set('description')} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Flavor Notes" hint="Comma-separated">
          <input className={inputClass} value={form.flavorNotes} onChange={set('flavorNotes')} placeholder="Smoky, Savory, Clean Finish" />
        </Field>
        <Field label="Pairs With" hint="Comma-separated product IDs">
          <input className={inputClass} value={form.pairs} onChange={set('pairs')} placeholder="teriyaki-buffalo, sweet-peppered-elk" />
        </Field>
      </div>

      <Field label="Ingredients">
        <textarea rows={2} className={`${inputClass} resize-none`} value={form.ingredients} onChange={set('ingredients')} />
      </Field>
      <Field label="Allergens">
        <input className={inputClass} value={form.allergens} onChange={set('allergens')} placeholder="Contains Soy & Wheat." />
      </Field>

      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Calories">
          <input type="number" min="0" className={inputClass} value={form.calories} onChange={set('calories')} />
        </Field>
        <Field label="Protein">
          <input className={inputClass} value={form.protein} onChange={set('protein')} placeholder="12g" />
        </Field>
        <Field label="Fat">
          <input className={inputClass} value={form.fat} onChange={set('fat')} placeholder="5g" />
        </Field>
        <Field label="Sodium">
          <input className={inputClass} value={form.sodium} onChange={set('sodium')} placeholder="480mg" />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 text-sm text-sand">
          <input type="checkbox" checked={form.bestSeller} onChange={set('bestSeller')} className="accent-ember" />
          Best Seller
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-sand">
          <input type="checkbox" checked={form.active} onChange={set('active')} className="accent-ember" />
          Published (visible on site)
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}

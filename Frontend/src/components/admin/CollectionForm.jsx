import { useMemo, useState } from 'react';
import { imageKeyOptions, resolveImage } from '../../lib/assetMap';
import { Field, inputClass, Banner } from './ui';

const ACCENTS = ['ember', 'teal'];

export default function CollectionForm({ initial, onSubmit, onCancel }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState({
    name: initial?.name || '',
    slug: initial?.slug || '',
    blurb: initial?.blurb || '',
    imageKey: initial?.imageKey || imageKeyOptions[0],
    accent: initial?.accent || 'ember',
    sortOrder: initial?.sortOrder ?? 0,
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const preview = useMemo(() => resolveImage(form.imageKey), [form.imageKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Name is required.');

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      blurb: form.blurb.trim(),
      imageKey: form.imageKey.trim(),
      accent: form.accent,
      sortOrder: Number(form.sortOrder) || 0,
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
        <Field label="Name">
          <input className={inputClass} value={form.name} onChange={set('name')} placeholder="Sweet & Hot" />
        </Field>
        <Field label="Slug" hint="Leave blank to auto-generate">
          <input className={inputClass} value={form.slug} onChange={set('slug')} placeholder="sweet-and-hot" />
        </Field>
      </div>

      <Field label="Blurb">
        <textarea rows={2} className={`${inputClass} resize-none`} value={form.blurb} onChange={set('blurb')} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Image">
          <select className={inputClass} value={form.imageKey} onChange={set('imageKey')}>
            {imageKeyOptions.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </Field>
        <Field label="Accent">
          <select className={inputClass} value={form.accent} onChange={set('accent')}>
            {ACCENTS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </Field>
        <Field label="Sort Order">
          <input type="number" className={inputClass} value={form.sortOrder} onChange={set('sortOrder')} />
        </Field>
      </div>

      <img src={preview} alt="preview" className="h-20 w-32 rounded-xl border border-white/10 object-cover" />

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}

import { cn } from '../../utils/format';

export const RANGE_PRESETS = [
  { id: '7d', label: '7 days', days: 7 },
  { id: '30d', label: '30 days', days: 30 },
  { id: '90d', label: '90 days', days: 90 },
  { id: 'all', label: 'All time', days: null },
];

// Returns { from, to } ISO date strings (YYYY-MM-DD) for a preset id.
export function rangeToDates(presetId) {
  const preset = RANGE_PRESETS.find((p) => p.id === presetId);
  if (!preset || preset.days === null) return { from: '', to: '' };
  const to = new Date();
  const from = new Date(Date.now() - (preset.days - 1) * 86400000);
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { from: fmt(from), to: fmt(to) };
}

export default function DateRangeFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {RANGE_PRESETS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onChange(p.id)}
          className={cn(
            'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-luxe transition-colors',
            value === p.id
              ? 'bg-ember text-onink'
              : 'border border-white/10 text-haze hover:text-sand'
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

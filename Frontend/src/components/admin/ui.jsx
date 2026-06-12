import { X } from 'lucide-react';
import { cn } from '../../utils/format';

export const inputClass = cn(
  'w-full rounded-xl border border-white/10 bg-ink-700 px-4 py-2.5 text-sm text-sand',
  'placeholder:text-haze/60 focus:border-ember focus:outline-none transition-colors'
);

export function Field({ label, hint, children, className }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe text-haze">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-haze/70">{hint}</p>}
    </div>
  );
}

export function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <div className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 my-4 w-full rounded-3xl border border-white/10 bg-ink-800 p-6 shadow-card sm:p-8',
          wide ? 'max-w-3xl' : 'max-w-lg'
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl uppercase tracking-wide text-sand">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-sand transition-colors hover:border-ember hover:text-ember"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Banner({ type = 'info', children }) {
  if (!children) return null;
  const styles = {
    info: 'border-white/10 bg-white/5 text-haze',
    error: 'border-red-400/40 bg-red-400/10 text-red-300',
    success: 'border-teal/40 bg-teal/10 text-teal',
  };
  return (
    <div className={cn('rounded-xl border px-4 py-3 text-sm', styles[type])} role="status">
      {children}
    </div>
  );
}

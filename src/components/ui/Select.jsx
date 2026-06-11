import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/format';

// Custom dropdown so the hover/highlight colors are fully brand-controlled
// (native <select> option highlight is OS-controlled and can't be themed).
export default function Select({
  options,
  value,
  onChange,
  onBlur,
  placeholder = 'Select...',
  error = false,
  name,
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [onBlur]);

  const select = (opt) => {
    onChange(opt);
    setOpen(false);
    onBlur?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((i) => {
        const next = e.key === 'ArrowDown' ? i + 1 : i - 1;
        return Math.max(0, Math.min(options.length - 1, next));
      });
    }
    if ((e.key === 'Enter' || e.key === ' ') && open && activeIndex >= 0) {
      e.preventDefault();
      select(options[activeIndex]);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        name={name}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-xl border bg-ink-700 px-4 py-3 text-left text-sm transition-colors focus:outline-none',
          error ? 'border-red-400/60' : 'border-white/10',
          open && !error && 'border-ember',
          value ? 'text-sand' : 'text-haze/60'
        )}
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          size={16}
          className={cn('shrink-0 text-haze transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-white/10 bg-ink-700 p-1.5 shadow-card"
          >
            {options.map((opt, i) => {
              const selected = opt === value;
              const active = i === activeIndex;
              return (
                <li key={opt} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => select(opt)}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                      active || selected ? 'bg-ember text-[#fff]' : 'text-sand hover:bg-ember hover:text-[#fff]'
                    )}
                  >
                    <span>{opt}</span>
                    {selected && <Check size={15} />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

import { Star } from 'lucide-react';
import { cn } from '../../utils/format';

export default function StarRating({ value = 5, size = 16, showValue = false, className = '' }) {
  const rounded = Math.round(value);
  return (
    <div className={cn('flex items-center gap-1', className)} aria-label={`Rated ${value} out of 5`}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < rounded ? 'fill-ember text-ember' : 'text-white/25'}
          />
        ))}
      </div>
      {showValue && <span className="text-xs font-semibold text-haze">{value.toFixed(1)}</span>}
    </div>
  );
}

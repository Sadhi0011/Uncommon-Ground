import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { formatPrice } from '../../utils/format';
import StarRating from '../ui/StarRating';
import { EASE } from '../../utils/motion';

export default function QuickView({ product, onClose }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  useLockBodyScroll(Boolean(product));

  useEffect(() => {
    setQty(1);
  }, [product]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-900/85 backdrop-blur-md" onClick={onClose} />
          <motion.div
            className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-ink-800 md:grid-cols-2"
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink-900/70 text-sand backdrop-blur hover:text-ember"
              aria-label="Close quick view"
            >
              <X size={18} />
            </button>

            <div className="aspect-square overflow-hidden bg-ink-600 md:aspect-auto">
              <img src={product.image} alt={product.shortName} className="h-full w-full object-cover" />
            </div>

            <div className="flex flex-col gap-4 p-7">
              <span className="eyebrow">{product.flavor} · {product.meat}</span>
              <h3 className="font-display text-3xl uppercase tracking-wide text-sand">
                {product.shortName}
              </h3>
              <div className="flex items-center gap-3">
                <StarRating value={product.rating} size={15} />
                <span className="text-xs text-haze">{product.reviewCount} reviews</span>
              </div>
              <p className="text-sm leading-relaxed text-haze">{product.description[0]}</p>

              <div className="flex flex-wrap gap-2">
                {product.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-sand/80"
                  >
                    {note}
                  </span>
                ))}
              </div>

              <span className="font-display text-3xl text-ember">{formatPrice(product.price)}</span>

              <div className="mt-auto flex items-center gap-3">
                <div className="flex items-center gap-4 rounded-full border border-white/15 px-3 py-2">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                    <Minus size={16} className="text-haze hover:text-sand" />
                  </button>
                  <span className="w-5 text-center text-sand">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase">
                    <Plus size={16} className="text-haze hover:text-sand" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    addItem(product, qty);
                    onClose();
                  }}
                  className="btn-primary flex-1"
                >
                  Add to Cart
                </button>
              </div>
              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="text-center text-xs uppercase tracking-luxe text-haze underline-offset-4 hover:text-ember hover:underline"
              >
                View full details
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

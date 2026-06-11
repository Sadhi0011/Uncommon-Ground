import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice, cn } from '../../utils/format';
import StarRating from '../ui/StarRating';
import { fadeUp } from '../../utils/motion';

export default function ProductCard({ product, onQuickView, index = 0 }) {
  const { addItem } = useCart();
  const [wished, setWished] = useState(false);

  return (
    <motion.article
      variants={fadeUp}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-700/60 transition-all duration-500 hover:border-ember/40 hover:shadow-card"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-600">
        <Link to={`/product/${product.slug}`} aria-label={product.shortName}>
          <img
            src={product.image}
            alt={product.shortName}
            loading={index < 4 ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {product.badge && (
            <span className="rounded-full bg-ember px-3 py-1 text-[10px] font-bold uppercase tracking-luxe text-ink-900">
              {product.badge}
            </span>
          )}
          <span className="rounded-full bg-ink-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-luxe text-teal backdrop-blur">
            {product.meat}
          </span>
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => setWished((v) => !v)}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-ink-900/70 text-sand backdrop-blur transition-colors hover:text-ember"
          aria-label="Add to wishlist"
          aria-pressed={wished}
        >
          <Heart size={16} className={cn(wished && 'fill-ember text-ember')} />
        </button>

        {/* Hover actions */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-2 p-4 transition-transform duration-500 ease-out group-hover:translate-y-0">
          <button
            type="button"
            onClick={() => addItem(product, 1)}
            className="btn flex-1 rounded-full bg-ember px-4 py-3 text-xs text-ink-900 hover:bg-ember-light"
          >
            <Plus size={15} /> Quick Add
          </button>
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-900/90 text-sand backdrop-blur transition-colors hover:text-teal"
              aria-label={`Quick view ${product.shortName}`}
            >
              <Eye size={17} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <StarRating value={product.rating} size={13} />
          <span className="text-xs text-haze">{product.reviewCount} reviews</span>
        </div>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-heading text-base font-semibold uppercase tracking-wide text-sand transition-colors group-hover:text-ember">
            {product.shortName}
          </h3>
        </Link>
        <p className="text-sm text-haze">{product.tagline}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-2xl text-sand">{formatPrice(product.price)}</span>
          <span className="text-xs uppercase tracking-luxe text-haze">{product.weight}</span>
        </div>
      </div>
    </motion.article>
  );
}

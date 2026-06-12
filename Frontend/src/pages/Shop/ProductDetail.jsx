import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { useCart } from '../../context/CartContext';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import Seo from '../../components/ui/Seo';
import StarRating from '../../components/ui/StarRating';
import ProductCard from '../../components/product/ProductCard';
import { formatPrice } from '../../utils/format';
import { fadeUp } from '../../utils/motion';

export default function ProductDetail() {
  const { slug } = useParams();
  const { getProductBySlug, getRelated, products, loading } = useProducts();
  const product = getProductBySlug(slug);
  const { addItem } = useCart();
  const { track, recentIds } = useRecentlyViewed();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [tab, setTab] = useState('description');

  useEffect(() => {
    if (product) track(product.id);
  }, [product, track]);

  if (!product) {
    if (loading) {
      return (
        <div className="container-luxe py-32 text-center">
          <p className="text-lg text-haze">Loading product…</p>
        </div>
      );
    }
    return (
      <div className="container-luxe py-32 text-center">
        <h1 className="font-display text-4xl uppercase text-sand">Product not found</h1>
        <Link to="/shop" className="btn-primary mt-8">Back to Shop</Link>
      </div>
    );
  }

  const related = getRelated(product);
  const recentlyViewed = recentIds
    .filter((id) => id !== product.id)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 3);

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'nutrition', label: 'Nutrition' },
  ];

  return (
    <>
      <Seo
        title={product.shortName}
        description={product.description[0]}
        path={`/product/${product.slug}`}
      />

      <div className="container-luxe py-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-haze transition-colors hover:text-ember">
          <ChevronLeft size={16} /> Back to Shop
        </Link>
      </div>

      <section className="container-luxe pb-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square overflow-hidden rounded-3xl border border-white/10 bg-ink-700"
            >
              <img
                src={product.gallery[activeImage]}
                alt={product.shortName}
                className="h-full w-full object-cover"
              />
            </motion.div>
            {product.gallery.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border transition-colors ${
                      activeImage === i ? 'border-ember' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sticky purchase panel */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">{product.flavor} · {product.meat}</span>
            {product.badge && (
              <span className="ml-3 rounded-full bg-ember/20 px-3 py-1 text-[10px] font-bold uppercase tracking-luxe text-ember">
                {product.badge}
              </span>
            )}

            <h1 className="display-hero mt-3 text-4xl text-sand sm:text-5xl">
              {product.shortName}
            </h1>

            <div className="mt-4 flex items-center gap-4">
              <StarRating value={product.rating} size={16} showValue />
              <span className="text-sm text-haze">({product.reviewCount} reviews)</span>
            </div>

            <p className="mt-4 text-lg italic text-sand/80">{product.tagline}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.flavorNotes.map((note) => (
                <span
                  key={note}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-sand/80"
                >
                  {note}
                </span>
              ))}
            </div>

            <p className="mt-8 font-display text-4xl text-ember">{formatPrice(product.price)}</p>
            <p className="text-sm text-haze">{product.weight}</p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-4 rounded-full border border-white/15 px-4 py-3">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                  <Minus size={18} className="text-haze hover:text-sand" />
                </button>
                <span className="w-6 text-center font-semibold text-sand">{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase">
                  <Plus size={18} className="text-haze hover:text-sand" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => addItem(product, qty)}
                className="btn-primary flex-1"
              >
                Add to Cart
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-6 text-xs text-haze">
              <span className="inline-flex items-center gap-2">
                <Truck size={14} className="text-teal" /> Free shipping over $40
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={14} className="text-teal" /> Secure checkout
              </span>
            </div>

            {/* Tabs */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <div className="flex gap-1 border-b border-white/10">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-luxe transition-colors ${
                      tab === t.id
                        ? 'border-b-2 border-ember text-ember'
                        : 'text-haze hover:text-sand'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 text-sm leading-relaxed text-haze">
                {tab === 'description' && (
                  <div className="space-y-4">
                    {product.description.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
                {tab === 'ingredients' && (
                  <div>
                    <p>{product.ingredients}</p>
                    <p className="mt-4 text-ember">{product.allergens}</p>
                  </div>
                )}
                {tab === 'nutrition' && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {Object.entries(product.nutrition).map(([key, val]) => (
                      <div key={key} className="rounded-xl border border-white/10 p-4 text-center">
                        <p className="font-display text-2xl text-sand">{val}</p>
                        <p className="mt-1 text-xs uppercase tracking-luxe text-haze">{key}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-white/10 bg-ink-800 py-20">
          <div className="container-luxe">
            <h2 className="font-display text-3xl uppercase tracking-wide text-sand">You May Also Like</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <motion.div key={p.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <ProductCard product={p} index={i} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <section className="border-t border-white/10 bg-ink-900 py-20">
          <div className="container-luxe">
            <h2 className="font-display text-3xl uppercase tracking-wide text-sand">Recently Viewed</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recentlyViewed.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { products } from '../../data/products';
import { collections } from '../../data/collections';
import { lifestyleBoard } from '../../assets';
import Seo from '../../components/ui/Seo';
import ProductCard from '../../components/product/ProductCard';
import QuickView from '../../components/product/QuickView';
import { staggerContainer, fadeUp, viewportOnce } from '../../utils/motion';
import { cn } from '../../utils/format';

const meats = ['All', 'Elk', 'Venison', 'Buffalo'];
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [meat, setMeat] = useState('All');
  const [sort, setSort] = useState('featured');
  const [quickView, setQuickView] = useState(null);

  const collectionSlug = params.get('collection');
  const viewCollections = params.get('view') === 'collections';

  const filtered = useMemo(() => {
    let list = [...products];

    if (collectionSlug) {
      const col = collections.find((c) => c.slug === collectionSlug);
      if (col) list = list.filter((p) => p.flavor.toLowerCase().replace(/\s+/g, '-') === collectionSlug || p.flavor === col.name);
    }

    if (meat !== 'All') list = list.filter((p) => p.meat === meat);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.shortName.toLowerCase().includes(q) ||
          p.flavor.toLowerCase().includes(q) ||
          p.meat.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      default:
        return list.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
    }
  }, [collectionSlug, meat, search, sort]);

  const activeCollection = collections.find((c) => c.slug === collectionSlug);

  if (viewCollections) {
    return (
      <>
        <Seo title="Flavor Collections" description="Shop Uncommon Ground jerky by flavor profile." path="/shop" />
        <ShopHero title="Flavor Collections" subtitle="Six bold profiles. One uncommon standard." />
        <section className="bg-ink-900 py-16">
          <div className="container-luxe grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => setParams({ collection: col.slug })}
                className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 text-left"
              >
                <img src={col.image} alt={col.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h2 className="font-display text-3xl uppercase text-sand group-hover:text-ember">{col.name}</h2>
                  <p className="mt-2 text-sm text-haze">{col.blurb}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo
        title={activeCollection ? `${activeCollection.name} Jerky` : 'Shop Jerky'}
        description="Premium small-batch jerky from Springville, Utah."
        path="/shop"
      />
      <ShopHero
        title={activeCollection ? activeCollection.name : 'Shop Jerky'}
        subtitle={activeCollection ? activeCollection.blurb : 'Premium small-batch jerky crafted in Springville, Utah.'}
      />

      <section className="bg-ink-900 py-12 lg:py-16">
        <div className="container-luxe">
          {/* Filters bar */}
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-800/60 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-haze" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jerky..."
                className="w-full rounded-full border border-white/10 bg-ink-700 py-3 pl-11 pr-4 text-sm text-sand placeholder:text-haze focus:border-ember focus:outline-none"
                aria-label="Search products"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-haze" />
                {meats.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMeat(m)}
                    className={cn(
                      'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-luxe transition-colors',
                      meat === m
                        ? 'bg-ember text-ink-900'
                        : 'border border-white/10 text-haze hover:text-sand'
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-white/10 bg-ink-700 px-4 py-2.5 text-xs uppercase tracking-luxe text-sand focus:border-ember focus:outline-none"
                aria-label="Sort products"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Collection pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setParams({})}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-luxe transition-colors',
                !collectionSlug ? 'bg-teal text-ink-900' : 'border border-white/10 text-haze hover:text-sand'
              )}
            >
              All Flavors
            </button>
            {collections.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => setParams({ collection: col.slug })}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-luxe transition-colors',
                  collectionSlug === col.slug
                    ? 'bg-teal text-ink-900'
                    : 'border border-white/10 text-haze hover:text-sand'
                )}
              >
                {col.name}
              </button>
            ))}
          </div>

          <p className="mt-6 text-sm text-haze">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          </p>

          <motion.div
            variants={staggerContainer(0.06)}
            initial="hidden"
            animate="visible"
            viewport={viewportOnce}
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map((product, i) => (
              <motion.div key={product.id} variants={fadeUp} className="h-full">
                <ProductCard product={product} index={i} onQuickView={setQuickView} />
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-haze">No products match your filters.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setMeat('All');
                  setParams({});
                }}
                className="btn-secondary mt-6"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}

function ShopHero({ title, subtitle }) {
  return (
    <section className="relative flex min-h-[40vh] items-end overflow-hidden">
      <img
        src={lifestyleBoard}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/70 to-ink-900/40" />
      <div className="container-luxe relative z-10 pb-12 pt-28">
        <span className="eyebrow">Uncommon Ground</span>
        <h1 className="display-hero mt-3 text-5xl text-sand sm:text-6xl lg:text-7xl">{title}</h1>
        <p className="mt-4 max-w-xl text-lg text-haze">{subtitle}</p>
      </div>
    </section>
  );
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '../lib/api';
import { resolveImage } from '../lib/assetMap';
import { products as staticProducts } from '../data/products';
import { collections as staticCollections } from '../data/collections';

const ProductsContext = createContext(null);

// Convert an API product (image keys) into the shape the UI components expect
// (resolved `image` + `gallery`).
const normalizeProduct = (p) => ({
  ...p,
  image: resolveImage(p.imageKey),
  gallery:
    Array.isArray(p.galleryKeys) && p.galleryKeys.length
      ? p.galleryKeys.map(resolveImage)
      : [resolveImage(p.imageKey)],
});

const normalizeCollection = (c) => ({
  ...c,
  image: resolveImage(c.imageKey),
});

export function ProductsProvider({ children }) {
  // Seed with the bundled catalog so the UI renders instantly and still works
  // if the backend is unreachable; replaced by live data once fetched.
  const [products, setProducts] = useState(staticProducts);
  const [collections, setCollections] = useState(staticCollections);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('static');

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [{ products: apiProducts }, { collections: apiCollections }] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/collections'),
      ]);
      if (Array.isArray(apiProducts) && apiProducts.length) {
        setProducts(apiProducts.map(normalizeProduct));
      }
      if (Array.isArray(apiCollections) && apiCollections.length) {
        setCollections(apiCollections.map(normalizeCollection));
      }
      setSource('api');
    } catch {
      // Keep the bundled fallback already in state.
      setSource('static');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Keep the storefront in sync in near real-time: refetch when the tab
  // regains focus/visibility and on a light background interval.
  useEffect(() => {
    const onFocus = () => refresh();
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, 30000);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(interval);
    };
  }, [refresh]);

  const getProductBySlug = useCallback(
    (slug) => products.find((p) => p.slug === slug),
    [products]
  );
  const getProductById = useCallback(
    (id) => products.find((p) => p.id === id),
    [products]
  );
  const getBestSellers = useCallback(
    () => products.filter((p) => p.bestSeller),
    [products]
  );
  const getRelated = useCallback(
    (product, count = 3) => {
      if (!product) return [];
      const related = (product.pairs || [])
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean);
      if (related.length >= count) return related.slice(0, count);
      const fillers = products.filter(
        (p) => p.id !== product.id && !related.includes(p)
      );
      return [...related, ...fillers].slice(0, count);
    },
    [products]
  );
  const getCollectionBySlug = useCallback(
    (slug) => collections.find((c) => c.slug === slug),
    [collections]
  );

  const value = useMemo(
    () => ({
      products,
      collections,
      loading,
      source,
      refresh,
      getProductBySlug,
      getProductById,
      getBestSellers,
      getRelated,
      getCollectionBySlug,
    }),
    [
      products,
      collections,
      loading,
      source,
      refresh,
      getProductBySlug,
      getProductById,
      getBestSellers,
      getRelated,
      getCollectionBySlug,
    ]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider');
  return ctx;
}

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useCallback,
} from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'ug-cart-v1';

const loadInitial = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, quantity } = action;
      const existing = state.find((item) => item.id === product.id);
      if (existing) {
        return state.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...state,
        {
          id: product.id,
          slug: product.slug,
          name: product.shortName || product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    }
    case 'REMOVE':
      return state.filter((item) => item.id !== action.id);
    case 'SET_QTY':
      return state
        .map((item) =>
          item.id === action.id
            ? { ...item, quantity: Math.max(0, action.quantity) }
            : item
        )
        .filter((item) => item.quantity > 0);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadInitial);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items]);

  const addItem = useCallback((product, quantity = 1) => {
    dispatch({ type: 'ADD', product, quantity });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', id }), []);
  const setQuantity = useCallback(
    (id, quantity) => dispatch({ type: 'SET_QTY', id, quantity }),
    []
  );
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const { count, subtotal } = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc.count += item.quantity;
          acc.subtotal += item.quantity * item.price;
          return acc;
        },
        { count: 0, subtotal: 0 }
      ),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((v) => !v),
      addItem,
      removeItem,
      setQuantity,
      clear,
    }),
    [items, count, subtotal, isOpen, addItem, removeItem, setQuantity, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

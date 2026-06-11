import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { formatPrice } from '../../utils/format';
import { EASE } from '../../utils/motion';

const FREE_SHIP = 40;

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, setQuantity, subtotal, count } = useCart();
  useLockBodyScroll(isOpen);

  const remaining = Math.max(0, FREE_SHIP - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm" onClick={closeCart} />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ink-800 shadow-card"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: EASE }}
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="font-display text-2xl uppercase tracking-wide text-sand">
                Your Cart <span className="text-ember">({count})</span>
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-sand hover:border-ember hover:text-ember"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {items.length > 0 && (
              <div className="border-b border-white/10 px-6 py-4">
                <p className="mb-2 text-xs text-haze">
                  {remaining > 0 ? (
                    <>
                      You are <span className="font-semibold text-sand">{formatPrice(remaining)}</span> away
                      from free shipping
                    </>
                  ) : (
                    <span className="font-semibold text-teal">You unlocked free shipping!</span>
                  )}
                </p>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-ember to-teal transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-white/5 text-haze">
                    <ShoppingBag size={26} />
                  </div>
                  <p className="text-haze">Your cart is empty.</p>
                  <Link to="/shop" onClick={closeCart} className="btn-primary mt-2">
                    Shop Jerky
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-ink-700"
                      >
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-sand">
                            {item.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-haze transition-colors hover:text-ember"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-ember">{formatPrice(item.price)}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-full border border-white/10 px-2 py-1">
                            <button
                              type="button"
                              onClick={() => setQuantity(item.id, item.quantity - 1)}
                              className="text-haze hover:text-sand"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-5 text-center text-sm text-sand">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity(item.id, item.quantity + 1)}
                              className="text-haze hover:text-sand"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-sand">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/10 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm uppercase tracking-luxe text-haze">Subtotal</span>
                  <span className="font-display text-2xl text-sand">{formatPrice(subtotal)}</span>
                </div>
                <Link to="/cart" onClick={closeCart} className="btn-primary w-full">
                  Checkout
                </Link>
                <button
                  type="button"
                  onClick={closeCart}
                  className="btn-ghost mt-2 w-full"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

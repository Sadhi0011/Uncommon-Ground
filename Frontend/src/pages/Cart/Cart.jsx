import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import Seo from '../../components/ui/Seo';
import { formatPrice } from '../../utils/format';

const FREE_SHIP = 40;

export default function Cart() {
  const { items, removeItem, setQuantity, subtotal, count, clear } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const shipping = subtotal >= FREE_SHIP ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setCheckoutError('');
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    setPlacing(true);
    try {
      await api.post(
        '/api/orders',
        { items: items.map((it) => ({ id: it.id, quantity: it.quantity })) },
        { auth: true }
      );
      clear();
      setPlaced(true);
    } catch (err) {
      setCheckoutError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <Seo title="Your Cart" description="Review your Uncommon Ground jerky order." path="/cart" />

      <section className="bg-ink-900 py-16 lg:py-24">
        <div className="container-luxe max-w-4xl">
          <h1 className="display-hero text-5xl text-sand">
            Your Cart <span className="text-ember">({count})</span>
          </h1>

          {placed ? (
            <div className="mt-16 flex flex-col items-center gap-6 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-teal/15 text-teal">
                <ShoppingBag size={32} />
              </div>
              <div>
                <h2 className="font-display text-3xl uppercase text-sand">Order placed!</h2>
                <p className="mt-2 text-haze">Thanks for your order — a confirmation is on its way.</p>
              </div>
              <Link to="/shop" className="btn-primary">Continue Shopping</Link>
            </div>
          ) : items.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-6 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-white/5 text-haze">
                <ShoppingBag size={32} />
              </div>
              <p className="text-lg text-haze">Your cart is empty — time to stock up.</p>
              <Link to="/shop" className="btn-primary">Shop Jerky</Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-5 rounded-2xl border border-white/10 bg-ink-800/60 p-5"
                  >
                    <Link
                      to={`/product/${item.slug}`}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10"
                    >
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <Link
                          to={`/product/${item.slug}`}
                          className="font-heading text-sm font-semibold uppercase tracking-wide text-sand hover:text-ember"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-haze hover:text-ember"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-ember">{formatPrice(item.price)}</p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center gap-3 rounded-full border border-white/10 px-2 py-1">
                          <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="Decrease">
                            <Minus size={14} className="text-haze" />
                          </button>
                          <span className="w-5 text-center text-sm text-sand">{item.quantity}</span>
                          <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Increase">
                            <Plus size={14} className="text-haze" />
                          </button>
                        </div>
                        <span className="font-semibold text-sand">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
                <button type="button" onClick={clear} className="btn-ghost text-xs">
                  Clear Cart
                </button>
              </ul>

              <div className="h-fit rounded-2xl border border-white/10 bg-ink-800/60 p-6">
                <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-sand">
                  Order Summary
                </h2>
                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-haze">
                    <dt>Subtotal</dt>
                    <dd className="text-sand">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-haze">
                    <dt>Shipping</dt>
                    <dd className="text-sand">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </dd>
                  </div>
                  {subtotal < FREE_SHIP && (
                    <p className="text-xs text-haze">
                      Add {formatPrice(FREE_SHIP - subtotal)} more for free shipping
                    </p>
                  )}
                  <div className="flex justify-between border-t border-white/10 pt-3 font-semibold">
                    <dt className="text-sand">Total</dt>
                    <dd className="font-display text-2xl text-ember">{formatPrice(total)}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={placing}
                  className="btn-primary mt-6 w-full disabled:opacity-60"
                >
                  {placing ? 'Placing order…' : isAuthenticated ? 'Proceed to Checkout' : 'Log in to Checkout'}
                </button>
                {checkoutError && (
                  <p className="mt-3 text-center text-sm text-red-400" role="alert">{checkoutError}</p>
                )}
                <Link to="/shop" className="btn-ghost mt-3 w-full">
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

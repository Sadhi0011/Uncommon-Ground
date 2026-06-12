import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogIn, LogOut, Menu, ShoppingBag, User, X } from 'lucide-react';
import { logo } from '../../assets';
import { navLinks } from '../../data/navigation';
import { brand } from '../../data/brand';
import { useScrolled } from '../../hooks/useScrolled';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { cn } from '../../utils/format';
import { EASE } from '../../utils/motion';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar() {
  const scrolled = useScrolled(40);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, openCart } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { pathname, search } = useLocation();
  useLockBodyScroll(mobileOpen);

  const isActive = (to) => {
    const [base, query] = to.split('?');
    if (base === '/') return pathname === '/';
    if (!pathname.startsWith(base)) return false;
    // Disambiguate links that share a base path but differ by query
    // (e.g. /shop vs /shop?view=collections).
    if (base === '/shop') {
      const linkView = new URLSearchParams(query || '').get('view');
      const currentView = new URLSearchParams(search).get('view');
      return (linkView || null) === (currentView || null);
    }
    return true;
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-500',
        scrolled
          ? 'border-b border-white/10 bg-ink-900/85 backdrop-blur-xl shadow-card'
          : 'border-b border-transparent bg-gradient-to-b from-ink-900/60 to-transparent backdrop-blur-[2px]'
      )}
    >
      <nav className="container-luxe flex h-20 items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center" aria-label={`${brand.name} home`}>
          <img
            src={logo}
            alt={brand.name}
            className="h-12 w-auto sm:h-14"
            width="168"
            height="56"
          />
        </Link>

        {/* Center nav */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                className={cn(
                  'link-underline font-heading text-sm font-medium uppercase tracking-luxe transition-colors',
                  isActive(link.to) ? 'text-ember' : 'text-sand/85 hover:text-sand'
                )}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Auth controls (desktop) */}
          {isAuthenticated ? (
            <div className="hidden items-center gap-2 lg:flex">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 rounded-full border border-ember/40 bg-ember/10 px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-luxe text-ember transition-colors hover:bg-ember/20"
                >
                  Dashboard
                </Link>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-luxe text-sand">
                <User size={14} className="text-ember" />
                {user?.name?.split(' ')[0] || 'Account'}
              </span>
              <button
                type="button"
                onClick={logout}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-sand transition-colors hover:border-ember hover:text-ember"
                aria-label="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-luxe text-sand transition-colors hover:border-ember hover:text-ember"
              >
                <LogIn size={14} /> Log In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-ember px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-luxe text-onink transition-colors hover:bg-ember-light"
              >
                Sign Up
              </Link>
            </div>
          )}

          <ThemeToggle />
          <button
            type="button"
            onClick={openCart}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-sand transition-colors hover:border-ember hover:text-ember"
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[10px] font-bold text-onink">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-sand transition-colors hover:border-ember hover:text-ember lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-ink-800 p-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="flex items-center justify-between">
                <img src={logo} alt={brand.name} className="h-9 w-auto" />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-sand"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              <ul className="mt-10 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, ease: EASE }}
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block border-b border-white/5 py-4 font-display text-3xl uppercase tracking-wide transition-colors',
                        isActive(link.to) ? 'text-ember' : 'text-sand hover:text-ember'
                      )}
                    >
                      {link.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto">
                {/* Auth (mobile) */}
                {isAuthenticated ? (
                  <div className="mb-5 space-y-3">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-ember/40 bg-ember/10 py-3 font-heading text-xs font-semibold uppercase tracking-luxe text-ember"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-sand">
                        <User size={16} className="text-ember" />
                        {user?.name?.split(' ')[0] || 'Account'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-haze hover:text-ember"
                      >
                        <LogOut size={16} /> Log out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-5 grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 font-heading text-xs font-semibold uppercase tracking-luxe text-sand hover:border-ember hover:text-ember"
                    >
                      <LogIn size={14} /> Log In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ember py-3 font-heading text-xs font-semibold uppercase tracking-luxe text-onink hover:bg-ember-light"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
                <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm font-medium text-sand">Theme</span>
                  <ThemeToggle />
                </div>
                <div className="space-y-1 text-sm text-haze">
                  <a href={brand.contact.phoneHref} className="block hover:text-ember">
                    {brand.contact.phone}
                  </a>
                  <a href={`mailto:${brand.contact.email}`} className="block hover:text-ember">
                    {brand.contact.email}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  BarChart3,
  Boxes,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ReceiptText,
  Store,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/format';

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/sales', label: 'Sales', icon: BarChart3 },
  { to: '/admin/orders', label: 'Orders', icon: ReceiptText },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Boxes },
  { to: '/admin/inbox', label: 'Inbox', icon: Inbox },
];

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
              isActive
                ? 'bg-ember/15 text-ember'
                : 'text-haze hover:bg-white/5 hover:text-sand'
            )
          }
        >
          <item.icon size={18} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-ink-900 text-sand">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-ink-800 p-5 lg:flex">
        <Link to="/admin" className="mb-8 flex items-center gap-2 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ember text-onink">
            <LayoutDashboard size={18} />
          </span>
          <span className="font-display text-xl uppercase tracking-wide text-sand">Admin</span>
        </Link>
        <NavItems />
        <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-haze transition-colors hover:bg-white/5 hover:text-sand"
          >
            <Store size={18} /> View Store
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-haze transition-colors hover:bg-white/5 hover:text-ember"
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-white/10 bg-ink-800 p-5">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-xl uppercase tracking-wide text-sand">Admin</span>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={20} className="text-sand" />
              </button>
            </div>
            <NavItems onNavigate={() => setMobileOpen(false)} />
            <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-haze hover:text-sand">
                <Store size={18} /> View Store
              </Link>
              <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-haze hover:text-ember">
                <LogOut size={18} /> Log Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-ink-900/85 px-4 backdrop-blur-xl lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-sand lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-haze sm:block">{user?.email}</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ember/15 text-sm font-bold uppercase text-ember">
              {(user?.name || 'A').charAt(0)}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

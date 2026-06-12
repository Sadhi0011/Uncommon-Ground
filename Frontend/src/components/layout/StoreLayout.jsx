import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from '../navigation/Navbar';
import CartDrawer from '../navigation/CartDrawer';
import Footer from '../footer/Footer';
import AnnouncementBar from './AnnouncementBar';
import ScrollToTop from './ScrollToTop';
import ScrollProgress from '../ui/ScrollProgress';
import PageTransition from './PageTransition';

export default function StoreLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-ink-900">
      <ScrollProgress />
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />

      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

import { Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/navigation/Navbar';
import CartDrawer from './components/navigation/CartDrawer';
import Footer from './components/footer/Footer';
import AnnouncementBar from './components/layout/AnnouncementBar';
import ScrollToTop from './components/layout/ScrollToTop';
import ScrollProgress from './components/ui/ScrollProgress';
import PageTransition from './components/layout/PageTransition';
import Loader from './components/ui/Loader';

const Home = lazy(() => import('./pages/Home/Home'));
const Shop = lazy(() => import('./pages/Shop/Shop'));
const ProductDetail = lazy(() => import('./pages/Shop/ProductDetail'));
const About = lazy(() => import('./pages/About/About'));
const Podcast = lazy(() => import('./pages/Podcast/Podcast'));
const Community = lazy(() => import('./pages/Community/Community'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-ink-900">
      <ScrollProgress />
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />

      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
            <Route path="/product/:slug" element={<PageTransition><ProductDetail /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/podcast" element={<PageTransition><Podcast /></PageTransition>} />
            <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      <Footer />
    </div>
  );
}

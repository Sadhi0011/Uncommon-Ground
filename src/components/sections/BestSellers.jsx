import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

import { getBestSellers } from '../../data/products';
import SectionHeading from '../ui/SectionHeading';
import ProductCard from '../product/ProductCard';
import QuickView from '../product/QuickView';

export default function BestSellers() {
  const products = getBestSellers();
  const [quickView, setQuickView] = useState(null);

  return (
    <section className="bg-ink-900 py-24 lg:py-32">
      <div className="container-luxe">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="What Jerky Lovers Reach For"
            title="Best Sellers"
            description="The flavors our community keeps coming back to — packed with lean protein and built for the trail."
          />
          <div className="flex items-center gap-3">
            <button
              className="best-prev grid h-12 w-12 place-items-center rounded-full border border-white/15 text-sand transition-colors hover:border-ember hover:text-ember"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="best-next grid h-12 w-12 place-items-center rounded-full border border-white/15 text-sand transition-colors hover:border-ember hover:text-ember"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="mt-12">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={20}
            slidesPerView={1.15}
            navigation={{ prevEl: '.best-prev', nextEl: '.best-next' }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="!pb-14"
          >
            {products.map((product, i) => (
              <SwiperSlide key={product.id} className="h-auto">
                <ProductCard product={product} index={i} onQuickView={setQuickView} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-2 text-center">
          <Link to="/shop" className="btn-secondary">
            Shop All Jerky
          </Link>
        </div>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}

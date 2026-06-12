import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, A11y } from 'swiper/modules';
import { Quote } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

import { testimonials } from '../../data/testimonials';
import SectionHeading from '../ui/SectionHeading';
import StarRating from '../ui/StarRating';

export default function Reviews() {
  return (
    <section className="bg-ink-900 py-24 lg:py-32">
      <div className="container-luxe">
        <SectionHeading
          align="center"
          eyebrow="Real People · Real Fuel"
          title="What Jerky Lovers Are Saying"
        />

        <div className="mx-auto mt-6 flex items-center justify-center gap-3">
          <StarRating value={5} size={18} />
          <span className="text-sm text-haze">
            Loved by the community across Utah Valley
          </span>
        </div>

        <div className="mt-12">
          <Swiper
            modules={[Autoplay, Pagination, A11y]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{ 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}
            className="!pb-14"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id} className="h-auto">
                <figure className="flex h-full flex-col rounded-3xl border border-white/10 bg-ink-700/60 p-8">
                  <Quote size={32} className="text-ember/60" />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-sand/90">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-4 border-t border-white/10 pt-6">
                    <img
                      src={t.avatar}
                      alt=""
                      className="h-12 w-12 rounded-full border border-white/10 bg-[#fff] object-cover"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-heading text-sm font-semibold uppercase tracking-wide text-sand">
                        {t.name} · {t.location}
                      </p>
                      <p className="text-xs text-ember">{t.product}</p>
                      <StarRating value={t.rating} size={12} className="mt-1" />
                    </div>
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

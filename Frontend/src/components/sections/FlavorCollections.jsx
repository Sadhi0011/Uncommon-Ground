import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import SectionHeading from '../ui/SectionHeading';
import { staggerContainer, fadeUp, viewportOnce } from '../../utils/motion';

export default function FlavorCollections() {
  const { collections } = useProducts();
  return (
    <section className="bg-ink-800 py-24 lg:py-32">
      <div className="container-luxe">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Shop Utah Local"
            title="Flavor Collections"
            description="Six bold profiles, each built with intention. Find where your jerky journey begins."
          />
          <Link to="/shop?view=collections" className="btn-ghost shrink-0">
            View All →
          </Link>
        </div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {collections.map((collection) => (
            <motion.div key={collection.id} variants={fadeUp}>
              <Link
                to={`/shop?collection=${collection.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-3xl border border-white/10"
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-3xl uppercase tracking-wide text-sand transition-colors group-hover:text-ember">
                      {collection.name}
                    </h3>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/5 text-sand backdrop-blur transition-all duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-onink">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <p className="mt-2 max-w-xs translate-y-2 text-sm text-haze opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {collection.blurb}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

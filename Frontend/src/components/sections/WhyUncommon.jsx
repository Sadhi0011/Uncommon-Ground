import { motion } from 'framer-motion';
import { HeartHandshake, Leaf, ShieldCheck, Truck } from 'lucide-react';
import { features } from '../../data/features';
import SectionHeading from '../ui/SectionHeading';
import { staggerContainer, fadeUp, viewportOnce } from '../../utils/motion';

const iconMap = { Leaf, HeartHandshake, Truck, ShieldCheck };

export default function WhyUncommon() {
  return (
    <section className="relative overflow-hidden bg-ink-800 py-24 lg:py-32">
      <div className="container-luxe">
        <SectionHeading
          align="center"
          eyebrow="The Uncommon Standard"
          title="Why Uncommon Ground"
          description="Premium ingredients, real service, and a craft you can taste in every batch."
        />

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.id}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-700/60 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-ember/40"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-ember/10 blur-2xl transition-all duration-500 group-hover:bg-ember/20" />
                <div className="relative mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-ember/20 to-teal/10 text-ember transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {Icon && <Icon size={26} />}
                </div>
                <h3 className="font-heading text-lg font-semibold uppercase tracking-wide text-sand">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-haze">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

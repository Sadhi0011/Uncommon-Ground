import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Heart, Mountain } from 'lucide-react';
import { lifestyleBoard } from '../../assets';
import Reveal from '../ui/Reveal';
import { imageReveal, staggerContainer, fadeUp, viewportOnce } from '../../utils/motion';

const highlights = [
  { icon: Heart, label: 'Woman-Owned' },
  { icon: Mountain, label: 'Utah Roots' },
  { icon: Award, label: 'Small-Batch Craft' },
];

export default function BrandStory() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 lg:py-32">
      <div className="container-luxe grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Text */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <span className="eyebrow">A Proud Woman-Owned Business</span>
          </Reveal>
          <Reveal>
            <h2 className="display-hero mt-4 text-4xl text-sand sm:text-5xl lg:text-6xl">
              Bold flavor with a<span className="text-ember"> grounded soul</span>
            </h2>
          </Reveal>
          <Reveal>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-haze">
              <p>
                At <span className="text-sand">Uncommon Ground</span>, we produce premium jerky and
                beef snack sticks inspired by the rugged landscapes and grounded lifestyle of
                Springville, Utah.
              </p>
              <p>
                Every flavor is thoughtfully developed to balance boldness, texture, and
                authenticity — made for trail days, long drives, and everyday fuel.
              </p>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-9 flex flex-wrap gap-3"
          >
            {highlights.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5"
              >
                <Icon size={16} className="text-teal" />
                <span className="text-sm font-medium text-sand">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          <Reveal>
            <Link to="/about" className="btn-secondary mt-9">
              Read Our Story
            </Link>
          </Reveal>
        </div>

        {/* Image */}
        <Reveal variants={imageReveal} className="order-1 lg:order-2">
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-ember/20 to-teal/20 blur-2xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
              <img
                src={lifestyleBoard}
                alt="Uncommon Ground jerky served on a wooden board"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/10 bg-ink-800/90 p-5 backdrop-blur sm:block">
              <p className="font-display text-4xl text-ember">2022</p>
              <p className="text-xs uppercase tracking-luxe text-haze">Founded in Utah</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

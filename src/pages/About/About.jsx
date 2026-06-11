import { motion } from 'framer-motion';
import {
  Activity,
  Compass,
  Handshake,
  Heart,
  Leaf,
  Lightbulb,
  Mountain,
  Users,
} from 'lucide-react';
import { lifestyleBoard } from '../../assets';
import { brand } from '../../data/brand';
import { values, drivingForce, timeline } from '../../data/values';
import { communityImpact } from '../../data/navigation';
import Seo from '../../components/ui/Seo';
import SectionHeading from '../../components/ui/SectionHeading';
import Reveal from '../../components/ui/Reveal';
import { staggerContainer, fadeUp, viewportOnce } from '../../utils/motion';

const iconMap = {
  Compass,
  Users,
  Heart,
  Handshake,
  Lightbulb,
  Leaf,
  Activity,
  Mountain,
};

export default function About() {
  return (
    <>
      <Seo
        title="Our Story"
        description="Uncommon Ground is a woman-owned, Utah-based jerky brand built on bold flavor and grounded values."
        path="/about"
      />

      {/* Hero */}
      <section className="relative flex min-h-[55vh] items-end overflow-hidden">
        <img src={lifestyleBoard} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/70 to-ink-900/30" />
        <div className="container-luxe relative z-10 pb-16 pt-32">
          <span className="eyebrow">About Us</span>
          <h1 className="display-hero mt-4 max-w-3xl text-5xl text-sand sm:text-6xl lg:text-7xl">
            Standing on <span className="text-ember">uncommon ground</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-haze">
            A woman-owned business rooted in Springville, Utah — crafting premium jerky and building
            community one bold batch at a time.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-ink-900 py-24">
        <div className="container-luxe max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">Our Mission</span>
          </Reveal>
          <Reveal>
            <p className="mt-6 text-xl leading-relaxed text-sand sm:text-2xl">
              {drivingForce}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-ink-800 py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading eyebrow="Our Journey" title="The Story So Far" align="center" />
          <div className="relative mx-auto mt-16 max-w-3xl">
            <div className="absolute left-6 top-0 h-full w-px bg-white/10 md:left-1/2" />
            <motion.div
              variants={staggerContainer(0.15)}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="space-y-12"
            >
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  variants={fadeUp}
                  className={`relative flex items-start gap-8 md:gap-0 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <span className="font-display text-3xl text-ember">{item.year}</span>
                    <h3 className="mt-2 font-heading text-lg font-semibold uppercase tracking-wide text-sand">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-haze">{item.description}</p>
                  </div>
                  <div className="absolute left-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-ember md:left-1/2" />
                  <div className="hidden flex-1 md:block" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ink-900 py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="What Guides Us"
            title="Our Values"
            description="Eight principles that shape every batch, every conversation, and every connection."
            align="center"
          />
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value) => {
              const Icon = iconMap[value.icon];
              return (
                <motion.div
                  key={value.id}
                  variants={fadeUp}
                  className="group rounded-3xl border border-white/10 bg-ink-700/60 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-teal/40"
                >
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-teal/10 text-teal transition-transform duration-500 group-hover:scale-110">
                    {Icon && <Icon size={22} />}
                  </div>
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-sand">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-haze">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="relative overflow-hidden bg-ink-800 py-24 lg:py-32">
        <img
          src={lifestyleBoard}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          aria-hidden="true"
        />
        <div className="container-luxe relative z-10">
          <SectionHeading
            eyebrow="Community"
            title="Impact Beyond the Bag"
            description="We measure success in more than sales — in the people, places and stories we help lift up."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {communityImpact.stats.map((stat) => (
              <Reveal key={stat.label}>
                <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6 text-center backdrop-blur">
                  <p className="font-display text-4xl text-ember">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-luxe text-haze">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {communityImpact.voices.map((voice) => (
              <Reveal key={voice.name}>
                <blockquote className="rounded-2xl border border-white/10 bg-ink-900/60 p-8 backdrop-blur">
                  <p className="text-lg italic leading-relaxed text-sand/90">"{voice.quote}"</p>
                  <footer className="mt-4 text-sm text-ember">— {voice.name}</footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

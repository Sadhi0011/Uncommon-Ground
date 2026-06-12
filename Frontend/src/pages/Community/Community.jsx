import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Handshake, Heart, MapPin, Mic, Users } from 'lucide-react';
import { lifestyleBoard } from '../../assets';
import { brand } from '../../data/brand';
import { communityImpact } from '../../data/navigation';
import Seo from '../../components/ui/Seo';
import SectionHeading from '../../components/ui/SectionHeading';
import Reveal from '../../components/ui/Reveal';
import { staggerContainer, fadeUp, viewportOnce } from '../../utils/motion';

const icons = [Handshake, Users, Mic, Heart];

export default function Community() {
  return (
    <>
      <Seo
        title="Community"
        description="Uncommon Ground is more than jerky — we are a community platform rooted in Springville, Utah."
        path="/community"
      />

      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-end overflow-hidden">
        <img src={lifestyleBoard} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/70 to-ink-900/30" />
        <div className="container-luxe relative z-10 pb-16 pt-32">
          <span className="eyebrow">Community</span>
          <h1 className="display-hero mt-4 max-w-3xl text-5xl text-sand sm:text-6xl lg:text-7xl">
            Built together on <span className="text-teal">common ground</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-haze">
            We are more than a jerky brand. We are a platform for local connection, honest
            conversation, and community impact.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-white/10 bg-ink-800 py-16">
        <div className="container-luxe grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {communityImpact.stats.map((stat) => (
            <Reveal key={stat.label}>
              <div className="rounded-2xl border border-white/10 bg-ink-700/60 p-8 text-center">
                <p className="font-display text-5xl text-ember">{stat.value}</p>
                <p className="mt-2 text-xs uppercase tracking-luxe text-haze">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Partnerships */}
      <section className="bg-ink-900 py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="How We Show Up"
            title="Local Partnerships & Impact"
            description="From sourcing to storytelling, everything we do is rooted in the people and places around us."
          />
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-14 grid gap-6 sm:grid-cols-2"
          >
            {communityImpact.partnerships.map((item, i) => {
              const Icon = icons[i] || Heart;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="group rounded-3xl border border-white/10 bg-ink-700/60 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-teal/40"
                >
                  <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-teal/10 text-teal transition-transform duration-500 group-hover:scale-110">
                    <Icon size={26} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold uppercase tracking-wide text-sand">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-haze">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Voices */}
      <section className="bg-ink-800 py-24">
        <div className="container-luxe">
          <SectionHeading eyebrow="Community Voices" title="Stories From the Ground" align="center" />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {communityImpact.voices.map((voice) => (
              <Reveal key={voice.name}>
                <blockquote className="rounded-3xl border border-white/10 bg-ink-700/60 p-10">
                  <p className="text-xl italic leading-relaxed text-sand/90">"{voice.quote}"</p>
                  <footer className="mt-6 font-heading text-sm font-semibold uppercase tracking-wide text-ember">
                    — {voice.name}
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Events CTA */}
      <section className="bg-ink-900 py-24">
        <div className="container-luxe grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Get Involved"
              title="Events & Meet-Ups"
              description="Markets, pop-ups, podcast recordings and community gatherings — we show up where our people are."
            />
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/podcast" className="btn-primary">
                <Mic size={16} /> Explore the Podcast
              </Link>
              <Link to="/contact" className="btn-secondary">
                Partner With Us
              </Link>
            </div>
          </div>
          <Reveal>
            <div className="space-y-4">
              {[
                { icon: Calendar, title: 'Local Markets', desc: 'Find us at farmers markets and pop-ups across Utah Valley.' },
                { icon: MapPin, title: 'Springville HQ', desc: brand.contact.address },
                { icon: Users, title: 'Community Events', desc: 'Podcast recordings, meet-ups and collaborative gatherings.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-ink-700/60 p-6"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ember/15 text-ember">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-sand">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-haze">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

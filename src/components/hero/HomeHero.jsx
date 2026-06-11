import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Mouse } from 'lucide-react';
import { heroVideo, lifestyleBoard } from '../../assets';
import { brand } from '../../data/brand';
import { EASE } from '../../utils/motion';

export default function HomeHero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={lifestyleBoard}
        aria-hidden="true"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900/90 via-ink-900/60 to-ink-900/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-ink-900/40" />
      <div className="pointer-events-none absolute inset-0 grain-overlay" />

      <div className="container-luxe relative z-10 pb-24 pt-16">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-luxe text-teal backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Woman-Owned · Est. {brand.established} · {brand.location}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="display-hero mt-6 max-w-4xl text-6xl text-sand sm:text-7xl lg:text-[7.5rem]"
        >
          Premium Utah
          <br />
          <span className="text-ember">Made Jerky</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-sand/85"
        >
          Crafted for the road ahead. Rooted in the outdoors.
          <span className="text-sand"> Elevated by intention.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Link to="/shop" className="btn-primary text-[#fff]">
            Shop Jerky
          </Link>
          <Link to="/podcast" className="btn-secondary">
            <Mic size={16} /> Listen to Podcast
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-sand/70"
      >
        <Mouse size={22} className="animate-scroll-bob" />
        <span className="text-[10px] uppercase tracking-wider2">Scroll</span>
      </motion.div>
    </section>
  );
}

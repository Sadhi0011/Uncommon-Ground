import { Link } from 'react-router-dom';
import { Headphones, Mic, Play } from 'lucide-react';
import { logo } from '../../assets';
import { episodes } from '../../data/podcast';
import Reveal from '../ui/Reveal';
import { imageReveal } from '../../utils/motion';

const featured = episodes.find((e) => e.featured) || episodes[0];

export default function PodcastPreview() {
  return (
    <section className="relative overflow-hidden bg-ink-800 py-24 lg:py-32">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-teal/10 blur-3xl" />
      <div className="container-luxe grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal variants={imageReveal}>
          <div className="relative mx-auto max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal/30 to-ember/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-700 p-10">
              <img src={logo} alt="Uncommon Ground Podcast" className="mx-auto h-32 w-auto" />
              <div className="mt-8 flex items-center justify-center gap-3">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-ember text-onink shadow-glow">
                  <Play size={24} fill="currentColor" />
                </span>
              </div>
              <p className="mt-6 text-center font-display text-2xl uppercase tracking-wide text-sand">
                Uncommon Ground Podcast
              </p>
              <p className="mt-2 text-center text-sm text-haze">
                Honest conversations with local leaders, creators & entrepreneurs
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow">Listen In</span>
          </Reveal>
          <Reveal>
            <h2 className="display-hero mt-4 text-4xl text-sand sm:text-5xl">
              Stories from <span className="text-teal">uncommon ground</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-5 text-base leading-relaxed text-haze">
              Our podcast brings together voices from our community — entrepreneurs, leaders,
              creators, and everyday people building something that matters.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-8 rounded-2xl border border-white/10 bg-ink-700/60 p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ember/15 text-ember">
                  <Mic size={22} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-luxe text-ember">{featured.number}</p>
                  <h3 className="mt-1 font-heading text-lg font-semibold uppercase tracking-wide text-sand">
                    {featured.title}
                  </h3>
                  <p className="mt-2 text-sm text-haze">{featured.description}</p>
                  <p className="mt-2 text-xs text-haze">
                    {featured.date} · {featured.duration}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/podcast" className="btn-primary">
                <Headphones size={16} /> Explore Episodes
              </Link>
              <a
                href={featured.spotify}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                Listen on Spotify
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

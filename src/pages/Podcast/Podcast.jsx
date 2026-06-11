import { useMemo, useState } from 'react';
import { ExternalLink, Headphones, Mic, Play, Search } from 'lucide-react';
import { logo } from '../../assets';
import { brand } from '../../data/brand';
import { podcastIntro, episodes, episodeCategories } from '../../data/podcast';
import Seo from '../../components/ui/Seo';
import SectionHeading from '../../components/ui/SectionHeading';
import Reveal from '../../components/ui/Reveal';
import { cn } from '../../utils/format';

export default function Podcast() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const featured = episodes.find((e) => e.featured) || episodes[0];

  const filtered = useMemo(() => {
    let list = [...episodes];
    if (category !== 'All') list = list.filter((e) => e.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [category, search]);

  return (
    <>
      <Seo
        title="The Podcast"
        description="Uncommon Ground Podcast — honest conversations with local leaders, entrepreneurs and creators."
        path="/podcast"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 py-28 lg:py-36">
        <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-teal/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-ember/10 blur-3xl" />
        <div className="container-luxe relative z-10 text-center">
          <Reveal>
            <img src={logo} alt="" className="mx-auto h-24 w-auto" />
          </Reveal>
          <Reveal>
            <span className="eyebrow mt-6 inline-block">{podcastIntro.kicker}</span>
          </Reveal>
          <Reveal>
            <h1 className="display-hero mt-4 text-5xl text-sand sm:text-6xl lg:text-7xl">
              {podcastIntro.title}
            </h1>
          </Reveal>
          <Reveal>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-haze">
              {podcastIntro.paragraphs[0]}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-y border-white/10 bg-ink-800 py-16">
        <div className="container-luxe grid gap-8 md:grid-cols-3">
          {podcastIntro.pillars.map((pillar) => (
            <Reveal key={pillar.title}>
              <div className="text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-ember/15 text-ember">
                  <Mic size={24} />
                </div>
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-sand">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-haze">{pillar.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured Episode */}
      <section className="bg-ink-900 py-20">
        <div className="container-luxe">
          <SectionHeading eyebrow="Now Playing" title="Featured Episode" />
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-ink-700">
                <iframe
                  title={`Spotify — ${featured.title}`}
                  src="https://open.spotify.com/embed/episode/0"
                  width="100%"
                  height="352"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="border-0"
                />
              </div>
            </Reveal>
            <Reveal>
              <div className="flex flex-col justify-center">
                <span className="eyebrow">{featured.number} · {featured.category}</span>
                <h3 className="display-hero mt-3 text-4xl text-sand">{featured.title}</h3>
                <p className="mt-4 text-sm text-haze">{featured.date} · {featured.duration}</p>
                <p className="mt-4 text-base leading-relaxed text-haze">{featured.description}</p>
                <a
                  href={featured.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary mt-8 w-fit"
                >
                  <Play size={16} /> Listen on Spotify
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Episode Grid */}
      <section className="bg-ink-800 py-20">
        <div className="container-luxe">
          <SectionHeading eyebrow="All Episodes" title="Episode Library" />

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-haze" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search episodes..."
                className="w-full rounded-full border border-white/10 bg-ink-700 py-3 pl-11 pr-4 text-sm text-sand placeholder:text-haze focus:border-ember focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {episodeCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-luxe transition-colors',
                    category === cat
                      ? 'bg-teal text-onink'
                      : 'border border-white/10 text-haze hover:text-sand'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((ep) => (
              <Reveal key={ep.id}>
                <article className="group flex h-full flex-col rounded-3xl border border-white/10 bg-ink-700/60 p-6 transition-all duration-500 hover:border-ember/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-luxe text-ember">{ep.number}</span>
                    <span className="text-xs text-haze">{ep.duration}</span>
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold uppercase tracking-wide text-sand transition-colors group-hover:text-ember">
                    {ep.title}
                  </h3>
                  <p className="mt-1 text-xs text-teal">{ep.category}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-haze">{ep.description}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-haze">{ep.date}</span>
                    <a
                      href={ep.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-luxe text-ember hover:text-ember-light"
                    >
                      Listen <ExternalLink size={12} />
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="bg-ink-900 py-20">
        <div className="container-luxe text-center">
          <SectionHeading
            align="center"
            eyebrow="Never Miss an Episode"
            title="Subscribe & Follow"
            description="Get new episodes wherever you listen."
          />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href={brand.podcastLinks.spotify} target="_blank" rel="noreferrer" className="btn-primary">
              <Headphones size={16} /> Spotify
            </a>
            <a href={brand.podcastLinks.apple} target="_blank" rel="noreferrer" className="btn-secondary">
              Apple Podcasts
            </a>
            <a href={brand.podcastLinks.youtube} target="_blank" rel="noreferrer" className="btn-secondary">
              YouTube
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

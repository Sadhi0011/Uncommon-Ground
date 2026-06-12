import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { lifestyleBoard } from '../../assets';
import { api } from '../../lib/api';
import Reveal from '../ui/Reveal';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || busy) return;
    setError('');
    setBusy(true);
    try {
      await api.post('/api/newsletter', { email });
      setDone(true);
      setEmail('');
      setTimeout(() => setDone(false), 5000);
    } catch (err) {
      setError(err.message || 'Subscription failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-28 lg:py-36">
      <img
        src={lifestyleBoard}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-ink-900/85" />
      <div className="pointer-events-none absolute inset-0 grain-overlay" />

      <div className="container-luxe relative z-10 text-center">
        <Reveal>
          <span className="eyebrow">Stay in the loop</span>
        </Reveal>
        <Reveal>
          <h2 className="display-hero mx-auto mt-4 max-w-3xl text-5xl text-sand sm:text-6xl lg:text-7xl">
            Fuel your inbox with <span className="text-ember">bold flavor</span>
          </h2>
        </Reveal>
        <Reveal>
          <p className="mx-auto mt-5 max-w-xl text-lg text-haze">
            New drops, podcast episodes, community events, and exclusive rewards — straight to you.
          </p>
        </Reveal>

        <Reveal>
          <form
            onSubmit={submit}
            className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm text-sand placeholder:text-haze backdrop-blur focus:border-ember focus:outline-none"
              aria-label="Email address"
            />
            <button type="submit" disabled={busy} className="btn-primary shrink-0 disabled:opacity-60">
              {busy ? 'Subscribing…' : 'Subscribe'} <ArrowRight size={16} />
            </button>
          </form>
          {done && (
            <p className="mt-4 text-sm text-teal">Welcome to the community — we will be in touch!</p>
          )}
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </Reveal>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Music2,
  Phone,
  Youtube,
  ArrowRight,
} from 'lucide-react';
import { logo } from '../../assets';
import { brand } from '../../data/brand';
import { footerColumns } from '../../data/navigation';

const iconMap = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: Music2,
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail('');
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink-900">
      <div className="container-luxe grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        {/* Brand + newsletter */}
        <div className="space-y-6">
          <img src={logo} alt={brand.name} className="h-12 w-auto" />
          <p className="max-w-sm text-sm leading-relaxed text-haze">{brand.shortPitch}</p>

          <form onSubmit={submit} className="max-w-sm">
            <label className="mb-2 block font-heading text-xs uppercase tracking-luxe text-sand">
              Join the community
            </label>
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5 transition-colors focus-within:border-ember">
              <Mail size={16} className="ml-3 shrink-0 text-haze" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full bg-transparent py-2 text-sm text-sand placeholder:text-haze focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ember text-onink transition-colors hover:bg-ember-light"
                aria-label="Subscribe"
              >
                <ArrowRight size={16} />
              </button>
            </div>
            {done && <p className="mt-2 text-xs text-teal">Thanks for joining — talk soon!</p>}
          </form>

          <div className="flex gap-3">
            {brand.socials.map((social) => {
              const Icon = iconMap[social.icon] || Music2;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-sand transition-all hover:-translate-y-0.5 hover:border-ember hover:text-ember"
                  aria-label={social.label}
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Link columns */}
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-5 font-heading text-sm uppercase tracking-luxe text-sand">
              {col.title}
            </h3>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-haze transition-colors hover:text-ember"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-luxe flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-haze sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="inline-flex items-center gap-2">
            <MapPin size={14} className="text-ember" /> {brand.contact.address}
          </span>
          <a href={brand.contact.phoneHref} className="inline-flex items-center gap-2 hover:text-ember">
            <Phone size={14} className="text-ember" /> {brand.contact.phone}
          </a>
        </div>
        <div className="flex items-center gap-5">
          <span>© {new Date().getFullYear()} {brand.name}</span>
          <Link to="/contact" className="hover:text-ember">Privacy Policy</Link>
          <Link to="/contact" className="hover:text-ember">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

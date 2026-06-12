import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/ui/Seo';
import { cn } from '../../utils/format';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setBusy(true);
    try {
      await signup(form.name.trim(), form.email.trim(), form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to create account.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Sign Up" description="Create your Uncommon Ground account." path="/signup" />
      <section className="bg-ink-900 py-20 lg:py-28">
        <div className="container-luxe max-w-md">
          <span className="eyebrow">Join the Community</span>
          <h1 className="display-hero mt-3 text-4xl text-sand sm:text-5xl">Create Account</h1>

          <form
            onSubmit={onSubmit}
            className="mt-10 rounded-3xl border border-white/10 bg-ink-800/60 p-8"
            noValidate
          >
            <div className="space-y-5">
              <Field label="Full Name">
                <input
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  className={inputClass}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  required
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  className={inputClass}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  value={form.password}
                  onChange={update('password')}
                  className={inputClass}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                />
              </Field>
            </div>

            {error && <p className="mt-4 text-sm text-red-400" role="alert">{error}</p>}

            <button type="submit" disabled={busy} className="btn-primary mt-8 w-full disabled:opacity-60">
              <UserPlus size={16} /> {busy ? 'Creating…' : 'Sign Up'}
            </button>

            <p className="mt-6 text-center text-sm text-haze">
              Already have an account?{' '}
              <Link to="/login" className="text-ember hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe text-haze">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass = cn(
  'w-full rounded-xl border border-white/10 bg-ink-700 px-4 py-3 text-sm text-sand',
  'placeholder:text-haze/60 focus:border-ember focus:outline-none transition-colors'
);

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/ui/Seo';
import { cn } from '../../utils/format';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Log In" description="Sign in to your Uncommon Ground account." path="/login" />
      <section className="bg-ink-900 py-20 lg:py-28">
        <div className="container-luxe max-w-md">
          <span className="eyebrow">Welcome Back</span>
          <h1 className="display-hero mt-3 text-4xl text-sand sm:text-5xl">Log In</h1>

          <form
            onSubmit={onSubmit}
            className="mt-10 rounded-3xl border border-white/10 bg-ink-800/60 p-8"
            noValidate
          >
            <div className="space-y-5">
              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </Field>
            </div>

            {error && <p className="mt-4 text-sm text-red-400" role="alert">{error}</p>}

            <button type="submit" disabled={busy} className="btn-primary mt-8 w-full disabled:opacity-60">
              <LogIn size={16} /> {busy ? 'Signing in…' : 'Log In'}
            </button>

            <p className="mt-6 text-center text-sm text-haze">
              New here?{' '}
              <Link to="/signup" className="text-ember hover:underline">
                Create an account
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

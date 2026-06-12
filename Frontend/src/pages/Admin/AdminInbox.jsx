import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Banner } from '../../components/admin/ui';

export default function AdminInbox() {
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [m, s] = await Promise.all([
          api.get('/api/contact', { auth: true }),
          api.get('/api/newsletter', { auth: true }),
        ]);
        if (!active) return;
        setMessages(m.messages || []);
        setSubscribers(s.subscribers || []);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load inbox.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const fmt = (d) => new Date(d).toLocaleString();

  if (error) return <Banner type="error">{error}</Banner>;
  if (loading) return <p className="text-haze">Loading…</p>;

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-2xl uppercase tracking-wide text-sand">
          Contact Messages <span className="text-haze">({messages.length})</span>
        </h2>
        <div className="mt-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-haze">No messages yet.</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="rounded-2xl border border-white/10 bg-ink-800/60 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-sand">
                    {m.first_name} {m.last_name}{' '}
                    <span className="ml-2 rounded-full bg-ember/15 px-2 py-0.5 text-[11px] uppercase tracking-luxe text-ember">
                      {m.type}
                    </span>
                  </p>
                  <span className="text-xs text-haze">{fmt(m.created_at)}</span>
                </div>
                <a href={`mailto:${m.email}`} className="text-sm text-teal hover:underline">{m.email}</a>
                <p className="mt-2 text-sm text-haze">{m.message}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl uppercase tracking-wide text-sand">
          Newsletter Subscribers <span className="text-haze">({subscribers.length})</span>
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-700/60 text-xs uppercase tracking-luxe text-haze">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscribers.length === 0 ? (
                <tr><td colSpan={2} className="px-4 py-8 text-center text-haze">No subscribers yet.</td></tr>
              ) : (
                subscribers.map((s) => (
                  <tr key={s.id} className="text-sand">
                    <td className="px-4 py-3">{s.email}</td>
                    <td className="px-4 py-3 text-haze">{fmt(s.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

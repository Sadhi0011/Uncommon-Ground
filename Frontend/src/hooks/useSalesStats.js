import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';

// Fetches /api/orders/stats for a date range and keeps it fresh in near
// real-time (re-poll on an interval and when the tab regains focus).
export function useSalesStats({ from, to, pollMs = 15000 } = {}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reqRef = useRef(0);

  const load = useCallback(
    async (silent = false) => {
      const id = ++reqRef.current;
      if (!silent) setLoading(true);
      try {
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        const qs = params.toString();
        const data = await api.get(`/api/orders/stats${qs ? `?${qs}` : ''}`, { auth: true });
        if (id === reqRef.current) {
          setStats(data);
          setError('');
        }
      } catch (err) {
        if (id === reqRef.current) setError(err.message || 'Failed to load stats.');
      } finally {
        if (id === reqRef.current) setLoading(false);
      }
    },
    [from, to]
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onFocus = () => load(true);
    window.addEventListener('focus', onFocus);
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') load(true);
    }, pollMs);
    return () => {
      window.removeEventListener('focus', onFocus);
      clearInterval(interval);
    };
  }, [load, pollMs]);

  return { stats, loading, error, refresh: () => load(true) };
}

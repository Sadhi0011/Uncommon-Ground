import { useCallback, useEffect, useState } from 'react';

const KEY = 'ug-recently-viewed';
const MAX = 4;

export function useRecentlyViewed() {
  const [ids, setIds] = useState(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids]);

  const track = useCallback((id) => {
    setIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, MAX));
  }, []);

  return { recentIds: ids, track };
}

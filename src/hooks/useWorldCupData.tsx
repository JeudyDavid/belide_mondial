import { useState, useEffect, useCallback } from 'react';
import { getFixtures, getStandings, Fixture, StandingEntry } from '@/services/worldcupApi';

export function useWorldCupData() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [standings, setStandings] = useState<StandingEntry[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFixtures = useCallback(async () => {
    try {
      setFixtures(await getFixtures());
    } catch {
      // silently ignore polling errors
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const [f, s] = await Promise.all([getFixtures(), getStandings()]);
        setFixtures(f);
        setStandings(s);
      } catch (e) {
        setError('Impossible de charger les données. Veuillez réessayer.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    init();
    const interval = setInterval(fetchFixtures, 30_000);
    return () => clearInterval(interval);
  }, [fetchFixtures]);

  return { fixtures, standings, loading, error };
}

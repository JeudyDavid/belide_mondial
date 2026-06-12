import { useState, useEffect, useCallback } from 'react';
import { getGames, getTeams, getStadiums, Game, Team, Stadium } from '@/services/worldcupApi';

export function useWorldCupData() {
  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    try {
      const data = await getGames();
      setGames(data);
    } catch {
      // silently update — don't reset error on polling
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const [g, t, s] = await Promise.all([getGames(), getTeams(), getStadiums()]);
        setGames(g);
        setTeams(t);
        setStadiums(s);
      } catch (e) {
        setError("Impossible de charger les données. Veuillez réessayer.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    init();

    const interval = setInterval(fetchGames, 30_000);
    return () => clearInterval(interval);
  }, [fetchGames]);

  const stadiumMap = Object.fromEntries(stadiums.map(s => [s.id, s]));
  const teamMap = Object.fromEntries(teams.map(t => [t.id, t]));

  return { games, teams, stadiums, stadiumMap, teamMap, loading, error };
}

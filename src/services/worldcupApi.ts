const BASE_URL = '/football-api';
const API_KEY = '00642d62ab50431eb32ecf3c971e31a3';
const LEAGUE_ID = 1;
const SEASON = 2026;

const HEADERS = { 'x-apisports-key': API_KEY };

async function apiFetch(path: string): Promise<unknown[]> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  return json.response ?? [];
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Fixture {
  fixture: {
    id: number;
    date: string;
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
    venue: {
      id: number | null;
      name: string | null;
      city: string | null;
    };
  };
  league: {
    id: number;
    round: string;
    group: string | null;
  };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface StandingEntry {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  group: string;
  form: string | null;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
}

export interface FixtureEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: 'Goal' | 'Card' | 'subst' | 'Var';
  detail: string;
  comments: string | null;
}

export interface FixtureLineup {
  team: { id: number; name: string; logo: string };
  coach: { id: number; name: string; photo: string };
  formation: string;
  startXI: Array<{ player: { id: number; name: string; number: number; pos: string; grid: string | null } }>;
  substitutes: Array<{ player: { id: number; name: string; number: number; pos: string; grid: string | null } }>;
}

export interface FixtureStat {
  team: { id: number; name: string; logo: string };
  statistics: Array<{ type: string; value: string | number | null }>;
}

// ── Fetchers ──────────────────────────────────────────────────────────────────

export async function getFixtures(): Promise<Fixture[]> {
  return apiFetch(`/fixtures?league=${LEAGUE_ID}&season=${SEASON}`) as Promise<Fixture[]>;
}

export async function getFixtureEvents(id: number): Promise<FixtureEvent[]> {
  return apiFetch(`/fixtures/events?fixture=${id}`) as Promise<FixtureEvent[]>;
}

export async function getFixtureLineups(id: number): Promise<FixtureLineup[]> {
  return apiFetch(`/fixtures/lineups?fixture=${id}`) as Promise<FixtureLineup[]>;
}

export async function getFixtureStatistics(id: number): Promise<FixtureStat[]> {
  return apiFetch(`/fixtures/statistics?fixture=${id}`) as Promise<FixtureStat[]>;
}

export async function getStandings(): Promise<StandingEntry[][]> {
  const response = await apiFetch(`/standings?league=${LEAGUE_ID}&season=${SEASON}`);
  const first = response[0] as { league: { standings: StandingEntry[][] } } | undefined;
  return first?.league?.standings ?? [];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function isLive(f: Fixture): boolean {
  return ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE'].includes(f.fixture.status.short);
}

export function isFinished(f: Fixture): boolean {
  return ['FT', 'AET', 'PEN', 'AWD', 'WO'].includes(f.fixture.status.short);
}

export function fixtureStatus(f: Fixture): 'live' | 'finished' | 'upcoming' {
  if (isFinished(f)) return 'finished';
  if (isLive(f)) return 'live';
  return 'upcoming';
}

export function getPhase(round: string): string {
  const r = round.toLowerCase();
  if (r.includes('group')) return 'group';
  if (r.includes('32')) return 'r32';
  if (r.includes('16')) return 'r16';
  if (r.includes('quarter')) return 'qf';
  if (r.includes('semi')) return 'sf';
  if (r.includes('3rd') || r.includes('third') || r.includes('place')) return 'third';
  if (r.includes('final')) return 'final';
  return round;
}

export function phaseLabel(round: string): string {
  const labels: Record<string, string> = {
    group: 'Phase de groupes',
    r32: '32e de finale',
    r16: '8e de finale',
    qf: 'Quart de finale',
    sf: 'Demi-finale',
    third: 'Troisième place',
    final: 'Finale',
  };
  return labels[getPhase(round)] ?? round;
}

export function liveLabel(f: Fixture): string {
  const s = f.fixture.status.short;
  const e = f.fixture.status.elapsed;
  if (s === 'HT') return 'MI-TEMPS';
  if (s === 'BT') return 'PAUSE ET';
  if (s === 'P') return 'TIRS AU BUT';
  if (e) return `${e}'`;
  return 'EN DIRECT';
}

export function formatMatchDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function groupLetter(f: Fixture): string {
  return f.league.group?.replace('Group ', '') ?? '';
}

export function matchday(f: Fixture): string {
  const match = f.league.round.match(/(\d+)$/);
  return match ? match[1] : '';
}

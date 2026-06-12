const BASE_URL = '/wc-api';
const TOKEN_KEY = 'wc26_token';
const EMAIL = 'belide@mondial.app';
const PASSWORD = '12345678';

async function authenticate(): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const data = await res.json();
  const token = data.token ?? data.access_token ?? data.jwt;
  if (!token) throw new Error('Auth failed');
  localStorage.setItem(TOKEN_KEY, token);
  return token;
}

async function getToken(): Promise<string> {
  return localStorage.getItem(TOKEN_KEY) ?? authenticate();
}

function extractArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const values = Object.values(data as Record<string, unknown>);
    const arr = values.find(v => Array.isArray(v));
    if (arr) return arr as T[];
  }
  return [];
}

async function apiFetch<T>(path: string): Promise<T[]> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    const newToken = await authenticate();
    const retry = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${newToken}` },
    });
    if (!retry.ok) throw new Error(`API error: ${retry.status}`);
    return extractArray<T>(await retry.json());
  }

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return extractArray<T>(await res.json());
}

export interface Game {
  _id: string;
  id: number;
  home_team_id: number;
  away_team_id: number;
  home_team_name_en: string;
  away_team_name_en: string;
  home_score: number | null;
  away_score: number | null;
  home_scorers: string[] | null;
  away_scorers: string[] | null;
  finished: boolean | string;
  time_elapsed: string;
  group: string;
  matchday: number;
  type: string;
  local_date: string;
  stadium_id: number;
  home_team_label?: string;
  away_team_label?: string;
}

export interface Team {
  _id: string;
  id: number;
  name_en: string;
  group: string;
  flag?: string;
}

export interface Stadium {
  _id: string;
  id: number;
  name: string;
  city: string;
  country: string;
  capacity: number;
}

export interface Group {
  _id: string;
  id: number;
  name: string;
  teams: number[];
}

export const getGames = () => apiFetch<Game>('/get/games');
export const getTeams = () => apiFetch<Team>('/get/teams');
export const getStadiums = () => apiFetch<Stadium>('/get/stadiums');
export const getGroups = () => apiFetch<Group>('/get/groups');

export function isLive(game: Game): boolean {
  const t = game.time_elapsed?.toLowerCase();
  return t === '1h' || t === '2h' || t === 'ht' || t === 'et' || t === 'pen';
}

export function isFinished(game: Game): boolean {
  return game.finished === true || game.finished === 'TRUE' || game.time_elapsed?.toLowerCase() === 'ft';
}

export function gameStatus(game: Game): 'live' | 'finished' | 'upcoming' {
  if (isFinished(game)) return 'finished';
  if (isLive(game)) return 'live';
  return 'upcoming';
}

export function formatMatchDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
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

export function phaseLabel(type: string): string {
  const labels: Record<string, string> = {
    group: 'Phase de groupes',
    r32: '32e de finale',
    r16: '8e de finale',
    qf: 'Quart de finale',
    sf: 'Demi-finale',
    third: 'Troisième place',
    final: 'Finale',
  };
  return labels[type] ?? type;
}

const FLAG_MAP: Record<string, string> = {
  'USA': 'us', 'United States': 'us', 'Mexico': 'mx', 'Canada': 'ca',
  'Brazil': 'br', 'Argentina': 'ar', 'France': 'fr', 'Germany': 'de',
  'Spain': 'es', 'England': 'gb-eng', 'Portugal': 'pt', 'Netherlands': 'nl',
  'Belgium': 'be', 'Italy': 'it', 'Uruguay': 'uy', 'Colombia': 'co',
  'Ecuador': 'ec', 'Peru': 'pe', 'Paraguay': 'py', 'Venezuela': 've',
  'Bolivia': 'bo', 'Chile': 'cl', 'Japan': 'jp', 'South Korea': 'kr',
  'Australia': 'au', 'Iran': 'ir', 'Saudi Arabia': 'sa', 'Qatar': 'qa',
  'Morocco': 'ma', 'Senegal': 'sn', 'Nigeria': 'ng', 'Ghana': 'gh',
  "Ivory Coast": 'ci', "Côte d'Ivoire": 'ci', 'Egypt': 'eg', 'Cameroon': 'cm',
  'Algeria': 'dz', 'Tunisia': 'tn', 'South Africa': 'za', 'Switzerland': 'ch',
  'Croatia': 'hr', 'Serbia': 'rs', 'Denmark': 'dk', 'Poland': 'pl',
  'Austria': 'at', 'Ukraine': 'ua', 'Turkey': 'tr', 'Hungary': 'hu',
  'Slovakia': 'sk', 'Czech Republic': 'cz', 'Albania': 'al', 'Greece': 'gr',
  'New Zealand': 'nz', 'Indonesia': 'id', 'Panama': 'pa', 'Costa Rica': 'cr',
  'Honduras': 'hn', 'El Salvador': 'sv', 'Jamaica': 'jm', 'Haiti': 'ht',
  'Cuba': 'cu', 'Guatemala': 'gt', 'Trinidad and Tobago': 'tt',
};

export function getFlagUrl(teamName: string): string | null {
  const code = FLAG_MAP[teamName];
  if (!code) return null;
  return `https://flagcdn.com/w40/${code}.png`;
}

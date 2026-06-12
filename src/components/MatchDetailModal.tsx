import { useEffect, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import {
  Fixture, FixtureEvent, FixtureLineup, FixtureStat,
  getFixtureEvents, getFixtureLineups, getFixtureStatistics,
  fixtureStatus, liveLabel, isLive,
} from '@/services/worldcupApi';

// ── Helpers ───────────────────────────────────────────────────────────────────

const BallIcon = () => (
  <img src="/ballon.png" alt="but" className="w-5 h-5 inline-block object-contain" />
);

function eventIcon(event: FixtureEvent): ReactNode {
  if (event.type === 'Goal') {
    if (event.detail === 'Own Goal') return <span className="flex items-center gap-1"><BallIcon /> <span className="text-xs">(CSC)</span></span>;
    if (event.detail === 'Penalty') return <span className="flex items-center gap-1"><BallIcon /> <span className="text-xs">(pen.)</span></span>;
    return <BallIcon />;
  }
  if (event.type === 'Card') {
    if (event.detail === 'Yellow Card') return '🟨';
    if (event.detail === 'Red Card') return '🟥';
    if (event.detail === 'Second Yellow card') return '🟨🟥';
  }
  if (event.type === 'subst') return '🔄';
  if (event.type === 'Var') return 'VAR';
  return '•';
}

// ── Pitch formation ───────────────────────────────────────────────────────────

function PitchFormation({ lineup, reversed, events }: { lineup: FixtureLineup; reversed?: boolean; events: FixtureEvent[] }) {
  const scorerIds = new Set(
    events
      .filter(e => e.type === 'Goal' && e.detail !== 'Own Goal')
      .map(e => e.player.id)
  );

  const rows: Record<number, typeof lineup.startXI> = {};
  for (const item of lineup.startXI) {
    if (!item.player.grid) continue;
    const row = parseInt(item.player.grid.split(':')[0]);
    if (!rows[row]) rows[row] = [];
    rows[row].push(item);
  }

  const sortedRowNums = Object.keys(rows).map(Number).sort((a, b) => a - b);
  const displayRows = reversed ? sortedRowNums : [...sortedRowNums].reverse();

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden"
      style={{
        paddingBottom: '140%',
        background: 'linear-gradient(180deg, #1a6b1a 0%, #228b22 50%, #196019 100%)',
      }}
    >
      {/* Field lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="5" y="2" width="90" height="96" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
        <rect x="25" y="2" width="50" height="15" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" />
        <rect x="25" y="83" width="50" height="15" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" />
      </svg>

      {/* Formation label */}
      <div className="absolute top-2 left-0 right-0 flex justify-center z-10">
        <span className="bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          {lineup.formation}
        </span>
      </div>

      {/* Players */}
      {displayRows.map((rowNum, rowIdx) => {
        const players = rows[rowNum];
        const yPct = 8 + (rowIdx / (displayRows.length - 1 || 1)) * 82;
        return players.map((item, colIdx) => {
          const xPct = ((colIdx + 1) / (players.length + 1)) * 100;
          return (
            <div
              key={item.player.id}
              className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${xPct}%`, top: `${yPct}%` }}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-blue-700 border-2 border-white shadow overflow-hidden">
                  <img
                    src={`https://media.api-sports.io/football/players/${item.player.id}.png`}
                    alt={item.player.name}
                    className="w-full h-full object-cover object-top"
                    onError={e => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      el.parentElement!.innerHTML = `<span style="color:white;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;height:100%">${item.player.number}</span>`;
                    }}
                  />
                </div>
                {scorerIds.has(item.player.id) && (
                  <img src="/ballon.png" alt="but" className="absolute right-0 top-0 w-5 h-5 object-contain" />
                )}
              </div>
              <div className="mt-0.5 bg-black/60 px-1 rounded text-center" style={{ maxWidth: 56 }}>
                <span className="text-white text-[8px] font-semibold leading-tight block truncate">
                  {item.player.name.split(' ').pop()}
                </span>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
}

// ── Stat bar ──────────────────────────────────────────────────────────────────

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
        <span>{home}</span>
        <span className="text-gray-500 text-center flex-1">{label}</span>
        <span>{away}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${homePct}%`, background: 'rgb(115,2,97)' }}
        />
        <div
          className="h-full rounded-full flex-1 transition-all"
          style={{ background: 'rgb(54,4,46)' }}
        />
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

type Tab = 'events' | 'formations' | 'stats';

interface Props {
  fixture: Fixture;
  onClose: () => void;
}

export default function MatchDetailModal({ fixture, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('events');
  const [events, setEvents] = useState<FixtureEvent[]>([]);
  const [lineups, setLineups] = useState<FixtureLineup[]>([]);
  const [stats, setStats] = useState<FixtureStat[]>([]);
  const [loading, setLoading] = useState(true);

  const status = fixtureStatus(fixture);
  const live = isLive(fixture);
  const id = fixture.fixture.id;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getFixtureEvents(id),
      getFixtureLineups(id),
      getFixtureStatistics(id),
    ]).then(([e, l, s]) => {
      setEvents(e);
      setLineups(l);
      setStats(s);
    }).finally(() => setLoading(false));
  }, [id]);

  const homeStat = stats[0];
  const awayStat = stats[1];

  const getStatValue = (stat: FixtureStat, type: string): number => {
    const s = stat.statistics.find(s => s.type === type);
    if (!s?.value) return 0;
    const v = String(s.value).replace('%', '');
    return parseFloat(v) || 0;
  };

  const KEY_STATS = [
    'Ball Possession', 'Total Shots', 'Shots on Goal',
    'Shots off Goal', 'Corner Kicks', 'Fouls',
    'Yellow Cards', 'Red Cards', 'Offsides', 'Goalkeeper Saves',
  ];

  const STAT_LABELS: Record<string, string> = {
    'Ball Possession': 'Possession (%)',
    'Total Shots': 'Tirs',
    'Shots on Goal': 'Tirs cadrés',
    'Shots off Goal': 'Tirs non cadrés',
    'Corner Kicks': 'Corners',
    'Fouls': 'Fautes',
    'Yellow Cards': 'Cartons jaunes',
    'Red Cards': 'Cartons rouges',
    'Offsides': 'Hors-jeux',
    'Goalkeeper Saves': 'Arrêts',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full md:max-w-2xl bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
          style={{ background: 'linear-gradient(90deg, rgb(115,2,97), rgb(54,4,46))' }}>
          <div className="flex items-center gap-3 flex-1">
            <img src={fixture.teams.home.logo} className="w-8 h-8 object-contain" alt="" />
            <div className="text-center flex-1">
              <div className="text-white font-bold text-lg">
                {status === 'upcoming'
                  ? 'vs'
                  : `${fixture.goals.home ?? 0} – ${fixture.goals.away ?? 0}`}
              </div>
              {live && (
                <div className="text-red-300 text-xs font-semibold">{liveLabel(fixture)}</div>
              )}
              {status === 'finished' && (
                <div className="text-purple-200 text-xs">Terminé</div>
              )}
            </div>
            <img src={fixture.teams.away.logo} className="w-8 h-8 object-contain" alt="" />
          </div>
          <button onClick={onClose} className="ml-3 text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Team names */}
        <div className="flex justify-between px-5 py-2 bg-purple-50 text-xs text-gray-600 font-medium">
          <span>{fixture.teams.home.name}</span>
          <span>{fixture.teams.away.name}</span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {([['events', 'Résumé'], ['formations', 'Compositions'], ['stats', 'Statistiques']] as [Tab, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                tab === id ? 'border-b-2 text-purple-700' : 'text-gray-500 hover:text-gray-700'
              }`}
              style={tab === id ? { borderColor: 'rgb(115,2,97)', color: 'rgb(115,2,97)' } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
            </div>
          ) : (

            <>
              {/* ── Résumé ── */}
              {tab === 'events' && (
                <div>
                  {events.length === 0 ? (
                    <p className="text-center text-gray-400 py-10 text-sm">
                      {status === 'upcoming' ? 'Le match n\'a pas encore commencé' : 'Aucun événement disponible'}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {events.map((ev, i) => {
                        const isHome = ev.team.id === fixture.teams.home.id;
                        return (
                          <div key={i} className={`flex items-center gap-3 ${isHome ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className={`flex items-center gap-2 flex-1 ${isHome ? '' : 'flex-row-reverse'}`}>
                              <span className="text-lg">{eventIcon(ev)}</span>
                              <div className={`${isHome ? '' : 'text-right'}`}>
                                <span className="text-sm font-semibold text-gray-800">{ev.player.name}</span>
                                {ev.type === 'subst' && ev.assist.name && (
                                  <span className="text-xs text-gray-400 block">↑ {ev.assist.name}</span>
                                )}
                                {ev.type === 'Goal' && ev.assist.name && (
                                  <span className="text-xs text-gray-400 block">Passe : {ev.assist.name}</span>
                                )}
                              </div>
                            </div>
                            <div className="w-10 text-center">
                              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {ev.time.elapsed}{ev.time.extra ? `+${ev.time.extra}` : ''}'
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── Compositions ── */}
              {tab === 'formations' && (
                <div>
                  {lineups.length === 0 ? (
                    <p className="text-center text-gray-400 py-10 text-sm">Compositions non disponibles</p>
                  ) : (
                    <div className="space-y-6">
                      {lineups.map((lineup, i) => (
                        <div key={lineup.team.id}>
                          <div className="flex items-center gap-2 mb-3">
                            <img src={lineup.team.logo} className="w-6 h-6 object-contain" alt="" />
                            <span className="font-semibold text-gray-800">{lineup.team.name}</span>
                            <span className="text-xs text-gray-400">· {lineup.formation}</span>
                            {lineup.coach.name && (
                              <span className="text-xs text-gray-400 ml-auto">Coach : {lineup.coach.name}</span>
                            )}
                          </div>
                          <PitchFormation lineup={lineup} reversed={i === 1} events={events} />

                          {/* Substitutes */}
                          {lineup.substitutes.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Remplaçants</p>
                              <div className="flex flex-wrap gap-1.5">
                                {lineup.substitutes.map(({ player }) => (
                                  <span key={player.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                    #{player.number} {player.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Statistiques ── */}
              {tab === 'stats' && (
                <div>
                  {!homeStat || !awayStat ? (
                    <p className="text-center text-gray-400 py-10 text-sm">Statistiques non disponibles</p>
                  ) : (
                    <div>
                      <div className="flex justify-between text-xs font-bold text-gray-600 mb-4">
                        <div className="flex items-center gap-1.5">
                          <img src={homeStat.team.logo} className="w-5 h-5 object-contain" alt="" />
                          {homeStat.team.name}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {awayStat.team.name}
                          <img src={awayStat.team.logo} className="w-5 h-5 object-contain" alt="" />
                        </div>
                      </div>
                      {KEY_STATS.map(type => {
                        const h = getStatValue(homeStat, type);
                        const a = getStatValue(awayStat, type);
                        if (h === 0 && a === 0) return null;
                        return <StatBar key={type} label={STAT_LABELS[type] ?? type} home={h} away={a} />;
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

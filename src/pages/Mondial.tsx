import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MatchDetailModal from '@/components/MatchDetailModal';
import { useWorldCupData } from '@/hooks/useWorldCupData';
import {
  Fixture, StandingEntry,
  fixtureStatus, isLive, formatMatchDate, phaseLabel, liveLabel,
  getPhase, matchday,
} from '@/services/worldcupApi';

// ── Team logo ─────────────────────────────────────────────────────────────────

function TeamLogo({ logo, name, reverse }: { logo: string; name: string; reverse?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 flex-1 ${reverse ? 'items-start' : 'items-end'}`}>
      <img
        src={logo}
        alt={name}
        className="w-10 h-10 object-contain"
        onError={e => { (e.target as HTMLImageElement).style.opacity = '0'; }}
      />
      <span className="font-montserrat font-semibold text-xs text-gray-800 text-center leading-tight max-w-[80px]">
        {name}
      </span>
    </div>
  );
}

// ── Match Card ────────────────────────────────────────────────────────────────

function MatchCard({ fixture, onClick, groupOverride }: { fixture: Fixture; onClick: () => void; groupOverride?: string }) {
  const status = fixtureStatus(fixture);
  const live = isLive(fixture);
  const phase = getPhase(fixture.league.round);
  const md = matchday(fixture);
  const letter = groupOverride?.replace('Group ', '') ?? '';

  const htHome = fixture.score.halftime.home;
  const htAway = fixture.score.halftime.away;
  const showHT = status === 'finished' && htHome !== null && htAway !== null;

  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      {/* Status bar */}
      <div
        className="px-4 py-1.5 flex items-center justify-between text-xs font-medium"
        style={
          live
            ? { background: 'linear-gradient(90deg, rgb(115,2,97), rgb(54,4,46))', color: 'white' }
            : status === 'finished'
            ? { backgroundColor: '#f3f4f6', color: '#6b7280' }
            : { background: 'linear-gradient(90deg, rgb(115,2,97), rgb(54,4,46))', color: '#ffffff' }
        }
      >
        <span>
          {live
            ? `EN DIRECT — ${liveLabel(fixture)}`
            : status === 'finished'
            ? 'Terminé'
            : formatMatchDate(fixture.fixture.date)}
        </span>
        <span className="uppercase tracking-wide">
          {phase === 'group'
            ? `Groupe ${letter}${md ? ` · J${md}` : ''}`
            : phaseLabel(fixture.league.round)}
        </span>
      </div>

      {/* Score area */}
      <div className="px-4 py-5 flex items-center gap-3">
        <TeamLogo logo={fixture.teams.home.logo} name={fixture.teams.home.name} reverse={false} />

        <div className="flex flex-col items-center gap-1 min-w-[64px]">
          {status === 'upcoming' ? (
            <span className="text-lg font-bold text-gray-400">vs</span>
          ) : (
            <span className="text-3xl font-bold text-gray-900">
              {fixture.goals.home ?? 0} – {fixture.goals.away ?? 0}
            </span>
          )}
          {live && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-600 font-semibold">{liveLabel(fixture)}</span>
            </span>
          )}
          {showHT && (
            <span className="text-[10px] text-gray-400">
              Mi-temps {htHome}–{htAway}
            </span>
          )}
        </div>

        <TeamLogo logo={fixture.teams.away.logo} name={fixture.teams.away.name} reverse={true} />
      </div>

      {/* Venue */}
      {fixture.fixture.venue.name && (
        <div className="px-4 pb-3 text-xs text-gray-400 text-center">
          {fixture.fixture.venue.name}
          {fixture.fixture.venue.city ? ` · ${fixture.fixture.venue.city}` : ''}
        </div>
      )}
    </div>
  );
}

// ── Standings Table ───────────────────────────────────────────────────────────

function StandingsTable({ group }: { group: StandingEntry[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div
        className="px-4 py-2 text-xs font-bold text-white uppercase tracking-wide"
        style={{ background: 'linear-gradient(90deg, rgb(115,2,97), rgb(54,4,46))' }}
      >
        {group[0]?.group}
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-400 border-b border-gray-100">
            <th className="py-2 pl-3 pr-1 text-left w-6">#</th>
            <th className="py-2 px-1 text-left">Équipe</th>
            <th className="py-2 px-1 text-center">J</th>
            <th className="py-2 px-1 text-center">G</th>
            <th className="py-2 px-1 text-center">N</th>
            <th className="py-2 px-1 text-center">P</th>
            <th className="py-2 px-1 text-center">Diff</th>
            <th className="py-2 pl-1 pr-3 text-center font-bold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {group.map((entry, i) => {
            const qualifies = i < 2;
            const maybe = i === 2;
            return (
              <tr key={entry.team.id} className="border-b border-gray-50 last:border-0">
                <td className="py-2 pl-3 pr-1">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-1 h-4 rounded-full"
                      style={{
                        background: qualifies
                          ? 'rgb(34,197,94)'
                          : maybe
                          ? 'rgb(234,179,8)'
                          : 'rgb(239,68,68)',
                      }}
                    />
                    <span className="text-gray-500">{entry.rank}</span>
                  </div>
                </td>
                <td className="py-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <img src={entry.team.logo} alt={entry.team.name} className="w-5 h-5 object-contain" />
                    <span className="font-medium text-gray-800 truncate max-w-[90px]">{entry.team.name}</span>
                  </div>
                </td>
                <td className="py-2 px-1 text-center text-gray-600">{entry.all.played}</td>
                <td className="py-2 px-1 text-center text-gray-600">{entry.all.win}</td>
                <td className="py-2 px-1 text-center text-gray-600">{entry.all.draw}</td>
                <td className="py-2 px-1 text-center text-gray-600">{entry.all.lose}</td>
                <td className="py-2 px-1 text-center text-gray-500">
                  {entry.goalsDiff > 0 ? `+${entry.goalsDiff}` : entry.goalsDiff}
                </td>
                <td className="py-2 pl-1 pr-3 text-center font-bold text-gray-900">{entry.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Group Section ─────────────────────────────────────────────────────────────

function GroupSection({ groupName, fixtures, standing, onSelect }: {
  groupName: string;
  fixtures: Fixture[];
  standing?: StandingEntry[];
  onSelect: (f: Fixture) => void;
}) {
  const letter = groupName.replace('Group ', '');
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-white text-sm font-bold shadow">
          {letter}
        </div>
        <h3 className="font-montserrat font-semibold text-white uppercase tracking-wide text-sm">
          Groupe {letter}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {fixtures.map(f => (
          <MatchCard key={f.fixture.id} fixture={f} onClick={() => onSelect(f)} groupOverride={groupName} />
        ))}
      </div>
      {standing && standing.length > 0 && (
        <StandingsTable group={standing} />
      )}
    </div>
  );
}

// ── Filter tabs ───────────────────────────────────────────────────────────────

type Filter = 'tous' | 'endirect' | 'classements' | 'elimination';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'tous', label: 'Tous les matchs' },
  { id: 'endirect', label: 'En direct' },
  { id: 'classements', label: 'Classements' },
  { id: 'elimination', label: 'Phases éliminatoires' },
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Mondial() {
  const { fixtures, standings, loading, error } = useWorldCupData();
  const [filter, setFilter] = useState<Filter>('tous');
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);

  const liveFixtures = fixtures.filter(isLive);

  const standingsByGroup = useMemo(() => {
    const map: Record<string, StandingEntry[]> = {};
    for (const group of standings) {
      const name = group[0]?.group ?? '';
      if (!name || name === 'Group Stage' || !/^Group [A-Z]$/.test(name)) continue;
      map[name] = group;
    }
    return map;
  }, [standings]);

  // Map teamId → groupName — on ignore les entrées parasites "Group Stage"
  const teamGroupMap = useMemo(() => {
    const map: Record<number, string> = {};
    for (const group of standings) {
      const name = group[0]?.group ?? '';
      if (!name || name === 'Group Stage' || !/^Group [A-Z]$/.test(name)) continue;
      for (const entry of group) {
        map[entry.team.id] = name;
      }
    }
    return map;
  }, [standings]);

  const groupedByGroup = useMemo(() => {
    if (filter !== 'tous') return null;
    const map: Record<string, Fixture[]> = {};
    for (const f of fixtures) {
      if (getPhase(f.league.round) !== 'group') continue;
      const key = teamGroupMap[f.teams.home.id] || teamGroupMap[f.teams.away.id];
      if (!key) continue;
      if (!map[key]) map[key] = [];
      map[key].push(f);
    }
    return map;
  }, [fixtures, filter, teamGroupMap]);

  const eliminationFixtures = useMemo(() =>
    fixtures.filter(f => getPhase(f.league.round) !== 'group'),
    [fixtures]
  );

  return (
    <div className="min-h-screen">
      <Header />

      {/* CDM video banner */}
      <div className="w-full overflow-hidden" style={{ maxHeight: 320 }}>
        <video
          src="/BMSport.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full object-cover"
          style={{ display: 'block' }}
        />
      </div>

      {/* Hero */}
      <div className="gradient-purple text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Bèlide Magazine · Couverture exclusive
          </p>
          <h1 className="font-montserrat font-bold text-3xl md:text-5xl mb-3">
            Coupe du Monde 2026
          </h1>
          <p className="text-purple-200 text-base md:text-lg">
            USA · Canada · Mexique · 48 équipes · 104 matchs
          </p>
          {liveFixtures.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {liveFixtures.length} match{liveFixtures.length > 1 ? 's' : ''} en direct
            </div>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-1">
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  filter === f.id
                    ? 'text-white shadow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                style={filter === f.id ? { background: 'linear-gradient(90deg, rgb(115,2,97), rgb(54,4,46))' } : {}}
              >
                <span className="flex items-center gap-1.5">
                  {f.id === 'endirect' && liveFixtures.length > 0 && (
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                  {f.label}
                  {f.id === 'endirect' && liveFixtures.length > 0 && (
                    <span className="ml-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                      {liveFixtures.length}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
            <p className="text-white font-montserrat">Chargement des matchs…</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-400 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 rounded-lg text-white text-sm"
              style={{ background: 'linear-gradient(90deg, rgb(115,2,97), rgb(54,4,46))' }}
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-10">

            {/* Tous les matchs — phase de groupes */}
            {filter === 'tous' && groupedByGroup && Object.keys(groupedByGroup).length > 0 && (
              <div className="space-y-8">
                {Object.entries(groupedByGroup)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([group, groupFixtures]) => (
                    <GroupSection
                      key={group}
                      groupName={group}
                      fixtures={groupFixtures}
                      standing={standingsByGroup[group]}
                      onSelect={setSelectedFixture}
                    />
                  ))}
              </div>
            )}

            {/* En direct */}
            {filter === 'endirect' && (
              <div>
                {liveFixtures.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-4xl mb-4">⚽</div>
                    <p className="text-white font-semibold text-lg">Aucun match en direct</p>
                    <p className="text-white/60 text-sm mt-1">Les matchs en cours apparaîtront ici</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {liveFixtures.map(f => (
                      <MatchCard key={f.fixture.id} fixture={f} onClick={() => setSelectedFixture(f)} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Classements */}
            {filter === 'classements' && (
              <div>
                {standings.length === 0 ? (
                  <p className="text-center text-white py-20">Classements non disponibles</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {standings
                      .filter(group => {
                        const name = group[0]?.group ?? '';
                        return name && name !== 'Group Stage' && /^Group [A-Z]$/.test(name);
                      })
                      .map((group, i) => (
                        <StandingsTable key={i} group={group} />
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Phases éliminatoires */}
            {filter === 'elimination' && (
              <div>
                <h2 className="font-montserrat font-bold text-lg text-white mb-4">
                  Phases éliminatoires
                </h2>
                {eliminationFixtures.length === 0 ? (
                  <p className="text-center text-white/70 py-10">Pas encore de matchs éliminatoires</p>
                ) : (
                  <div className="space-y-6">
                    {['r32', 'r16', 'qf', 'sf', 'third', 'final'].map(phase => {
                      const phaseFixtures = eliminationFixtures.filter(f => getPhase(f.league.round) === phase);
                      if (phaseFixtures.length === 0) return null;
                      return (
                        <div key={phase}>
                          <h3 className="font-montserrat font-semibold text-sm uppercase tracking-wide text-white mb-3">
                            {phaseLabel(phase)}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {phaseFixtures.map(f => (
                              <MatchCard key={f.fixture.id} fixture={f} onClick={() => setSelectedFixture(f)} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </main>

      <Footer />

      {selectedFixture && (
        <MatchDetailModal
          fixture={selectedFixture}
          onClose={() => setSelectedFixture(null)}
        />
      )}
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWorldCupData } from '@/hooks/useWorldCupData';
import { Game, gameStatus, isLive, formatMatchDate, phaseLabel, getFlagUrl, Stadium } from '@/services/worldcupApi';

// ── Match Card ────────────────────────────────────────────────────────────────

function TeamDisplay({ name, isHome }: { name: string; isHome: boolean }) {
  const flagUrl = getFlagUrl(name);
  return (
    <div className={`flex flex-col items-center gap-2 ${isHome ? 'items-end' : 'items-start'} flex-1`}>
      <div className={`flex items-center gap-2 ${isHome ? 'flex-row-reverse' : 'flex-row'}`}>
        {flagUrl ? (
          <img src={flagUrl} alt={name} className="w-8 h-5 object-cover rounded-sm shadow-sm" />
        ) : (
          <div className="w-8 h-5 bg-gray-200 rounded-sm" />
        )}
        <span className="font-montserrat font-semibold text-sm text-gray-800 text-center leading-tight">
          {name}
        </span>
      </div>
    </div>
  );
}

function MatchCard({ game, stadium }: { game: Game; stadium?: Stadium }) {
  const status = gameStatus(game);
  const live = isLive(game);

  const homeName = game.home_team_name_en || game.home_team_label || 'À déterminer';
  const awayName = game.away_team_name_en || game.away_team_label || 'À déterminer';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Status bar */}
      <div
        className="px-4 py-1.5 flex items-center justify-between text-xs font-medium"
        style={
          live
            ? { background: 'linear-gradient(90deg, rgb(115, 2, 97), rgb(54, 4, 46))', color: 'white' }
            : status === 'finished'
            ? { backgroundColor: '#f3f4f6', color: '#6b7280' }
            : { background: 'linear-gradient(90deg, rgb(115, 2, 97), rgb(54, 4, 46))', color: '#ffffff' }
        }
      >
        <span>
          {live ? `EN DIRECT — ${game.time_elapsed?.toUpperCase()}` : status === 'finished' ? 'Terminé' : formatMatchDate(game.local_date)}
        </span>
        <span className="uppercase tracking-wide">
          {game.type === 'group' ? `Groupe ${game.group} · J${game.matchday}` : phaseLabel(game.type)}
        </span>
      </div>

      {/* Score area */}
      <div className="px-4 py-5 flex items-center gap-3">
        <TeamDisplay name={homeName} isHome={true} />

        <div className="flex flex-col items-center gap-1 min-w-[48px]">
          {status === 'upcoming' ? (
            <span className="text-lg font-bold text-gray-400">vs</span>
          ) : (
            <span className="text-3xl font-bold text-gray-900">
              {game.home_score ?? 0} – {game.away_score ?? 0}
            </span>
          )}
          {live && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-600 font-semibold">Live</span>
            </span>
          )}
        </div>

        <TeamDisplay name={awayName} isHome={false} />
      </div>

      {/* Stadium */}
      {stadium && (
        <div className="px-4 pb-3 text-xs text-gray-400 text-center">
          {stadium.name} · {stadium.city}
        </div>
      )}
    </div>
  );
}

// ── Filter tabs ───────────────────────────────────────────────────────────────

type Filter = 'tous' | 'elimination';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'tous', label: 'Tous les matchs' },
  { id: 'elimination', label: 'Phases éliminatoires' },
];

// ── Group section ─────────────────────────────────────────────────────────────

function GroupSection({ groupName, games, stadiumMap }: {
  groupName: string;
  games: Game[];
  stadiumMap: Record<number, Stadium>;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-white text-sm font-bold shadow">
          {groupName.replace('Group ', '').replace('Groupe ', '')}
        </div>
        <h3 className="font-montserrat font-semibold text-white uppercase tracking-wide text-sm">
          Groupe {groupName.replace('Group ', '').replace('Groupe ', '')}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {games.map(g => (
          <MatchCard key={g._id || g.id} game={g} stadium={stadiumMap[g.stadium_id]} />
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Mondial() {
  const { games, stadiumMap, loading, error } = useWorldCupData();
  const [filter, setFilter] = useState<Filter>('tous');

  const filteredGames = useMemo(() => {
    switch (filter) {
      case 'elimination':
        return games.filter(g => g.type !== 'group');
      default:
        return games;
    }
  }, [games, filter]);

  const liveGames = games.filter(g => isLive(g));

  const groupedByGroup = useMemo(() => {
    if (filter !== 'tous') return null;
    const groupGames = filteredGames.filter(g => g.type === 'group');
    const map: Record<string, Game[]> = {};
    for (const g of groupGames) {
      const key = g.group ?? 'Autres';
      if (!map[key]) map[key] = [];
      map[key].push(g);
    }
    return map;
  }, [filteredGames, filter]);

  const eliminationGames = useMemo(() => {
    return filteredGames.filter(g => g.type !== 'group');
  }, [filteredGames]);

  return (
    <div className="min-h-screen">
      <Header />

      {/* CDM GIF banner */}
      <div className="w-full overflow-hidden" style={{ maxHeight: 320 }}>
        <img
          src="/CDM GIF.gif"
          alt="Coupe du Monde 2026"
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
          {liveGames.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {liveGames.length} match{liveGames.length > 1 ? 's' : ''} en direct
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
                style={filter === f.id ? { background: 'linear-gradient(90deg, rgb(115, 2, 97), rgb(54, 4, 46))' } : {}}
              >
                {f.label}
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
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 rounded-lg text-white text-sm"
              style={{ background: 'linear-gradient(90deg, rgb(115, 2, 97), rgb(54, 4, 46))' }}
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-10">
            {/* Phase de groupes */}
            {groupedByGroup && Object.keys(groupedByGroup).length > 0 && (
              <div>
                <div className="space-y-8">
                  {Object.entries(groupedByGroup)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([group, groupGames]) => (
                      <GroupSection
                        key={group}
                        groupName={group}
                        games={groupGames}
                        stadiumMap={stadiumMap}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Phases éliminatoires */}
            {eliminationGames.length > 0 && (
              <div>
                <h2 className="font-montserrat font-bold text-lg text-white mb-4">
                  Phases éliminatoires
                </h2>
                <div className="space-y-6">
                  {['r32', 'r16', 'qf', 'sf', 'third', 'final'].map(phase => {
                    const phaseGames = eliminationGames.filter(g => g.type === phase);
                    if (phaseGames.length === 0) return null;
                    return (
                      <div key={phase}>
                        <h3 className="font-montserrat font-semibold text-sm uppercase tracking-wide text-white mb-3">
                          {phaseLabel(phase)}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {phaseGames.map(g => (
                            <MatchCard key={g._id || g.id} game={g} stadium={stadiumMap[g.stadium_id]} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

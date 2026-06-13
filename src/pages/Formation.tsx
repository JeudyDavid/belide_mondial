import React, { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ── Types ────────────────────────────────────────────────────────────────────

interface Player {
  name: string;
  number: number;
  position: string;
  photo: string;
  club: string;
}

interface SlotPosition {
  role: string;
  x: number;
  y: number;
  playerId: number | null;
}

// ── Haiti Squad ───────────────────────────────────────────────────────────────

const SQUAD: Player[] = [
  { number: 1,  name: 'Johny Placide',        position: 'GK',         photo: '/grenadiers-img/images/photos/johny-placide.jpg',        club: 'Bastia' },
  { number: 2,  name: 'Carlens Arcus',         position: 'RB',         photo: '/grenadiers-img/images/photos/carlens-arcus.jpg',         club: 'Angers' },
  { number: 3,  name: 'Keeto Thermoncy',       position: 'CB',         photo: '/grenadiers-img/images/photos/keeto-thermoncy.jpg',       club: 'BSC Young Boys' },
  { number: 4,  name: 'Ricardo Adé',           position: 'CB',         photo: '/grenadiers-img/images/photos/ricardo-ade.jpg',           club: 'LDU Quito' },
  { number: 5,  name: 'Hannes Delcroix',       position: 'CB',         photo: '/grenadiers-img/images/photos/hannes-delcroix.jpg',       club: 'Lugano' },
  { number: 6,  name: 'Carl Sainté',           position: 'DM',         photo: '/grenadiers-img/images/photos/carl-sainte.jpg',           club: 'El Paso Locomotive' },
  { number: 7,  name: 'Derrick Etienne Jr.',   position: 'LW',         photo: '/grenadiers-img/images/photos/derrick-etienne.jpg',       club: 'Toronto FC' },
  { number: 8,  name: 'Martin Experience',     position: 'LB',         photo: '/grenadiers-img/images/photos/martin-experience.jpg',     club: 'Nancy' },
  { number: 9,  name: 'Duckens Nazon',         position: 'ST',         photo: '/grenadiers-img/images/photos/duckens-nazon.jpg',         club: 'Esteghlal' },
  { number: 10, name: 'Jean-Ricner Bellegarde',position: 'CM',         photo: '/grenadiers-img/images/photos/jean-ricner-bellegarde.jpg',club: 'Wolverhampton' },
  { number: 11, name: 'Louicius Deedson',      position: 'RW',         photo: '/grenadiers-img/images/photos/louicius-deedson.jpg',      club: 'FC Dallas' },
  { number: 12, name: 'Alexandre Pierre',      position: 'GK',         photo: '/grenadiers-img/images/photos/alexandre-pierre.jpg',      club: 'Sochaux' },
  { number: 13, name: 'Duke Lacroix',          position: 'LB',         photo: '/grenadiers-img/images/photos/duke-lacroix.jpg',          club: 'Colorado Springs' },
  { number: 14, name: 'Leverton Pierre',       position: 'DM',         photo: '/grenadiers-img/images/photos/leverton-pierre.jpg',       club: 'Vizela' },
  { number: 15, name: 'Ruben Providence',      position: 'LW',         photo: '/grenadiers-img/images/photos/ruben-providence.jpg',      club: 'Almere City' },
  { number: 16, name: 'Lenny Joseph',          position: 'ST',         photo: '/grenadiers-img/images/photos/lenny-joseph.jpg',          club: 'Ferencváros' },
  { number: 17, name: 'Danley Jean Jacques',   position: 'CM',         photo: '/grenadiers-img/images/photos/danley-jean-jacques.jpg',   club: 'Philadelphia Union' },
  { number: 18, name: 'Wilson Isidor',         position: 'ST',         photo: '/grenadiers-img/images/photos/wilson-isidor.jpg',         club: 'Sunderland' },
  { number: 19, name: 'Yassin Fortune',        position: 'ST',         photo: '/grenadiers-img/images/photos/yassin-fortune.jpg',        club: 'Vizela' },
  { number: 20, name: 'Frantzdy Pierrot',      position: 'ST',         photo: '/grenadiers-img/images/photos/frantzdy-pierrot.jpg',      club: 'Çaykur Rizespor' },
  { number: 21, name: 'Josué Casimir',         position: 'RW',         photo: '/grenadiers-img/images/photos/josue-casimir.jpg',         club: 'Auxerre' },
  { number: 22, name: 'Jean-Kévin Duverne',   position: 'CB',         photo: '/grenadiers-img/images/photos/jean-kevin-duverne.jpg',    club: 'Gent' },
  { number: 23, name: 'Josue Duverger',        position: 'GK',         photo: '/grenadiers-img/images/photos/josue-duverger.jpg',        club: 'Cosmos Koblenz' },
  { number: 24, name: 'Wilguens Paugain',      position: 'RB',         photo: '/grenadiers-img/images/photos/wilguens-paugain.jpg',      club: 'Zulte Waregem' },
  { number: 25, name: 'Dominique Simon',       position: 'CM',         photo: '/grenadiers-img/images/photos/dominique-simon.jpg',       club: 'FC Tatran Prešov' },
  { number: 26, name: 'Woodensky Pierre',      position: 'DM',         photo: '/grenadiers-img/images/photos/woodensky-pierre.jpg',      club: 'Violette AC' },
];

// ── Formations ────────────────────────────────────────────────────────────────

const FORMATION_SLOTS: Record<string, { role: string; x: number; y: number }[]> = {
  '4-4-2': [
    { role: 'GB',  x: 50, y: 88 },
    { role: 'DD',  x: 82, y: 70 }, { role: 'DC', x: 60, y: 70 }, { role: 'DC', x: 40, y: 70 }, { role: 'DG', x: 18, y: 70 },
    { role: 'MD',  x: 80, y: 48 }, { role: 'MC', x: 60, y: 48 }, { role: 'MC', x: 40, y: 48 }, { role: 'MG', x: 20, y: 48 },
    { role: 'AT',  x: 64, y: 22 }, { role: 'AT', x: 36, y: 22 },
  ],
  '4-3-3': [
    { role: 'GB',  x: 50, y: 88 },
    { role: 'DD',  x: 82, y: 70 }, { role: 'DC', x: 60, y: 70 }, { role: 'DC', x: 40, y: 70 }, { role: 'DG', x: 18, y: 70 },
    { role: 'MD',  x: 72, y: 48 }, { role: 'MC', x: 50, y: 46 }, { role: 'MG', x: 28, y: 48 },
    { role: 'AD',  x: 78, y: 22 }, { role: 'AT', x: 50, y: 18 }, { role: 'AG', x: 22, y: 22 },
  ],
  '4-2-3-1': [
    { role: 'GB',  x: 50, y: 88 },
    { role: 'DD',  x: 82, y: 72 }, { role: 'DC', x: 60, y: 72 }, { role: 'DC', x: 40, y: 72 }, { role: 'DG', x: 18, y: 72 },
    { role: 'MDC', x: 62, y: 56 }, { role: 'MDC', x: 38, y: 56 },
    { role: 'AD',  x: 76, y: 36 }, { role: 'MOC', x: 50, y: 34 }, { role: 'AG', x: 24, y: 36 },
    { role: 'AT',  x: 50, y: 16 },
  ],
  '3-5-2': [
    { role: 'GB',  x: 50, y: 88 },
    { role: 'DC',  x: 70, y: 70 }, { role: 'DC', x: 50, y: 70 }, { role: 'DC', x: 30, y: 70 },
    { role: 'PD',  x: 88, y: 50 }, { role: 'MC', x: 68, y: 50 }, { role: 'MC', x: 50, y: 48 }, { role: 'MC', x: 32, y: 50 }, { role: 'PG', x: 12, y: 50 },
    { role: 'AT',  x: 64, y: 22 }, { role: 'AT', x: 36, y: 22 },
  ],
  '4-1-4-1': [
    { role: 'GB',  x: 50, y: 88 },
    { role: 'DD',  x: 82, y: 72 }, { role: 'DC', x: 60, y: 72 }, { role: 'DC', x: 40, y: 72 }, { role: 'DG', x: 18, y: 72 },
    { role: 'MDC', x: 50, y: 58 },
    { role: 'MD',  x: 80, y: 42 }, { role: 'MC', x: 60, y: 42 }, { role: 'MC', x: 40, y: 42 }, { role: 'MG', x: 20, y: 42 },
    { role: 'AT',  x: 50, y: 18 },
  ],
};

// Default lineup for 4-4-2
const DEFAULT_LINEUP: Record<string, number[]> = {
  '4-4-2':    [1, 2, 3, 4, 5, 11, 10, 6, 7, 18, 9],
  '4-3-3':    [1, 2, 3, 4, 5, 10, 6, 17, 11, 18, 7],
  '4-2-3-1':  [1, 2, 3, 4, 5, 6, 14, 11, 10, 7, 18],
  '3-5-2':    [1, 3, 4, 22, 2, 10, 6, 17, 8, 9, 18],
  '4-1-4-1':  [1, 2, 3, 4, 5, 6, 11, 10, 17, 7, 18],
};

function buildSlots(formation: string): SlotPosition[] {
  const lineup = DEFAULT_LINEUP[formation] ?? [];
  return FORMATION_SLOTS[formation].map((s, i) => ({
    ...s,
    playerId: lineup[i] ?? null,
  }));
}

function getPlayer(id: number | null) {
  return SQUAD.find(p => p.number === id) ?? null;
}

// ── Field lines ───────────────────────────────────────────────────────────────

function FieldLines() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect x="5" y="2" width="90" height="96" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
      <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.45)" strokeWidth="0.4" />
      <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.4" />
      <circle cx="50" cy="50" r="0.8" fill="rgba(255,255,255,0.45)" />
      <rect x="25" y="2" width="50" height="15" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.4" />
      <rect x="35" y="2" width="30" height="7" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.4" />
      <rect x="25" y="83" width="50" height="15" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.4" />
      <rect x="35" y="91" width="30" height="7" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.4" />
      <circle cx="50" cy="10" r="0.6" fill="rgba(255,255,255,0.45)" />
      <circle cx="50" cy="90" r="0.6" fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}

// ── Player dot on field ───────────────────────────────────────────────────────

function PlayerDot({ slot, selected, onClick }: {
  slot: SlotPosition;
  selected: boolean;
  onClick: () => void;
}) {
  const player = getPlayer(slot.playerId);

  return (
    <button
      onClick={onClick}
      className="absolute flex flex-col items-center gap-0.5 -translate-x-1/2 -translate-y-1/2 group z-10"
      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
    >
      <div
        className={`w-12 h-12 md:w-24 md:h-24 rounded-full overflow-hidden border-2 md:border-[3px] shadow-lg transition-all flex items-center justify-center
          ${selected ? 'border-yellow-400 scale-110 ring-2 ring-yellow-300' : 'border-white group-hover:border-yellow-300'}`}
        style={{ background: 'linear-gradient(135deg, rgb(0,32,159), rgb(0,0,100))' }}
      >
        {player ? (
          <img
            src={player.photo}
            alt={player.name}
            className="w-full h-full object-cover object-top"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <span className="text-white text-[8px] md:text-[10px] font-bold">{slot.role}</span>
        )}
      </div>
      <div
        className="px-1 rounded text-center"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(2px)' }}
      >
        {player && (
          <span className="text-[7px] md:text-[9px] font-bold text-white block leading-tight">#{player.number}</span>
        )}
        <span className="text-white text-[8px] md:text-[10px] font-semibold leading-tight block" style={{ maxWidth: 48 }}>
          {player ? player.name.split(' ').pop() : slot.role}
        </span>
      </div>
    </button>
  );
}

// ── Share helpers ─────────────────────────────────────────────────────────────

function encodeState(formation: string, slots: SlotPosition[]): string {
  const data = { f: formation, p: slots.map(s => s.playerId) };
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

function decodeState(encoded: string): { formation: string; playerIds: (number | null)[] } | null {
  try {
    const data = JSON.parse(decodeURIComponent(atob(encoded)));
    return { formation: data.f, playerIds: data.p };
  } catch {
    return null;
  }
}

function getShareUrl(formation: string, slots: SlotPosition[]): string {
  return `${window.location.origin}/formation?t=${encodeState(formation, slots)}`;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Formation() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('t');
  const decoded = encoded ? decodeState(encoded) : null;

  const initFormation = decoded?.formation ?? '4-4-2';
  const [formation, setFormation] = useState(initFormation);
  const [slots, setSlots] = useState<SlotPosition[]>(() => {
    const base = buildSlots(initFormation);
    if (decoded?.playerIds) {
      return base.map((s, i) => ({ ...s, playerId: decoded.playerIds[i] ?? null }));
    }
    return base;
  });
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const usedIds = slots.map(s => s.playerId).filter(Boolean) as number[];

  const changeFormation = (f: string) => {
    setFormation(f);
    setSlots(prev => {
      const base = FORMATION_SLOTS[f];
      const lineup = DEFAULT_LINEUP[f] ?? [];
      return base.map((s, i) => ({
        ...s,
        playerId: prev[i]?.playerId ?? lineup[i] ?? null,
      }));
    });
    setSelectedSlot(null);
  };

  const assignPlayer = useCallback((playerId: number) => {
    if (selectedSlot === null) return;
    setSlots(prev => prev.map((s, i) => {
      if (i === selectedSlot) return { ...s, playerId };
      if (s.playerId === playerId) return { ...s, playerId: null };
      return s;
    }));
  }, [selectedSlot]);

  const removePlayer = useCallback(() => {
    if (selectedSlot === null) return;
    setSlots(prev => prev.map((s, i) => i === selectedSlot ? { ...s, playerId: null } : s));
  }, [selectedSlot]);

  const shareUrl = getShareUrl(formation, slots);
  const shareText = `🇭🇹 Ma sélection haïtienne pour le Mondial 2026 en ${formation} ! Compose la tienne :`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateImageBlob = async (): Promise<Blob> => {
    const SCALE = 3;
    const W = 600, H = 850;
    const canvas = document.createElement('canvas');
    canvas.width = W * SCALE;
    canvas.height = H * SCALE;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(SCALE, SCALE);

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#1a6b1a'); grad.addColorStop(0.5, '#228b22'); grad.addColorStop(1, '#196019');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 8; i += 2) {
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, i * (H / 8), W, H / 8);
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1.5;
    ctx.strokeRect(28, 16, W - 56, H - 32);
    ctx.beginPath(); ctx.moveTo(28, H / 2); ctx.lineTo(W - 28, H / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 65, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeRect(W / 2 - 110, 16, 220, 72); ctx.strokeRect(W / 2 - 62, 16, 124, 32);
    ctx.strokeRect(W / 2 - 110, H - 88, 220, 72); ctx.strokeRect(W / 2 - 62, H - 48, 124, 32);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(W / 2, 52, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W / 2, H - 52, 3, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, 52);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 18px Montserrat, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`🇭🇹 Grenadiers · ${formation}`, W / 2, 33);

    const loadImg = (src: string): Promise<HTMLImageElement> =>
      new Promise(res => {
        const img = new Image(); img.crossOrigin = 'anonymous';
        img.onload = () => res(img);
        img.onerror = () => res(img);
        img.src = src;
      });

    const r = 34;
    for (const slot of slots) {
      const player = getPlayer(slot.playerId);
      const px = (slot.x / 100) * W;
      const py = (slot.y / 100) * H;

      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.arc(px + 2, py + 2, r, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#00209F';
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();

      if (player) {
        const img = await loadImg(player.photo);
        if (img.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath(); ctx.arc(px, py, r - 1, 0, Math.PI * 2); ctx.clip();
          ctx.drawImage(img, px - r, py - r, r * 2, r * 2);
          ctx.restore();
        }
      }

      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.stroke();

      const lastName = player ? player.name.split(' ').pop()! : slot.role;
      ctx.font = 'bold 11px Montserrat, sans-serif';
      const tw = ctx.measureText(lastName).width;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.beginPath();
      ctx.roundRect(px - tw / 2 - 6, py + r + 4, tw + 12, 18, 4);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 2;
      ctx.fillText(lastName, px, py + r + 16);
      ctx.shadowBlur = 0;
    }

    const logo = await loadImg('/belide-logo.png');
    if (logo.naturalWidth > 0) {
      const logoW = 160, logoH = (logo.naturalHeight / logo.naturalWidth) * logoW;
      ctx.globalAlpha = 0.9;
      ctx.drawImage(logo, W - logoW - 12, H - logoH - 12, logoW, logoH);
      ctx.globalAlpha = 1;
    }

    return new Promise(resolve =>
      canvas.toBlob(blob => resolve(blob!), 'image/png', 1.0)
    );
  };

  const downloadImage = async () => {
    const blob = await generateImageBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grenadiers-${formation}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareImage = async () => {
    const blob = await generateImageBlob();
    const file = new File([blob], `grenadiers-${formation}.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: `🇭🇹 Grenadiers · ${formation}`,
        text: shareText,
      });
    } else {
      // Fallback: download if Web Share not supported
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `grenadiers-${formation}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const filteredSquad = SQUAD.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.club.toLowerCase().includes(search.toLowerCase()) ||
    p.position.toLowerCase().includes(search.toLowerCase())
  );

  const currentSlot = selectedSlot !== null ? slots[selectedSlot] : null;
  const currentPlayer = currentSlot ? getPlayer(currentSlot.playerId) : null;

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <div className="gradient-purple text-white py-10 px-4 text-center">
        <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">
          Bèlide Magazine · Mondial 2026
        </p>
        <h1 className="font-montserrat font-bold text-3xl md:text-4xl mb-2">
          🇭🇹 Compose ta Sélection
        </h1>
        <p className="text-purple-200 text-sm">
          Grenadiers — Groupe C
        </p>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left panel ── */}
          <div className="space-y-4">

            {/* Formation selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-montserrat font-semibold text-gray-600 mb-3 text-xs uppercase tracking-wide">
                Formation
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(FORMATION_SLOTS).map(f => (
                  <button
                    key={f}
                    onClick={() => changeFormation(f)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      formation === f ? 'text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={formation === f ? { background: 'linear-gradient(135deg, rgb(115,2,97), rgb(54,4,46))' } : {}}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected slot info */}
            {currentSlot && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-montserrat font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Poste : {currentSlot.role}
                  </h3>
                  {currentPlayer && (
                    <button onClick={removePlayer} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 text-xs font-bold transition-colors">
                      ✕ Retirer
                    </button>
                  )}
                </div>
                {currentPlayer && (
                  <div className="flex items-center gap-3 mb-3 p-2 bg-purple-50 rounded-lg">
                    <img src={currentPlayer.photo} alt={currentPlayer.name}
                      className="w-10 h-10 rounded-full object-cover object-top border-2 border-purple-300" />
                    <div>
                      <p className="font-semibold text-sm text-gray-800">#{currentPlayer.number} {currentPlayer.name}</p>
                      <p className="text-xs text-gray-500">{currentPlayer.club}</p>
                    </div>
                  </div>
                )}
                <input
                  ref={searchRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher un joueur…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 mb-2"
                  autoFocus
                />
                <div className="space-y-1 max-h-52 overflow-y-auto">
                  {filteredSquad.map(player => {
                    const isUsed = usedIds.includes(player.number) && currentPlayer?.number !== player.number;
                    return (
                      <button
                        key={player.number}
                        onClick={() => assignPlayer(player.number)}
                        disabled={isUsed}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
                          isUsed ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-50'
                        } ${currentPlayer?.number === player.number ? 'bg-purple-100' : ''}`}
                      >
                        <img src={player.photo} alt={player.name}
                          className="w-7 h-7 rounded-full object-cover object-top border border-gray-200 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-gray-800 block truncate">
                            #{player.number} {player.name}
                          </span>
                          <span className="text-[10px] text-gray-400 truncate block">{player.position} · {player.club}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!currentSlot && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 text-center">
                👆 Clique sur une position sur le terrain pour changer le joueur
              </div>
            )}

            {/* Share */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
              <h3 className="font-montserrat font-semibold text-gray-600 text-xs uppercase tracking-wide">
                Partager
              </h3>
              <button
                onClick={copyLink}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, rgb(115,2,97), rgb(54,4,46))' }}
              >
                {copied ? '✓ Lien copié !' : '🔗 Copier le lien'}
              </button>
              <button
                onClick={shareImage}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, rgb(0,140,0), rgb(0,80,0))' }}
              >
                Partager la photo
              </button>
              <button
                onClick={downloadImage}
                className="w-full py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ⬇ Télécharger l'image
              </button>
            </div>
          </div>

          {/* ── Soccer field ── */}
          <div className="lg:col-span-2">
            <div
              className="relative w-full rounded-2xl overflow-hidden shadow-xl"
              style={{
                paddingBottom: '140%',
                background: 'linear-gradient(180deg, #1a6b1a 0%, #228b22 30%, #1e7a1e 60%, #196019 100%)',
              }}
            >
              {/* Stripes */}
              {Array.from({ length: 8 }).map((_, i) => (
                i % 2 === 0 && (
                  <div key={i} className="absolute w-full pointer-events-none"
                    style={{ top: `${i * 12.5}%`, height: '12.5%', background: 'rgba(0,0,0,0.07)' }} />
                )
              ))}

              <FieldLines />

              {/* Header bar */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-center py-2 z-20"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                <span className="text-white text-xs font-bold tracking-wide">
                  🇭🇹 Grenadiers · {formation}
                </span>
              </div>

              {/* Belide logo */}
              <img
                src="/belide-logo.png"
                alt="Belide Magazine"
                className="absolute bottom-3 right-3 z-20 opacity-80"
                style={{ width: 150 }}
              />

              {slots.map((slot, i) => (
                <PlayerDot
                  key={i}
                  slot={slot}
                  selected={selectedSlot === i}
                  onClick={() => {
                    setSelectedSlot(i === selectedSlot ? null : i);
                    setSearch('');
                    setTimeout(() => searchRef.current?.focus(), 50);
                  }}
                />
              ))}
            </div>

            {/* Squad not on field */}
            <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-montserrat font-semibold text-gray-600 text-xs uppercase tracking-wide mb-3">
                Remplaçants disponibles
              </h3>
              <div className="flex flex-wrap gap-2">
                {SQUAD.filter(p => !usedIds.includes(p.number)).map(player => (
                  <div key={player.number} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1">
                    <img src={player.photo} alt={player.name}
                      className="w-6 h-6 rounded-full object-cover object-top border border-gray-200" />
                    <span className="text-xs text-gray-600 font-medium">{player.name.split(' ').pop()}</span>
                  </div>
                ))}
                {SQUAD.filter(p => !usedIds.includes(p.number)).length === 0 && (
                  <p className="text-xs text-gray-400">Tous les joueurs sont sur le terrain</p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                © Images des Grenadiers : Carel Pedre / grenadiers2026.com
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

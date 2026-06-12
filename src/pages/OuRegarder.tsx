import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Lieu {
  nom: string;
  adresse?: string;
}

interface Ville {
  nom: string;
  emoji: string;
  lieux: Lieu[];
}

const VILLES: Ville[] = [
  {
    nom: 'Port-au-Prince',
    emoji: '🏙️',
    lieux: [
      { nom: 'Place Boyer' },
      { nom: 'Place Canapé Vert' },
      { nom: 'VLounge' },
      { nom: 'Pizza Garden' },
      { nom: 'Ibiza' },
      { nom: 'Parc Relax' },
      { nom: 'Parc Sainte-Thérèse' },
    ],
  },
  {
    nom: 'Cap-Haïtien',
    emoji: '⚓',
    lieux: [
      { nom: 'Place Rue 18' },
      { nom: 'Lakaya Bar Restaurant' },
      { nom: 'Cormier Plage' },
      { nom: 'Central Point de Vente', adresse: 'Rue 5A' },
    ],
  },
  {
    nom: 'Saint-Marc',
    emoji: '🌊',
    lieux: [
      { nom: 'Boulevard de La Liberté' },
    ],
  },
  {
    nom: 'Les Cayes',
    emoji: '🌴',
    lieux: [
      { nom: "Place d'Arme des Cayes" },
    ],
  },
  {
    nom: 'Jérémie',
    emoji: '🏘️',
    lieux: [
      { nom: 'Santral Paryaj Lakay', adresse: 'Ri Alain Clerié, bò Komisarya' },
    ],
  },
  {
    nom: 'Ouanaminthe',
    emoji: '🌿',
    lieux: [
      { nom: 'Central Point de Vente' },
    ],
  },
];

export default function OuRegarder() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <div className="gradient-purple text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Bèlide Magazine · Mondial 2026
          </p>
          <h1 className="font-montserrat font-bold text-3xl md:text-5xl mb-3">
            🇭🇹 Où regarder les matchs ?
          </h1>
          <p className="text-purple-200 text-base md:text-lg">
            Les meilleurs endroits pour vivre le Mondial en Haïti
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="space-y-8">
          {VILLES.map(ville => (
            <div key={ville.nom}>
              {/* Ville header */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-montserrat font-bold text-white text-xl md:text-2xl">
                  {ville.nom}
                </h2>
                <div className="flex-1 h-px bg-white/30" />
              </div>

              {/* Lieux */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ville.lieux.map((lieu, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-5 py-4 flex items-start gap-3 shadow-sm transition-colors"
                    style={{ background: 'linear-gradient(135deg, rgb(115, 2, 97), rgb(54, 4, 46))' }}
                  >
                    <span className="text-yellow-400 text-lg mt-0.5">⚽</span>
                    <div>
                      <p className="font-montserrat font-semibold text-white text-sm">
                        {lieu.nom}
                      </p>
                      {lieu.adresse && (
                        <p className="text-xs text-purple-200 mt-0.5">{lieu.adresse}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

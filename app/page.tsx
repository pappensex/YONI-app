export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        <div className="card backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ✨ YONI – Überhochglitzer App
          </h1>
          
          <p className="text-lg mb-6 opacity-70">
            🟣 Ein sicherer, liebevoller Raum für mentale Gesundheit – digital, fachärztlich begleitet und technisch perfekt.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="card bg-opacity-50">
              <h2 className="text-xl font-semibold mb-2">🤝 Gemeinschaft</h2>
              <p className="opacity-70">
                Chat-Räume & Themenkreise mit Peer-Mentor:innen
              </p>
            </div>

            <div className="card bg-opacity-50">
              <h2 className="text-xl font-semibold mb-2">🧠 Fachliche Supervision</h2>
              <p className="opacity-70">
                Ärzt:innen, Therapeut:innen, geschützte Q&A
              </p>
            </div>

            <div className="card bg-opacity-50">
              <h2 className="text-xl font-semibold mb-2">🪞 Selbstwirksamkeit</h2>
              <p className="opacity-70">
                Tools für Reflexion, Stimmung & Achtsamkeit
              </p>
            </div>

            <div className="card bg-opacity-50">
              <h2 className="text-xl font-semibold mb-2">🌈 Überhochglitzer-Design</h2>
              <p className="opacity-70">
                Kosmisch, heilend, barrierefrei, technisch präzise
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-center opacity-60 italic">
              &ldquo;Im Dunkel des Alls glitzert jeder Mensch als eigene Galaxie.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

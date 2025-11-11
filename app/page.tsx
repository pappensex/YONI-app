export default function Home() {
  return (
    <div className="max-w-[860px] mx-auto my-10 px-4">
      <div className="bg-[var(--panel)] border border-white/8 rounded-[var(--radius)] p-4">
        <h1 className="text-[22px] mb-2 mt-0">YONI • pi² Control</h1>
        <div className="opacity-70">Vercel‑Minimal • Creator‑KI • Auto‑Translate • Transzendenz</div>
        <div className="flex gap-2 flex-wrap mt-2.5">
          <button className="bg-[var(--brand)] text-white border-none rounded-xl px-3 py-2.5">
            Offline aktivieren
          </button>
          <button className="bg-[var(--brand)] text-white border-none rounded-xl px-3 py-2.5">
            Zum Home‑Bildschirm
          </button>
        </div>
      </div>

      <div className="bg-[var(--panel)] border border-white/8 rounded-[var(--radius)] p-4 mt-4">
        <h2 className="text-xl mb-2">Transzendenz</h2>
        <div className="flex gap-2 flex-wrap">
          <select className="bg-white/6 border border-white/10 text-[var(--text)] rounded-xl p-2.5">
            <option>Consensus</option>
            <option>Contrast</option>
            <option>Chain</option>
          </select>
          <label className="opacity-70 flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            Auto‑Translate → Deutsch
          </label>
        </div>
        <textarea 
          className="w-full bg-white/6 border border-white/10 text-[var(--text)] rounded-xl p-2.5 mt-2"
          placeholder="Frag dein Multi‑Kollektiv …"
          rows={4}
        />
        <div className="flex gap-2 flex-wrap mt-2">
          <button className="bg-[var(--brand)] text-white border-none rounded-xl px-3 py-2.5">
            Fusion starten
          </button>
        </div>
        <div id="out" className="mt-2.5 grid gap-2"></div>
      </div>
    </div>
  )
}

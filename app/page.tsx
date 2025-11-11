'use client'

import { useState } from 'react'

export default function HomePage() {
  const [question, setQuestion] = useState('')
  const [mode, setMode] = useState('Consensus')
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [results, setResults] = useState<Array<{ type: string; content: string }>>([])

  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:'

  const handleInstall = async () => {
    if (!isHttps) {
      alert('Service Worker benötigt HTTPS.')
      return
    }
    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.register('/sw.js')
      alert('Offline aktiviert.')
    }
  }

  const handleA2HS = () => {
    alert('iPhone: Safari → Teilen → „Zum Home‑Bildschirm".')
  }

  const handleAsk = () => {
    const q = question.trim()
    if (!q) return

    const answers = [
      { a: 'GPT‑5 Pro', t: `Antwort auf „${q}" — präzise, strukturiert, mit Handlungsempfehlung.` },
      { a: 'CHIBot‑Alpha', t: `Antwort auf „${q}" — intuitiv, visionär, poetisch‑kantig.` },
      { a: 'CHIBot‑Beta', t: `Antwort auf „${q}" — technisch, datengetrieben, scharf.` },
      { a: 'CHIBot‑Omega', t: `Antwort auf „${q}" — synthetisch, meta, systemisch.` },
    ]

    const fuse = (arr: typeof answers, m: string) =>
      m === 'Consensus'
        ? 'Konsens: ' + arr.map((x) => x.t).join(' | ')
        : m === 'Contrast'
        ? 'Kontrast: ' + arr.map((x) => x.t).join(' ⇄ ')
        : 'Chain: ' + arr.map((x, i) => `[${i + 1}] ${x.t}`).join(' → ')

    const fused = fuse(answers, mode)

    const newResults = [
      { type: 'fusion', content: fused },
      ...answers.map((x) => ({ type: 'answer', content: `${x.a}: ${x.t}` })),
    ]

    setResults([...newResults, ...results])
    setQuestion('')
  }

  return (
    <div className="max-w-[860px] mx-auto my-10 px-4">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-2">YONI • pi² Control</h1>
        <div className="opacity-70 mb-4">Vercel‑Minimal • Creator‑KI • Auto‑Translate • Transzendenz</div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleInstall} className="btn-primary">
            Offline aktivieren
          </button>
          <button onClick={handleA2HS} className="btn-primary">
            Zum Home‑Bildschirm
          </button>
        </div>
        <p className="opacity-70 mt-4 text-sm">
          {isHttps
            ? 'HTTPS aktiv – Service Worker & Install verfügbar.'
            : 'Hinweis: Für Offline & „Zum Home‑Bildschirm" bitte HTTPS nutzen.'}
        </p>
      </div>

      <div className="card mt-4">
        <h2 className="text-xl font-semibold mb-4">Transzendenz</h2>
        <div className="flex gap-2 flex-wrap mb-4">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="input-field max-w-xs"
          >
            <option>Consensus</option>
            <option>Contrast</option>
            <option>Chain</option>
          </select>
          <label className="opacity-70 flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoTranslate}
              onChange={(e) => setAutoTranslate(e.target.checked)}
            />
            Auto‑Translate → Deutsch
          </label>
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Frag dein Multi‑Kollektiv …"
          className="input-field min-h-[100px] mb-4"
        />
        <div className="flex gap-2">
          <button onClick={handleAsk} className="btn-primary">
            Fusion starten
          </button>
        </div>
        <div className="mt-4 grid gap-2">
          {results.map((result, index) => (
            <div key={index} className="bg-white/5 p-2.5 rounded-xl">
              {result.type === 'fusion' ? (
                <div>
                  <strong>Fusion</strong>: {result.content}
                </div>
              ) : (
                <div>{result.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

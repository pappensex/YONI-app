'use client'

import { useState, useCallback } from 'react'
import AgeVerification from './components/AgeVerification'
import GoddessMode from './components/GoddessMode'
import DreamCastle from './components/DreamCastle'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [mode, setMode] = useState('Consensus')
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [feed, setFeed] = useState<Array<{ id: number; agent: string; text: string; isFusion?: boolean }>>([])
  const [envMessage, setEnvMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)

  const handleAgeVerified = useCallback(() => {
    setAgeVerified(true)
  }, [])

  // Check environment on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      setEnvMessage(
        window.location.protocol === 'https:'
          ? 'HTTPS aktiv – Service Worker & Install verfügbar.'
          : 'Hinweis: Für Offline & „Zum Home‑Bildschirm" bitte HTTPS nutzen.'
      )
    }
  })

  const handleInstall = async () => {
    if (typeof window !== 'undefined') {
      if (window.location.protocol !== 'https:') {
        alert('Service Worker benötigt HTTPS.')
        return
      }
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/sw.js')
        alert('Offline aktiviert.')
      }
    }
  }

  const handleA2HS = () => {
    alert('iPhone: Safari → Teilen → „Zum Home‑Bildschirm".')
  }

  const handleAsk = async () => {
    const q = question.trim()
    if (!q || isLoading) return

    setIsLoading(true)
    
    try {
      // Call the ChatGPT API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: q,
          mode: mode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'API request failed')
      }

      // Add the response to the feed
      const newItem = {
        id: Date.now(),
        agent: `ChatGPT (${mode})`,
        text: data.response,
      }

      setFeed([newItem, ...feed])
      setQuestion('') // Clear the question after successful submission
    } catch (error: any) {
      // Add error to feed
      const errorItem = {
        id: Date.now(),
        agent: 'Error',
        text: `Fehler: ${error.message}. Bitte stelle sicher, dass der OPENAI_API_KEY konfiguriert ist.`,
      }
      setFeed([errorItem, ...feed])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {!ageVerified && <AgeVerification onVerified={handleAgeVerified} />}
      {ageVerified && <GoddessMode />}
      <div className="wrap">
        <div className="card">
          <h1>YONI • pi² Control</h1>
          <div className="muted">Vercel‑Minimal • Creator‑KI • Auto‑Translate • Transzendenz • 18+</div>
          <div className="row">
            <button onClick={handleInstall}>Offline aktivieren</button>
            <button onClick={handleA2HS}>Zum Home‑Bildschirm</button>
          </div>
          <p className="muted">{envMessage}</p>
        </div>

        {/* Dream Castle */}
        <div className="card" style={{ marginTop: '16px' }}>
          <DreamCastle />
        </div>

        <div className="card" style={{ marginTop: '16px' }}>
          <h2>Transzendenz</h2>
          <div className="row">
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value)}
            >
              <option>Consensus</option>
              <option>Contrast</option>
              <option>Chain</option>
            </select>
            <label className="muted">
              <input 
                type="checkbox" 
                checked={autoTranslate}
                onChange={(e) => setAutoTranslate(e.target.checked)}
              /> Auto‑Translate → Deutsch
            </label>
          </div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Frag dein Multi‑Kollektiv …"
          />
          <div className="row">
            <button onClick={handleAsk} disabled={isLoading}>
              {isLoading ? 'ChatGPT denkt nach...' : 'Frage an ChatGPT'}
            </button>
          </div>
          <div className="feed">
            {feed.map((item) => (
              <div key={item.id} className="item">
                <b>{item.agent}</b>: {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

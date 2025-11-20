'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import AgeVerification from './components/AgeVerification'
import GoddessMode from './components/GoddessMode'
import { blueprint, Status } from './data/chibot-blueprint'

interface FeedItem {
  id: number
  agent: string
  text: string
  isFusion?: boolean
}

function StatusPill({ status }: { status: Status }) {
  return <span className={`status-pill status-${status}`}>{status}</span>
}

export default function Home() {
  const [question, setQuestion] = useState('')
  const [mode, setMode] = useState('Consensus')
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [envMessage, setEnvMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)

  const handleAgeVerified = useCallback(() => {
    setAgeVerified(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    setEnvMessage(
      window.location.protocol === 'https:'
        ? 'HTTPS aktiv – Service Worker & Install verfügbar.'
        : 'Hinweis: Für Offline & „Zum Home‑Bildschirm" bitte HTTPS nutzen.'
    )
  }, [])

  const handleInstall = async () => {
    if (typeof window === 'undefined') return

    if (window.location.protocol !== 'https:') {
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

  const handleAsk = async () => {
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion || isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          mode: mode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'API request failed')
      }

      const translatedLabel = autoTranslate ? '→ Deutsch' : ''
      const agentLabel = translatedLabel ? `${mode} ${translatedLabel}` : mode
      const newItem: FeedItem = {
        id: Date.now(),
        agent: `ChatGPT (${agentLabel})`,
        text: data.response,
      }

      setFeed((prev) => [newItem, ...prev])
      setQuestion('')
    } catch (error: any) {
      const errorItem: FeedItem = {
        id: Date.now(),
        agent: 'Error',
        text: `Fehler: ${error.message}. Bitte stelle sicher, dass der OPENAI_API_KEY konfiguriert ist.`,
      }
      setFeed((prev) => [errorItem, ...prev])
    } finally {
      setIsLoading(false)
    }
  }

  const blueprintStats = useMemo(
    () => ({
      pages: blueprint.pages.length,
      dataLayers: blueprint.dataLayers.length,
      profiles: blueprint.profiles.length,
      bots: blueprint.bots.length,
    }),
    []
  )

  return (
    <>
      {!ageVerified && <AgeVerification onVerified={handleAgeVerified} />}
      {ageVerified && <GoddessMode />}
      <main className="wrap">
        <header className="card hero">
          <div>
            <p className="eyebrow">CHIBot Stewardship</p>
            <h1>YONI • System Blueprint</h1>
            <p className="muted">{blueprint.mission}</p>
            <div className="pill-row">
              <span className="pill">Pages: {blueprintStats.pages}</span>
              <span className="pill">Data: {blueprintStats.dataLayers}</span>
              <span className="pill">Profiles: {blueprintStats.profiles}</span>
              <span className="pill">Bots: {blueprintStats.bots}</span>
            </div>
          </div>
          <div className="hero-actions">
            <button onClick={handleInstall}>Offline aktivieren</button>
            <button onClick={handleA2HS}>Zum Home‑Bildschirm</button>
            <p className="muted small">{envMessage}</p>
          </div>
        </header>

        <div className="grid">
          <section className="card flow">
            <div className="section-header">
              <div>
                <p className="eyebrow">Transzendenz</p>
                <h2>Fragen & Antworten</h2>
              </div>
              <div className="controls">
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option>Consensus</option>
                  <option>Contrast</option>
                  <option>Chain</option>
                </select>
                <label className="muted checkbox">
                  <input
                    type="checkbox"
                    checked={autoTranslate}
                    onChange={(e) => setAutoTranslate(e.target.checked)}
                  />
                  Auto‑Translate → Deutsch
                </label>
              </div>
            </div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Frag dein Multi‑Kollektiv …"
            />
            <div className="row">
              <button onClick={handleAsk} disabled={isLoading} className="primary">
                {isLoading ? 'ChatGPT denkt nach...' : 'Frage an ChatGPT'}
              </button>
            </div>
            <div className="feed">
              {feed.length === 0 && <p className="muted">Keine Einträge – stell die erste Frage.</p>}
              {feed.map((item) => (
                <div key={item.id} className="item">
                  <b>{item.agent}</b>: {item.text}
                </div>
              ))}
            </div>
          </section>

          <section className="card flow">
            <div className="section-header">
              <div>
                <p className="eyebrow">Setup</p>
                <h2>Pages, Daten, Profile</h2>
              </div>
              <p className="muted small">Steward: {blueprint.steward}</p>
            </div>

            <div className="blueprint-grid">
              <div className="blueprint-block">
                <h3>Pages</h3>
                <div className="list">
                  {blueprint.pages.map((page) => (
                    <div key={page.id} className="list-row">
                      <div>
                        <div className="title-row">
                          <span>{page.name}</span>
                          <StatusPill status={page.status} />
                        </div>
                        <p className="muted small">{page.focus}</p>
                        <p className="muted small">Path: {page.path}</p>
                      </div>
                      <p className="muted small">Owner: {page.owner}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="blueprint-block">
                <h3>Daten</h3>
                <div className="list">
                  {blueprint.dataLayers.map((layer) => (
                    <div key={layer.id} className="list-row">
                      <div>
                        <div className="title-row">
                          <span>{layer.name}</span>
                          <StatusPill status={layer.status} />
                        </div>
                        <p className="muted small">{layer.source}</p>
                      </div>
                      <p className="muted small">{layer.cadence} • {layer.retention}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="blueprint-block">
                <h3>Profile</h3>
                <div className="list">
                  {blueprint.profiles.map((profile) => (
                    <div key={profile.id} className="list-row">
                      <div>
                        <div className="title-row">
                          <span>{profile.name}</span>
                          <span className="pill subtle">{profile.archetype}</span>
                        </div>
                        <p className="muted small">{profile.focus}</p>
                      </div>
                      <p className="muted small">Rituale: {profile.rituals.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid">
          <section className="card flow">
            <div className="section-header">
              <div>
                <p className="eyebrow">Bots</p>
                <h2>Aufträge & Versprechen</h2>
              </div>
            </div>
            <div className="list">
              {blueprint.bots.map((bot) => {
                const botLinks = bot.links.length
                  ? bot.links
                      .map((link) => (link.kind ? `${link.label} (${link.kind})` : link.label))
                      .join(' • ')
                  : '–'

                return (
                  <div key={bot.id} className="list-row">
                    <div>
                      <div className="title-row">
                        <span>{bot.name}</span>
                        <span className="pill subtle">{bot.mode}</span>
                      </div>
                      <p className="muted small">{bot.promise}</p>
                    </div>
                    <p className="muted small">Links: {botLinks}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="card flow">
            <div className="section-header">
              <div>
                <p className="eyebrow">Rituale</p>
                <h2>Checks & Signals</h2>
              </div>
            </div>
            <div className="list">
              {blueprint.rituals.map((ritual) => (
                <div key={ritual.id} className="list-row">
                  <div>
                    <div className="title-row">
                      <span>{ritual.title}</span>
                      <span className="pill subtle">{ritual.cadence}</span>
                    </div>
                    <p className="muted small">{ritual.description}</p>
                  </div>
                  <p className="muted small">Signals: {ritual.signals.join(', ')}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="card flow">
          <div className="section-header">
            <div>
              <p className="eyebrow">Aktionen</p>
              <h2>Nächste Schritte</h2>
            </div>
          </div>
          <div className="list">
            {blueprint.actions.map((action) => (
              <div key={action.id} className="list-row">
                <div>
                  <span>{action.title}</span>
                  <p className="muted small">Impact: {action.impact}</p>
                </div>
                <p className="muted small">Owner: {action.owner}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

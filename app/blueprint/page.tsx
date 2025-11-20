'use client'

import useSWR from 'swr'
import { Blueprint } from '../data/chibot-blueprint'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function BlueprintView() {
  const { data, error } = useSWR<Blueprint>('/api/blueprint', fetcher)

  if (error) return <div className="p-6">Error loading blueprint.</div>
  if (!data) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">CHIBot Blueprint (π⁷)</h1>

      <section>
        <h2 className="text-xl font-semibold">Pages</h2>
        <ul className="space-y-2">
          {data.pages.map((p) => (
            <li key={p.path} className="border p-3 rounded">
              <strong>{p.name}</strong> – {p.status}
              <div className="text-sm opacity-60">{p.focus}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Bots</h2>
        <ul className="space-y-2">
          {data.bots.map((b) => (
            <li key={b.name} className="border p-3 rounded">
              <strong>{b.name}</strong> ({b.mode})
              <div className="text-sm opacity-60">{b.promise}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Rituale</h2>
        <ul className="space-y-2">
          {data.rituals.map((r) => (
            <li key={r.title} className="border p-3 rounded">
              <strong>{r.title}</strong> – {r.cadence}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

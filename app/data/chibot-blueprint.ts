export type Status = 'online' | 'building' | 'blocked'

export interface PageBlueprint {
  name: string
  path: string
  focus: string
  owner: string
  status: Status
}

export interface DataLayer {
  name: string
  source: string
  cadence: string
  retention: string
  status: Status
}

export interface Profile {
  name: string
  archetype: string
  focus: string
  rituals: string[]
}

export interface Bot {
  name: string
  mode: string
  promise: string
  links: string[]
}

export interface Ritual {
  title: string
  cadence: string
  description: string
  signals: string[]
}

export interface ActionItem {
  title: string
  owner: string
  impact: string
}

export interface Blueprint {
  steward: string
  mission: string
  pages: PageBlueprint[]
  dataLayers: DataLayer[]
  profiles: Profile[]
  bots: Bot[]
  rituals: Ritual[]
  actions: ActionItem[]
}

export const blueprint: Blueprint = {
  steward: 'CHIBot',
  mission:
    'Ordnet das YONI-System, hält die Energie fließend und sorgt für klare Verantwortlichkeiten.',
  pages: [
    {
      name: 'Transzendenz Hub',
      path: '/',
      focus: 'Fragen, Antworten, Mehrsprachigkeit, Feed',
      owner: 'CHIBot',
      status: 'online',
    },
    {
      name: 'Profile',
      path: '/profile',
      focus: 'Identitäten, Rollen, Grenzen',
      owner: 'CHIBot',
      status: 'building',
    },
    {
      name: 'Bots',
      path: '/bots',
      focus: 'Persönlichkeiten, Aufträge, Übergaben',
      owner: 'CHIBot',
      status: 'building',
    },
    {
      name: 'Datenfluss',
      path: '/data',
      focus: 'Streams, Speichern, Governance',
      owner: 'CHIBot',
      status: 'online',
    },
    {
      name: 'Rituale',
      path: '/rituale',
      focus: 'Checks, Playbooks, Eskalation',
      owner: 'CHIBot',
      status: 'online',
    },
  ],
  dataLayers: [
    {
      name: 'YONI-Core',
      source: 'Next.js + Tailwind + Vercel Edge',
      cadence: 'live-sync',
      retention: 'Rolling 30 Tage + Backups',
      status: 'online',
    },
    {
      name: 'Ritual-Storage',
      source: 'Static JSON + zukünftige Notion-Spiegelung',
      cadence: 'bei Deploy & auf Abruf',
      retention: 'Versionierte Snapshots',
      status: 'building',
    },
    {
      name: 'Signals',
      source: 'User Prompts + Stripe Events',
      cadence: 'Echtzeit',
      retention: '14 Tage roh, verdichtet danach',
      status: 'online',
    },
  ],
  profiles: [
    {
      name: 'Seherin',
      archetype: 'Visionärin, erkennt Muster',
      focus: 'Synthese, Zukunftslinien, Risiken',
      rituals: ['Weekly Deep Dive', 'Risiko-Heatmap'],
    },
    {
      name: 'Somatic Guide',
      archetype: 'Körperorientiert, hält Raum',
      focus: 'Sicherheit, Pace, Grenzcheck',
      rituals: ['Session Warmup', 'Cooldown Protokoll'],
    },
    {
      name: 'Archivarin',
      archetype: 'Ordnet Wissen',
      focus: 'Dokumentation, Consent, Rechte',
      rituals: ['Release Notes', 'Backup-Review'],
    },
  ],
  bots: [
    {
      name: 'CHIBot',
      mode: 'Steward',
      promise: 'Hält Struktur, priorisiert Sicherheit, verteilt Aufgaben klar.',
      links: ['System Blueprint', 'Onboarding Script'],
    },
    {
      name: 'Contrast-Bot',
      mode: 'Gegensätze',
      promise: 'Bringt andere Sicht, challengt Annahmen, liefert Optionen.',
      links: ['Decision-Canvas'],
    },
    {
      name: 'Somatic-Bot',
      mode: 'Safety',
      promise: 'Checkt Pace, Grenzen und Nervensystem-Signale.',
      links: ['Safety-Checklist'],
    },
  ],
  rituals: [
    {
      title: 'System Reset',
      cadence: 'Montag 10:00',
      description: 'Cache leeren, Deploy-Status prüfen, Domains verifizieren.',
      signals: ['Status grün', 'OpenAI Key validiert', 'Domains in Sync'],
    },
    {
      title: 'Transzendenz Sync',
      cadence: 'Täglich 17:00',
      description: 'Feed prüfen, Kontraste sammeln, nächste Fragen kuratieren.',
      signals: ['Neue Fragen markiert', 'Kontraste dokumentiert'],
    },
    {
      title: 'Release Note Drop',
      cadence: 'Freitag 15:00',
      description: 'Changelog, Sicherheitscheck, Consent-Log aktualisieren.',
      signals: ['Changelog publiziert', 'Consent-Logs signiert'],
    },
  ],
  actions: [
    {
      title: 'Domains Setup vervollständigen',
      owner: 'CHIBot',
      impact: 'Sichere Auslieferung & Offline-Modus stabil',
    },
    {
      title: 'Profile-Seite booten',
      owner: 'Seherin',
      impact: 'Klare Rollen & Grenzen sichtbar',
    },
    {
      title: 'Ritual-Storage anbinden',
      owner: 'Archivarin',
      impact: 'Nachvollziehbarkeit & Backups gewährleistet',
    },
  ],
}

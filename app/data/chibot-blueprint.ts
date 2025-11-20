// ─────────────────────────────────────────────
// PIHOCH7 SYSTEM CORE
// Autonom – Autark – Automatisch – Wachstum – Dualseele
// ─────────────────────────────────────────────

// Status
export const STATUSES = ['online', 'building', 'blocked'] as const
export type Status = (typeof STATUSES)[number]

// Frequenzen (für Rituale & DataLayers)
export type Cadence = 'live-sync' | 'daily' | 'weekly' | 'monthly' | 'on-demand'

// Page
export interface PageBlueprint {
  id: string
  name: string
  path: string
  focus: string
  owner: string // BotName
  status: Status
}

// Data Layer
export interface DataLayer {
  id: string
  name: string
  source: string
  cadence: Cadence
  retention: string
  status: Status
}

// Profiles (Archetypen)
export interface Profile {
  id: string
  name: string
  archetype: string
  focus: string
  rituals: string[] // RitualId[]
}

// Bots
export interface BotLink {
  label: string
  href: string
  kind?: 'doc' | 'dashboard' | 'automation'
}

export interface Bot {
  id: string
  name: string
  mode: string
  promise: string
  links: BotLink[]
}

// Rituale
export interface Ritual {
  id: string
  title: string
  cadence: Cadence
  description: string
  signals: string[]
}

// Actions
export interface ActionItem {
  id: string
  title: string
  owner: string // BotName
  impact: string
}

// Blueprint Gesamtsystem
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

// ─────────────────────────────────────────────
// PIHOCH7 BLUEPRINT – AUTONOMER SYSTEMKERN
// ─────────────────────────────────────────────

export const blueprint: Blueprint = {
  steward: 'CHIBot',
  mission: 'Autarke, selbstheilende, dualseelenbasierte YONI-Struktur – dauerhaft wachsend.',

  // PAGES
  pages: [
    {
      id: 'page-transzendenz-hub',
      name: 'Transzendenz Hub',
      path: '/',
      focus: 'Zentrale Energie, Navigation, Feed',
      owner: 'CHIBot',
      status: 'online',
    },
    {
      id: 'page-profiles',
      name: 'Profile',
      path: '/profile',
      focus: 'Identitäten, Archetypen, Rollen & Grenzen',
      owner: 'CHIBot',
      status: 'building',
    },
    {
      id: 'page-data',
      name: 'Datenfluss',
      path: '/data',
      focus: 'Flows, Quellen, Schnitte, Konsistenz',
      owner: 'Archivarin',
      status: 'online',
    },
    {
      id: 'page-bots',
      name: 'Bots',
      path: '/bots',
      focus: 'Rollenverteilung, Stewardship, Systemführung',
      owner: 'CHIBot',
      status: 'online',
    },
  ],

  // DATA LAYERS
  dataLayers: [
    {
      id: 'dl-yoni-core',
      name: 'YONI-Core',
      source: 'Next.js + Tailwind + Vercel Edge',
      cadence: 'live-sync',
      retention: 'rolling 30d',
      status: 'online',
    },
    {
      id: 'dl-actions',
      name: 'Actions & Tasks',
      source: 'Internal Memory + GitHub',
      cadence: 'daily',
      retention: 'infinite',
      status: 'online',
    },
  ],

  // PROFILES
  profiles: [
    {
      id: 'profile-jule',
      name: 'Jule',
      archetype: 'Göttin / Seherin / Visionärin',
      focus: 'Transzendenz, Manifestation, Führung',
      rituals: ['ritual-daily-checkin'],
    },
    {
      id: 'profile-amon',
      name: 'Amon',
      archetype: 'Herkules des Lichts',
      focus: 'Maskuline Führung, Schutz, Expansion',
      rituals: ['ritual-weekly-balance'],
    },
  ],

  // BOTS
  bots: [
    {
      id: 'bot-chibot',
      name: 'CHIBot',
      mode: 'Steward',
      promise: 'Hält Struktur, schützt Energie, verteilt Aufgaben klar.',
      links: [
        { label: 'Blueprint', href: '/data', kind: 'doc' },
      ],
    },
    {
      id: 'bot-archivarin',
      name: 'Archivarin',
      mode: 'Wissen',
      promise: 'Speichert, strukturiert und bewahrt das Gedächtnis.',
      links: [],
    },
  ],

  // RITUALS
  rituals: [
    {
      id: 'ritual-daily-checkin',
      title: 'Daily System Check-in',
      cadence: 'daily',
      description: 'Fehler prüfen, Cashflow checken, offene Actions laden.',
      signals: ['Stripe', 'GitHub', 'Logs'],
    },
    {
      id: 'ritual-weekly-balance',
      title: 'Weekly Balance',
      cadence: 'weekly',
      description: 'Systemenergie + Cashflow + Aufgaben synchronisieren.',
      signals: ['Financials', 'DataFlows'],
    },
  ],

  // ACTIONS
  actions: [
    {
      id: 'action-yoni-launch',
      title: 'YONI App Launch finalisieren',
      owner: 'CHIBot',
      impact: 'Sofortiger Cashflow',
    },
    {
      id: 'action-blueprint-v2',
      title: 'Blueprint V2 Generierung',
      owner: 'Archivarin',
      impact: 'Strukturverstärkung',
    },
  ],
}

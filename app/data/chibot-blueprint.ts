import { blueprint as blueprintData } from './chibot-blueprint.js'

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

export const blueprint: Blueprint = blueprintData

export interface Player {
  id: number
  name: string
  rank?: number
  yes?: boolean
  gk?: boolean
}

export interface Config {
  leagueName?: string
  teamCount: number
}

export interface Data {
  config: Config
  players: Player[]
  snapshot: Snapshot
}

export interface League {
  createdAt: Date
  hash: string
  data: any
}

export interface Snapshot {
  teams?: any
  methodology?: string[]
}

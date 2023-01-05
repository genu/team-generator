export interface Player {
  name: string
  rank?: number
  enabled?: boolean
}

export interface Config {
  league?: string
  teams: number
}

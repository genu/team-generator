export interface Player {
  id: number
  name: string
  rank?: number
  enabled?: boolean
}

export interface Config {
  league?: string
  teams: number
}

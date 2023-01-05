export interface Player {
  id: number
  name: string
  rank?: number
  yes?: boolean
}

export interface Config {
  leagueName?: string
  teamCount: number
}

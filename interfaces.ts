export interface LegacyPlayer {
  id: number
  name: string
  rank?: number
  yes?: boolean
  gk?: boolean
}

export interface Rules {
  goaliesFirst?: boolean
  noBestGolieAndPlayer?: boolean
  keepGoalies?: boolean
  stefanMode?: boolean
  beniMode?: boolean
}

export interface Config {
  leagueName: string
  teamCount: number
  rules: Rules
}

export interface Data {
  config: Config
  players: LegacyPlayer[]
}

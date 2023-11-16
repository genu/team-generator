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

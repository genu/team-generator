import { useRegle, type InferRegleRoot } from '@regle/core'
import { required } from '@regle/rules'

export type LeagueEditForm$ = InferRegleRoot<typeof useLeagueEditForm>

export interface LeagueEditForm {
  id?: number
  options: {
    name: string
    teamCount: number
    rules: {
      goaliesFirst?: boolean
      noBestGolieAndPlayer?: boolean
      keepGoalies?: boolean
      beniMode?: boolean
    }
  }
  players: EditPlayerForm[]
}

export const useLeagueEditForm = () => {
  const form: LeagueEditForm = {
    options: {
      name: '',
      teamCount: 2,
      rules: {},
    },
    players: [],
  }

  return useRegle(form, {
    options: {
      name: { required },
    },
    players: {
      $each: {
        name: {
          required,
        },
      },
    },
  })
}

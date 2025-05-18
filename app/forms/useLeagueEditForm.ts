import { useRegle, type InferRegleRoot } from '@regle/core'
import { and, minLength, required, requiredIf } from '@regle/rules'

export type LeagueEditForm$ = InferRegleRoot<typeof useLeagueEditForm>

export interface LeagueEditForm {
  id?: number
  options: {
    name: string
    teamCount: number
    useTeamColors?: boolean
    teamColors: ShirtColorEnum[]
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
  const form = ref<LeagueEditForm>({ options: { name: '', teamCount: 2, rules: {}, teamColors: [] }, players: [] })

  return useRegle(form, () => ({
    options: {
      name: { required },
      teamColors: {
        conditionalRequire: withMessage(
          and(
            requiredIf(() => form.value.options.useTeamColors),
            minLength(1),
          ),
          'Team colors are required',
        ),
      },
    },
    players: {
      $each: {
        name: {
          required,
        },
      },
    },
  }))
}

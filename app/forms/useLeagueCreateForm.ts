import { useRegle } from '@regle/core'
import { required } from '@regle/rules'

export interface CreateLeagueForm {
  name: string
}

export const useLeagueCreateForm = () => {
  return useRegle({} as CreateLeagueForm, {
    name: {
      required: withMessage(required, 'League name is required'),
    },
  })
}

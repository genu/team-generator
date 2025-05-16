import { useRegle } from '@regle/core'
import { required } from '@regle/rules'

export interface CreateLeagueForm {
  name: string
}

export const useLeagueCreateForm = () => {
  const form: CreateLeagueForm = {
    name: '',
  }

  return useRegle(form, {
    name: {
      required: withMessage(required, 'League name is required'),
    },
  })
}

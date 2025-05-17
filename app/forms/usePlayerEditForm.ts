import { useRegle } from '@regle/core'
import { required } from '@regle/rules'

export interface EditPlayerForm {
  id?: number
  name: string
  rank: number
  isActive: boolean
  isGoalie: boolean
}

export const usePlayerEditForm = () => {
  return useRegle({} as EditPlayerForm, {
    name: {
      required,
    },
  })
}

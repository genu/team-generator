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
  const form: EditPlayerForm = {
    name: '',
    rank: 1,
    isActive: true,
    isGoalie: false,
  }

  return useRegle(form, {
    name: {
      required,
    },
  })
}

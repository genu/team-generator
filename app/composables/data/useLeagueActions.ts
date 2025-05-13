import { useMutation, useQueryClient } from '@tanstack/vue-query'

export const useLeagueActions = () => {
  const queryClient = useQueryClient()

  const duplicate = () => {
    return useMutation({
      mutationFn: async (leagueId: number) => {
        const res = await $fetch('/api/account/league/duplicate', {
          method: 'POST',
          body: { id: leagueId },
        })

        return res
      },
      onSuccess: ({ account }) => {
        queryClient.invalidateQueries({ queryKey: ['zenstack', 'Account'] })
      },
    })
  }

  return { duplicate }
}

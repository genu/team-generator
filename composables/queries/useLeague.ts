import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { League } from '@prisma/client'

export const useLeague = () => {
  const queryClient = useQueryClient()

  const get = (league?: number) => {
    return useQuery({
      queryKey: ['league', league],
      enabled: !!league,
      queryFn: async () => {
        const data = await $fetch('/api/account/league', {
          query: { league },
        })

        return data
      },
    })
  }

  const create = () => {
    return useMutation({
      mutationFn: async (league: Partial<League>) => {
        const res = await $fetch('/api/account/league/', {
          method: 'POST',
          body: league,
        })

        return res
      },
      onSuccess: ({ account }) => {
        queryClient.invalidateQueries({ queryKey: ['account', account?.hash] })
      },
    })
  }

  const del = () => {
    return useMutation({
      mutationFn: async (leagueId: number) => {
        const res = await $fetch('/api/account/league/:id', {
          method: 'DELETE',
          params: { id: leagueId },
        })

        return res
      },
      onSuccess: ({ account }) => {
        queryClient.invalidateQueries({ queryKey: ['account', account?.hash] })
      },
    })
  }

  return { get, create, del }
}

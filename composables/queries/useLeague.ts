import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { League, Player, Snapshot } from '@prisma/client'

export const useLeague = () => {
  const queryClient = useQueryClient()

  const get = (id: Ref<number | undefined>) => {
    return useQuery({
      queryKey: ['league', id] as const,
      enabled: () => !!id.value,
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey

        const data = await $fetch<League & { players: Player[]; defaultSnapshot: Snapshot }>('/api/account/league', {
          query: { leagueId: id },
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

  const update = () => {
    return useMutation({
      mutationFn: async ({ id, updatedLeague }: { id: number; updatedLeague: any }) => {
        const res = await $fetch('/api/account/league/:id/', {
          method: 'put',
          body: { id, updatedLeague },
        })

        return res
      },
      onSuccess: ({ id, account }) => {
        queryClient.invalidateQueries({ queryKey: ['league', id] })
        queryClient.invalidateQueries({ queryKey: ['account', account?.hash] })
      },
    })
  }

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
        queryClient.invalidateQueries({ queryKey: ['account', account?.hash] })
      },
    })
  }

  const del = () => {
    return useMutation({
      mutationFn: async (leagueId: number) => {
        const res = await $fetch('/api/account/league/:id/', {
          method: 'DELETE',
          params: { id: leagueId },
        })

        return res
      },
      onSuccess: ({ account, id }) => {
        queryClient.invalidateQueries({ queryKey: ['account', account?.hash] })
        queryClient.removeQueries({ queryKey: ['league', id] })
      },
    })
  }

  return { get, create, del, duplicate, update }
}

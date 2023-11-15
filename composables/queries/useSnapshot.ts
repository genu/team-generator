import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { League, Player } from '@prisma/client'

export const useSnapshot = () => {
  const queryClient = useQueryClient()

  const list = (leagueId: number) => {
    return useQuery({
      queryKey: ['league', leagueId, 'snapshots'],
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey

        const data = await $fetch('/api/account/league/:id/snapshot/', {
          method: 'GET',
          query: { leagueId: id },
        })

        return data
      },
    })
  }

  const latest = (leagueId: number) => {
    return useQuery({
      queryKey: ['league', leagueId, 'latest-snapshot'] as const,
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey

        const data = await $fetch(`/api/account/league/${leagueId}/snapshot/latest`, {})

        return data
      },
    })
  }

  const get = (id: Ref<number | undefined>) => {
    return useQuery({
      queryKey: ['league', id] as const,
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey

        const data = await $fetch<League & { players: Player[] }>('/api/account/league', {
          query: { leagueId: id },
        })

        return data
      },
    })
  }

  const create = () => {
    return useMutation({
      mutationFn: async ({ leagueId, snapshot }: { leagueId: number; snapshot: any }) => {
        const res = await $fetch('/api/account/league/:id/snapshot/', {
          method: 'POST',
          body: snapshot,
          query: { leagueId },
        })

        return res
      },
      onSuccess: ({ leagueId }) => {
        queryClient.invalidateQueries({ queryKey: ['league', leagueId, 'snapshots'] })
      },
    })
  }

  const update = () => {
    return useMutation({
      mutationFn: async ({ leagueId, snapshot }: { leagueId: number; snapshot: any }) => {
        const res = await $fetch('/api/account/league/:id/snapshot/', {
          method: 'PUT',
          body: snapshot,
          query: { leagueId },
        })

        return res
      },
      // onSuccess: ({ account }) => {
      //   queryClient.invalidateQueries({ queryKey: ['account', account?.hash] })
      // },
    })
  }

  return { get, create, list, update, latest }
}

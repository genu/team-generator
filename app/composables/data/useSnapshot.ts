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

        const data = await $fetch(`/api/account/league/${leagueId}/snapshot/latest`)

        return data || null
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
      mutationFn: async ({ leagueId, snapshotData }: { leagueId: number; snapshotData: any }) => {
        const res = await $fetch('/api/account/league/:id/snapshot/', {
          method: 'POST',
          body: snapshotData,
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
      mutationFn: async ({ snapshotId, snapshotData }: { snapshotId: number; snapshotData: any }) => {
        const res = await $fetch('/api/account/league/:id/snapshot/:id', {
          method: 'PUT',
          body: snapshotData,
          query: { snapshotId },
        })

        return res
      },
      onSuccess: ({ league }) => {
        queryClient.invalidateQueries({ queryKey: ['league', league.id] })
      },
    })
  }

  return { get, create, list, update, latest }
}

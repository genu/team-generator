import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { League } from '@prisma/client'

export const useLeague = () => {
  const queryClient = useQueryClient()

  const list = (hash: string) => {
    return useQuery({
      queryKey: ['account', hash],
      queryFn: async () => {
        const { data } = await useFetch('/api/account/', {
          query: { hash },
        })

        return data.value
      },
    })
  }

  const get = (league?: number) => {
    return useQuery({
      queryKey: ['league', league],
      enabled: !!league,
      queryFn: async () => {
        console.log('fetching league', league)
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
        const { data } = await useFetch('/api/account/league', {
          method: 'POST',
          body: league,
        })

        return data.value!
      },
      onSuccess: ({ account }) => {
        queryClient.invalidateQueries({ queryKey: ['account', account?.hash] })
      },
    })
  }

  return { get, create }
}

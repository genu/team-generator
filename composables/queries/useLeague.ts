import { useQuery } from '@tanstack/vue-query'

export const useLeague = () => {
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

  return { get }
}

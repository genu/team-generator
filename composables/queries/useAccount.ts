import {useQuery } from '@tanstack/vue-query'

export const useAccount = () => {
  const get = (hash: string) => {
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

  return { get }
}

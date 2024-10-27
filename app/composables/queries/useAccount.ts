import { useQuery, useMutation } from '@tanstack/vue-query'

export const useAccount = () => {
  const get = (hash: string) => {
    return useQuery({
      queryKey: ['account', hash],
      queryFn: async () => {
        const { data } = await useFetch('/api/account', {
          query: { hash },
        })

        return data.value
      },
    })
  }

  const create = () => {
    return useMutation({
      mutationFn: async () => {
        const res = await $fetch('/api/account/', {
          method: 'POST',
        })

        return res
      },
    })
  }

  return { get, create }
}

export const useAccount = (hash: Ref<string>) => {
  const { data } = useFindUniqueAccount(
    computed(() => ({
      where: {
        hash: hash.value,
      },
    })),
  )

  return { data }
}

export const useMethodology = () => {
  const methodology = ref<string[]>([])

  const write = (value: string) => {
    methodology.value = [...methodology.value, value]
  }

  const initialize = (value: string[]) => {
    methodology.value = value
  }

  const reset = () => {
    methodology.value = []
  }

  return { write, methodology, initialize, reset }
}

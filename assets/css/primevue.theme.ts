import { usePassThrough } from 'primevue/passthrough'
import Tailwind from 'primevue/passthrough/tailwind'
import type { PrimeVuePTOptions } from 'primevue/config'

const CustomTheme: PrimeVuePTOptions = {}

export const PrimevueTheme = usePassThrough(Tailwind, CustomTheme, {
  mergeProps: true,
  mergeSections: true,
})

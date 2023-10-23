import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { PrimevueTheme } from '~/assets/css/primevue.theme'
import type { PrimeVueConfiguration } from 'primevue/config'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use<PrimeVueConfiguration>(PrimeVue, {
    unstyled: true,
    pt: PrimevueTheme,
    ripple: true,
  })
  nuxtApp.vueApp.use(ToastService)
})

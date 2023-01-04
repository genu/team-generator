import PrimeVue from 'primevue/config'
import Toast from 'primevue/toast'
import Skeleton from 'primevue/skeleton'
import ToastService from 'primevue/toastservice'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Tooltip from 'primevue/tooltip'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Divider from 'primevue/divider'
import InputSwitch from 'primevue/inputswitch'

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.use(PrimeVue)
  nuxt.vueApp.use(ToastService)

  // Directives
  nuxt.vueApp.directive('tooltip', Tooltip)

  // Components
  nuxt.vueApp.component('Accordion', Accordion)
  nuxt.vueApp.component('AccordionTab', AccordionTab)
  nuxt.vueApp.component('Toast', Toast)
  nuxt.vueApp.component('Skeleton', Skeleton)
  nuxt.vueApp.component('InputText', InputText)
  nuxt.vueApp.component('InputNumber', InputNumber)
  nuxt.vueApp.component('Divider', Divider)
  nuxt.vueApp.component('InputSwitch', InputSwitch)
})

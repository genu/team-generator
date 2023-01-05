import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faMagnifyingGlass,
  faEyeSlash,
  faEye,
  faMinus,
  faPlus,
  faTimes,
} from '@fortawesome/pro-solid-svg-icons'

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

library.add(faMagnifyingGlass, faEye, faEyeSlash, faMinus, faPlus, faTimes)

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.component('FaIcon', FontAwesomeIcon)
})

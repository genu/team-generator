import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faPlus,
  faTimes,
  faAngleDown,
  faAngleUp,
  faShare,
  faDownload,
} from '@fortawesome/free-solid-svg-icons'

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

library.add(faPlus, faTimes, faAngleDown, faAngleUp, faShare, faDownload)

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.component('FaIcon', FontAwesomeIcon)
})

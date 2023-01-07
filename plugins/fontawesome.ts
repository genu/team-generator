import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faPlus,
  faTimes,
  faAngleDown,
  faAngleUp,
  faDownload,
  faArrowsSpin,
  faArrowUpFromBracket,
} from '@fortawesome/free-solid-svg-icons'

import { faClipboard } from '@fortawesome/free-regular-svg-icons'

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

library.add(
  faPlus,
  faTimes,
  faAngleDown,
  faAngleUp,
  faDownload,
  faClipboard,
  faArrowsSpin,
  faArrowUpFromBracket
)

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.component('FaIcon', FontAwesomeIcon)
})

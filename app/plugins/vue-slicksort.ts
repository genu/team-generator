import { plugin } from "vue-slicksort"

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.use(plugin)
})

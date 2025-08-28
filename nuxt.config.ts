import { fileURLToPath } from "url"

export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/eslint", "@vueuse/nuxt", "@nuxt/test-utils/module", "@pinia/colada-nuxt", "@pinia/nuxt"],
  imports: {
    dirs: ["../.generated/vue-query", "./composables/data", "./.generated/zod"],
  },
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "light",
  },
  ui: {
    theme: {
      colors: ["primary", "secondary", "tertiary", "info", "success", "warning", "error"],
    },
  },
  runtimeConfig: {
    public: {
      logrocketAppId: "",
      site: {
        url: "",
      },
    },
  },
  alias: {
    "#generated": fileURLToPath(new URL("./.generated", import.meta.url)),
  },
  compatibilityDate: "2024-10-26",
  nitro: {
    imports: {
      dirs: ["./server/helpers", "./server/services", "./.generated/zod"],
    },
  },
  typescript: {
    typeCheck: process.env.NODE_ENV === "production",
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})

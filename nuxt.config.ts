import { resolve } from "pathe"

export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/eslint", "@vueuse/nuxt", "@nuxt/test-utils/module", "@pinia/colada-nuxt", "@pinia/nuxt"],
  imports: {
    dirs: ["./queries"],
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
      site: {
        url: "",
      },
    },
  },
  alias: {
    "#generated": resolve("./.generated/"),
  },
  compatibilityDate: "2024-10-26",
  nitro: {
    imports: {
      dirs: ["./server/helpers", "./server/services"],
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

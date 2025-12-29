import { resolve } from "pathe"

export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "@nuxt/test-utils/module",
    "@pinia/colada-nuxt",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
    "@nuxt/image",
    "nuxt-ui-formwerk",
  ],
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "light",
  },
  ui: {
    theme: {
      colors: ["primary", "secondary", "tertiary", "info", "success", "warning", "error"],
    },
  },
  alias: {
    "#generated": resolve("./.generated/"),
  },
  routeRules: {
    "/": { prerender: true },
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
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Team Generator",
      short_name: "Team Generator",
      description: "Generate balanced teams for your games quickly and easily.",
      theme_color: "#2563EB",
      start_url: ".",
    },
    pwaAssets: {
      image: "public/soccer-ball.png",
    },
  },
})

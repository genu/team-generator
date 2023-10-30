export default defineNuxtConfig({
  modules: ['@nuxtjs/google-fonts', '@vueuse/nuxt', '@nuxt/ui'],
  runtimeConfig: {
    public: {
      logrocketAppId: '',
    },
  },
  appConfig: {
    umami: {
      ignoreLocalhost: true,
    },
  },
  app: {
    head: {
      htmlAttrs: { class: 'bg-gray-100' },
    },
  },
  /**
   * Module configurations
   **/
  googleFonts: {
    families: {
      Inter: {
        wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
    },
  },
  tailwindcss: {
    configPath: '~/config/tailwind.config.ts',
  },
  ui: {
    global: true,
    icons: 'all',
  },
})

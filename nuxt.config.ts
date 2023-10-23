// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['nuxt-umami'],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', '@vueuse/nuxt', 'nuxt-icon'],
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
  build: {
    transpile: ['primevue'],
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
      Inter: true,
    },
  },
  tailwindcss: {
    configPath: '~/config/tailwind.config.ts',
  },
})

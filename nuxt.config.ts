// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    shim: false,
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', '@vueuse/nuxt'],
  runtimeConfig: {
    public: {
      logrocketAppId: '',
    },
  },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    'primevue/resources/themes/lara-light-blue/theme.css',
    'primevue/resources/primevue.min.css',
    'primeicons/primeicons.css',
  ],
  build: {
    transpile: [
      'primevue',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/vue-fontawesome',
      '@fortawesome/pro-regular-svg-icons',
      '@fortawesome/pro-solid-svg-icons',
    ],
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

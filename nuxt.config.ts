// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    shim: false,
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', '@vueuse/nuxt'],
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    'primevue/resources/themes/lara-light-blue/theme.css',
    'primevue/resources/primevue.min.css',
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

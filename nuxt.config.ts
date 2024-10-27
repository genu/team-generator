export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-10-26',
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@floatie/widget-nuxt',
    '@hebilicious/vue-query-nuxt',
    '@vue-final-modal/nuxt',
    '@vee-validate/nuxt',
  ],
  typescript: {
    typeCheck: process.env.NODE_ENV === 'production',
  },
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
  imports: {
    dirs: ['./composables/queries'],
  },
  /**
   * Module configurations
   **/

  colorMode: {
    preference: 'light',
  },
  // tailwindcss: {
  //   configPath: './config/tailwind.config.ts',
  // },

  // floatie: {
  //   clientKey: process.env.NUXT_PUBLIC_FLOATIE_CLIENT_KEY,
  // },
})

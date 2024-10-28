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
      site: {
        url: '',
      },
    },
  },
  appConfig: {
    umami: {
      ignoreLocalhost: true,
    },
  },
  imports: {
    dirs: ['../.generated/vue-query', './composables/data'],
  },
  /**
   * Module configurations
   **/

  colorMode: {
    preference: 'light',
  },
  vueQuery: {
    vueQueryPluginOptions: {
      enableDevtoolsV6Plugin: true,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 300000, // 5 minutes
          },
        },
      },
    },
  },

  // floatie: {
  //   clientKey: process.env.NUXT_PUBLIC_FLOATIE_CLIENT_KEY,
  // },
})

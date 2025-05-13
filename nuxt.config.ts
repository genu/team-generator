export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint', '@vueuse/nuxt', '@hebilicious/vue-query-nuxt'],
  imports: {
    dirs: ['../.generated/vue-query', './composables/data'],
  },
  css: ['~/assets/css/main.css'],
  /**
   * Module configurations
   **/

  colorMode: {
    preference: 'light',
  },
  runtimeConfig: {
    public: {
      logrocketAppId: '',
      site: {
        url: '',
      },
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-10-26',
  typescript: {
    typeCheck: process.env.NODE_ENV === 'production',
  },
  eslint: {
    config: {
      stylistic: true,
    },
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
})

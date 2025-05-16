export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint', '@vueuse/nuxt', '@hebilicious/vue-query-nuxt', '@regle/nuxt'],
  imports: {
    dirs: ['../.generated/vue-query', './composables/data', './.generated/zod', './forms'],
  },
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light',
  },
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'],
    },
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
  nitro: {
    imports: {
      dirs: ['./server/helpers', './server/social-clients', './server/services', './server/flows', './.generated/zod'],
    },
  },
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

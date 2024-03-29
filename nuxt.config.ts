export default defineNuxtConfig({
  modules: ['@nuxtjs/google-fonts', '@vueuse/nuxt', '@nuxt/ui', '@floatie/widget-nuxt', '@formkit/nuxt'],
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
    dirs: ['./composables/queries', './enum'],
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
    icons: ['ph'],
  },
  colorMode: {
    preference: 'light',
  },
  floatie: {
    clientKey: process.env.NUXT_PUBLIC_FLOATIE_CLIENT_KEY,
  },
  formkit: {
    autoImport: true,
    configFile: './config/formkit.config.ts',
  },
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['nuxt-umami'],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', '@vueuse/nuxt', 'nuxt-icon', 'nuxt-primevue'],
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
  primevue: {
    usePrimeVue: false,
    directives: {
      include: ['Tooltip'],
    },
    components: {
      include: [
        'Checkbox',
        'Divider',
        'InputText',
        'DataTable',
        'Column',
        'Menu',
        'InputSwitch',
        'Button',
        'InputNumber',
        'ConfirmDialog',
      ],
    },
  },
})

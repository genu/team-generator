export default defineNuxtConfig({
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
  css: ['primevue/resources/themes/lara-light-indigo/theme.css'],
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
    usePrimeVue: true,
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

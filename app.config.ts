export default defineAppConfig({
  nuxtIcon: {},
  ui: {
    checkbox: {
      base: 'h-6 w-6',
      default: {
        color: 'indigo',
      },
    },
    input: {
      default: {
        size: 'xl',
      },
    },
    button: {
      default: {
        size: 'md',
      },
    },
    table: {
      th: {
        padding: 'p-1',
      },
      td: {
        padding: 'p-1',
        base: 'text-center',
      },
    },
    toggle: {
      default: {
        size: 'xl',
      },
    },
    notification: {
      progress: {
        base: 'hidden',
      },
    },
  },
})

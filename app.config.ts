export default defineAppConfig({
  ui: {
    checkbox: {
      base: 'h-6 w-6',
      default: {
        color: 'indigo',
      },
    },
    input: {
      default: {
        size: 'md',
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
      base: 'h-7 w-12',
      container: {
        base: 'h-6 w-6',
        active: 'translate-x-5 rtl:-translate-x-5',
      },
    },
  },
})

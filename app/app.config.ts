export default defineAppConfig({
  ui: {
    colors: {
      tertiary: "indigo",
    },
    formField: {
      slots: {
        root: "w-full",
      },
    },
    input: {
      defaultVariants: {
        size: "xl",
      },
      slots: {
        root: "w-full",
      },
    },
    button: {
      defaultVariants: {
        size: "md",
      },
    },
  },
})

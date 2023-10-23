import { Config } from 'tailwindcss'
import defaultColors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  important: true,
  content: [],
  theme: {
    extend: {
      colors: {
        primary: defaultColors.blue['600'],
        secondary: defaultColors.blue['100'],
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}

export default config

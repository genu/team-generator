import { Config } from 'tailwindcss'
import defaultColors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'
import TypographyPlugin from '@tailwindcss/typography'
import FormsPlugin from '@tailwindcss/forms'

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
  plugins: [TypographyPlugin, FormsPlugin],
}

export default config

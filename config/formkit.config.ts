import { defineFormKitConfig } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'

export default defineFormKitConfig({
  theme: 'genesis',
  config: {
    classes: generateClasses({
      text: {
        wrapper: '!max-w-full',
      },
    }),
  },
})

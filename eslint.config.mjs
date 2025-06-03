import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt(
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/no-namespace": ["off"],

      // Stylistic
      "@stylistic/quotes": "off",
      "@stylistic/brace-style": "off",
      "@stylistic/arrow-parens": "off",
      "@stylistic/member-delimiter-style": "off",
      "@stylistic/operator-linebreak": "off",
      "@stylistic/indent": "off",
      "@stylistic/quote-props": "off",

      // Vue
      "vue/max-attributes-per-line": ["error", { singleline: 5 }],
      "vue/space-infix-ops": ["error"],
      "vue/multi-word-component-names": "off",
      "vue/html-closing-bracket-newline": [
        "error",
        {
          singleline: "never",
          multiline: "always",
          selfClosingTag: {
            singleline: "never",
            multiline: "never",
          },
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
)

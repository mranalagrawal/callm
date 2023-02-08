process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  extends: ['@antfu'],
  rules: {
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
    'func-call-spacing': ['error', 'never'],
    'no-tabs': 0,
    'max-len': [
      'error',
      {
        code: 180,
        tabWidth: 2,
        comments: 180,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'import/first': 'off',
    'camelcase': 0,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    /* VUE ESLINT RULES */
    'vue/no-v-text-v-html-on-component': 'warn',
    'vue/script-setup-uses-vars': 'error',
    'vue/valid-template-root': 0,
    'vue/no-multiple-template-root': 0,
    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/multi-word-component-names': ['error', {
      ignores: ['404', 'index', 'cart', 'preview', 'login', 'profile', 'wishlist', 'addresses'],
    }],
    // Note: We can change this to "camelCase" when upgrading to Vue3 https://eslint.vuejs.org/rules/custom-event-name-casing.html
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    /* TYPESCRIPT ESLINT RULES */
    '@typescript-eslint/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  },
}

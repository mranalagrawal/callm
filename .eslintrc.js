module.exports = {
  extends: ['@antfu'],
  rules: {
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
    'func-call-spacing': ['error', 'never'],
    'no-tabs': 0,
    'max-len': [
      'warn',
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
    'vue/no-v-for-template-key': 'error',
    'vue/no-v-for-template-key-on-child': 'off',
    'vue/no-v-text-v-html-on-component': 'warn',
    /* NOTE: Switching this off for now till we migrate to Nuxt 3 */
    'vue/no-deprecated-v-on-native-modifier': 'off',
    'vue/script-setup-uses-vars': 'error',
    'vue/valid-template-root': 0,
    'vue/no-multiple-template-root': 0,
    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/multi-word-component-names': ['warn', {
      ignores: [
        'Navbar',
        '_handle',
        'addresses',
        'billing',
        'callback',
        'cart',
        'catalog',
        'categories',
        'contact',
        'default',
        'error',
        'error404',
        'error410',
        'index',
        'login',
        'preview',
        'profile',
        'recover',
        'search',
        'shipping',
        'sustainability',
        'waiting-for-confirmation',
        'wishlist',
      ],
    }],
    // Note: We can change this to "camelCase" when upgrading to Vue3 https://eslint.vuejs.org/rules/custom-event-name-casing.html
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    /* ANTFU ESLINT RULES */
    'antfu/top-level-function': 'off',
    /* TYPESCRIPT ESLINT RULES */
    '@typescript-eslint/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  },
}

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
    'camelcase': 0,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'import/no-unresolved': 'error', // TODO: make it error
    'import/order': [
      'warn',
      {
        'groups': [
          ['builtin', 'external'],
          'internal',
          ['sibling', 'parent'],
          'index',
        ],
        'newlines-between': 'always',
        'distinctGroup': true,
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
        'pathGroups': [
          {
            pattern: 'vue',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '~/store/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '~/assets/**',
            group: 'internal',
            position: 'before',
          },
        ],
        'pathGroupsExcludedImportTypes': ['vue'],
      },
    ],
    /* VUE RULES */
    'vue/no-v-for-template-key': 'error',
    'vue/no-v-for-template-key-on-child': 'off',
    'vue/no-v-text-v-html-on-component': 'warn',
    /* NOTE: Switching this off for now till we migrate to Nuxt 3 */
    'vue/no-deprecated-v-on-native-modifier': 'off',
    'vue/script-setup-uses-vars': 'error',
    'vue/valid-template-root': 0,
    'vue/no-multiple-template-root': 0,
    'vue/component-tags-order': ['error', { order: ['script', 'template', 'style'] }],
    'vue/multi-word-component-names': ['error', {
      ignores: [
        'Error404',
        'Error410',
        'Navbar',
      ],
    }],
    // Note: We can change this to "camelCase" when upgrading to Vue3 https://eslint.vuejs.org/rules/custom-event-name-casing.html
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    /* ANTFU OVERIDE RULES */
    'antfu/top-level-function': 'off',
    'curly': ['error', 'multi-line', 'consistent'],
    'max-statements-per-line': ['error', { max: 3 }],
    'max-depth': ['error', 5],
    /* TYPESCRIPT RULES */
    '@typescript-eslint/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  },
  overrides: [
    {
      files: ['pages/**/*.vue', 'layouts/**/*.vue'],
      rules: {
        // Disable the rule for components inside the pages and layouts directories
        'vue/multi-word-component-names': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      nuxt: {
        extensions: ['.js', '.vue', '.ts', '.d.ts', '.graphql', '.svg'],
      },
    },
  },
  // Ignore the following files (.svg, .graphql) from being linted
  ignorePatterns: ['**/*.svg', '**/*.graphql'],
}

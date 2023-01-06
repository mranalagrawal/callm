import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'
import plugin from 'windicss/plugin'

export default defineConfig({
  // Note: Added prefix to avoid conflicts with bootstrap classes, we can remove it later with find and replace
  prefix: 'cmw-',
  safelist: ['nuxt-link-exact-active', 'peer-focus:cmw-bg-white', 'peer-focus:cmw-bg-black', 'peer-focus:cmw-bg-gray-lightest'],
  preflight: {
    alias: {
      // add nuxt aliases
      'nuxt-link': 'a',
    },
  },
  theme: {
    container: {
      center: true,
    },
    fontSize: {
      base: '1rem',
      xxs: '0.5625rem',
      xs: '0.75rem',
      sm: '.875rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      hero: 'clamp(2.6rem, 2.6vw, 3.2rem)',
      h1: 'clamp(2.2rem, 2.2vw, 2.8rem)',
      h2: 'clamp(1.8rem, 1.8vw, 2.4rem)',
      h3: 'clamp(1.6rem, 1.6vw, 2.2em)',
      h4: 'clamp(1.4rem, 1.4vw, 2em)',
    },
    colors: {
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,
      primary: {
        DEFAULT:'#992545',
        50: '#fae4e8',
        400: '#d94965',
        900:'#751f3e',
      },
      secondary: {
        DEFAULT:'#10312b',
        800:'#154c44',
        700:'#175b53',
        400:'#2c8982',
      },
      body: colors.zinc[700],
      success: '#299100',
      error: '#E6362E',
      warning: '#FFB800',
      info: '#69baf1',
      white: colors.white,
      black: colors.black,
      gray: {
        DEFAULT: '#C5C6C7',
        darkest: '#333333',
        dark: '#8C8D8E',
        light: '#E1E2E3',
        lightest: '#F8F8F8'
      },
    },
    borderRadius: {
      none: '0',
      sm: '8px',
      DEFAULT: '12px',
      lg: '1.5em',
      full: '50%',
      pill: '40px',
    },
    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      'lower-alpha': 'lower-alpha',
      'upper-alpha': 'upper-alpha',
    },
    extend: {
      // https://windicss.org/utilities/general/typography.html#font-family
      fontFamily: {
        sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
        secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
        inherit: 'inherit',
        icon: ['"Material Symbols Outlined"', 'san-serif'],
      },
      screens: {
        lg: '992px',
        xl: '1332px',
        '@hover': { raw: '(hover: hover)' },
      },
      boxShadow: {
        popover: '0 1px 8px 0 rgb(51 51 51 / 20%), 0 3px 3px -2px rgb(51 51 51 / 12%), 0 3px 4px 0 rgb(51 51 51 / 14%)',
        input: '0 0 0 30px #ffe300 inset',
        'input-focus': '0 0 0 2px #fff, 0 0 0 4px rgb(50 100 150 / 40%)',
        btn: '2px 2px 10px rgba(0, 0, 0, 0.3)',
      },
      letterSpacing: {
        wider: '.1125rem',
        widest: '.1313rem',
      },
      transitionProperty: {
        height: 'height',
        width: 'width',
        'transform-opacity': 'transform, opacity',
        'floating-label': 'transform, font-size, opacity',
        'lazy-image': 'opacity, filter',
        'progress-bar': 'width, colors',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      width: {
        fit: 'fit-content',
      },
    },
  },
  shortcuts: {
    // Note: This compiles classes, instead, Alias uses single utilities
    'nuxt-link-exact-active': 'underline',
    'center-the-unknown': 'absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'body-1': 'cmw-font-normal cmw-text-sm cmw-text-black hover:cmw-text-black',
    'overline-1': 'cmw-font-thin cwm-tracking-wider tracking-wider cmw-text-xxs',
    'overline-2': 'cmw-font-thin cwm-tracking-widest tracking-widest cmw-text-xs',
    'floating-label': 'cmw-text-[0.775rem]',
  },
  alias: {
  // Note: This compiles single utilities, we need to use it with a '*' es. class="*big-titles"
    'nuxt-link-exact-active': 'underline',
    'center-the-unknown': 'absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  },
  plugins: [
    require('windicss/plugin/line-clamp'),
    plugin(({ addBase, theme }) => {
      addBase({
        h1: { fontSize: theme('fontSize.h1') },
        h2: { fontSize: theme('fontSize.h2') },
        h3: { fontSize: theme('fontSize.h3') },
        a: { textDecoration: 'underline', transition: 'color 300ms' },
        'a:hover': { color: theme('colors.primary') },
      })
    }),
  ],
})

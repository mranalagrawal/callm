import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'
import plugin from 'windicss/plugin'
import themeConfig from './config/themeConfig'

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  // Note: Added prefix to avoid conflicts with bootstrap classes, we can remove it later with find and replace
  prefix: 'cmw-',
  safelist: ['nuxt-link-exact-active', 'peer-focus:cmw-bg-white', 'peer-focus:cmw-bg-black', 'peer-focus:cmw-bg-gray-lightest',
    'btn-base', 'btn-base-spacing', 'btn-default', 'btn-text'],
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
      'base': '1rem',
      'xxs': '0.5625rem',
      'xs': '0.75rem',
      'sm': '.875rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.75rem',
      '4xl': '2rem',
      '5xl': '2.5rem',
      '6xl': '3.75rem',
    },
    colors: {
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,
      ...themeConfig[process.env.STORE].colors,
      white: colors.white,
      black: colors.black,
      gray: {
        DEFAULT: '#C5C6C7',
        darkest: '#333333',
        dark: '#8C8D8E',
        light: '#E1E2E3',
        lightest: '#F8F8F8',
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
      'none': 'none',
      'disc': 'disc',
      'decimal': 'decimal',
      'lower-alpha': 'lower-alpha',
      'upper-alpha': 'upper-alpha',
    },
    // TODO Apply decent z-indexes
    zIndex: {
      amenadiel: 1050,
      tooltip: 1040,
      loader: 20,
      header: 15,
      content: 10,
      baseHigh: 6,
      base: 5,
      baseLow: 3,
      dante: -1,
    },
    extend: {
      // https://windicss.org/utilities/general/typography.html#font-family
      fontFamily: {
        ...themeConfig[process.env.STORE].fonts,
        inherit: 'inherit',
        icon: ['"Material Symbols Outlined"', 'san-serif'],
      },
      screens: {
        'phone-small': '320px',
        'phone-md': '375px',
        'phone': '412px',
        'sm': '640px',
        'md': '768px',
        'lg': '992px',
        'desktop': '1024px',
        'desktop-wide': '1280px',
        'xl': '1332px',
        '@hover': { raw: '(hover: hover)' },
      },
      boxShadow: {
        'filter': '0px 4px white, 0 -1px 6px 0 rgb(51 51 51 / 20%)',
        'popover': '0 1px 8px 0 rgb(51 51 51 / 20%), 0 3px 3px -2px rgb(51 51 51 / 12%), 0 3px 4px 0 rgb(51 51 51 / 14%)',
        'input': '0 0 0 30px #ffe300 inset',
        'input-focus': '0 0 0 2px #fff, 0 0 0 4px rgb(50 100 150 / 40%)',
        'btn': '2px 2px 10px rgba(0, 0, 0, 0.3)',
        'elevation': '0 5px 12px 1px rgb(51 51 51 / 21%)',
        'lg': '0 20px 36px 3px rgb(51 51 51 / 20%)',
      },
      letterSpacing: {
        wider: '.1125rem',
        widest: '.1313rem',
      },
      backgroundSize: {
        full: '100%',
      },
      transitionProperty: {
        'height': 'height',
        'width': 'width',
        'transform-opacity': 'transform, opacity',
        'floating-label': 'transform, font-size, opacity',
        'lazy-image': 'opacity, filter',
        'progress-bar': 'width, color, background-color',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      width: {
        fit: 'fit-content',
      },
      keyframes: {
        bounceRight: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(5px)' },
        },
      },
      animation: {
        'bounce-right': 'bounceRight 1s ease-in-out infinite',
      },
    },
  },
  shortcuts: {
    // Note: This compiles classes, instead, Alias uses single utilities
    'nuxt-link-exact-active': 'underline',
    'center-the-unknown': 'absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'body-1': 'cmw-font-normal cmw-text-sm cmw-text-black hover:cmw-text-black',
    'overline-1': 'cmw-font-light cwm-tracking-wider tracking-wider cmw-text-xxs',
    'overline-2': 'cmw-font-light cwm-tracking-widest tracking-widest cmw-text-xs',
    'btn-base': 'cmw-font-secondary cmw-flex cmw-items-center cmw-justify-center cmw-w-full cmw-transition-colors cmw-rounded cmw-border-2',
    'btn-base-spacing': 'cmw-px-6 cmw-py-2 md:(cmw-px-8 cmw-py-[0.8rem])',
    'btn-default': 'cmw-font-secondary cmw-border-transparent cmw-bg-primary-400 cmw-text-white cmw-font-bold cmw-uppercase hover:(cmw-text-white cmw-no-underline)',
    'btn-text': 'cmw-border-transparent cmw-text-primary-400 hover:(cmw-text-primary cmw-no-underline)',
  },
  alias: {
    // Note: This compiles single utilities, we need to use it with a '*' es. class="*big-titles"
    'nuxt-link-exact-active': 'underline',
    'center-the-unknown': 'absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  },
  plugins: [
    require('windicss/plugin/line-clamp'),
    plugin(({ addBase, addComponents, theme }) => {
      const margins = {
        '.m-inline-auto': {
          'margin-inline': 'auto',
        },
      }
      addBase({
        'a': { textDecoration: 'underline', transition: 'color 300ms' },
        'a:hover': { color: theme('colors.primary') },
      })
      addComponents(margins)
    }),
  ],
})

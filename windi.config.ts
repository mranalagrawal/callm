import pluginAnimations from '@windicss/plugin-animations'
import colors from 'windicss/colors'
import { defineConfig } from 'windicss/helpers'
import plugin from 'windicss/plugin'
import 'windicss/plugin/typography'
import 'windicss/plugin/line-clamp'

function range(size: number, startAt = 1) {
  return Array.from(Array(size).keys()).map(i => i + startAt)
}
// ...Array.from({ length: 4 }, (_, i) => `p-${i + 1}`),
export default defineConfig({
  attributify: true,
  safelist: [
    'nuxt-link-exact-active',
    'peer-focus:bg-white',
    'peer-focus:bg-black',
    'peer-focus:bg-gray-lightest',
    'btn-base',
    'btn-base-spacing',
    'btn-default',
    'btn-text',
    range(10).map(i => `line-clamp-${i}`),
  ],
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
      primary: {
        DEFAULT: '#992545',
        50: '#fae4e8',
        100: '#F3BAC6',
        400: '#d94965',
        900: '#751f3e',
      },
      secondary: {
        DEFAULT: '#10312b',
        800: '#134c45',
        700: '#155B53',
        400: '#2C8982',
        100: '#ADD3D1',
        50: '#deeded',
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
        sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
        secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
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
        'desktop-wider': '1600px',
        '@hover': { raw: '(hover: hover)' },
        'print': { raw: 'print' },
      },
      boxShadow: {
        'filter': '0px 4px white, 0 -1px 6px 0 rgb(51 51 51 / 20%)',
        'popover':
          '0 1px 8px 0 rgb(51 51 51 / 20%), 0 3px 3px -2px rgb(51 51 51 / 12%), 0 3px 4px 0 rgb(51 51 51 / 14%)',
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
        'max-h': 'max-height',
        'accordion': 'max-height, height, opacity',
        'height': 'height',
        'width': 'width',
        'transform-opacity': 'transform, opacity',
        'floating-label': 'transform, font-size, opacity',
        'lazy-image': 'opacity, filter',
        'progress-bar': 'width, color, background-color',
        'filter': 'filter',
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
      // https://windicss.org/plugins/official/typography.html#customization
      typography: {
        DEFAULT: {
          css: {
            'lineHeight': 'inherit',
            'maxWidth': 'unset',
            'a': {
              'color': '#d94965',
              'textDecoration': 'none',
              '&:link': {
                textDecoration: 'none',
              },
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            '&.dark p': {
              color: 'inherit',
            },
          },
        },
      },
    },
  },
  shortcuts: {
    // Note: This compiles classes, instead, Alias uses single utilities
    'cmw-font-light': {
      '@supports (font-variation-settings: "wght" 469)': {
        fontVariationSettings: '"wght" 300',
      },
      '@supports not (font-variation-settings: "wght" 469)': {
        'font-weight': '300',
      },
    },
    'cmw-font-semibold': {
      '@supports (font-variation-settings: "wght" 469)': {
        fontVariationSettings: '"wght" 600',
      },
      '@supports not (font-variation-settings: "wght" 469)': {
        'font-weight': '600',
      },
    },
    'cmw-font-bold': {
      '@supports (font-variation-settings: "wght" 469)': {
        fontVariationSettings: '"wght" 700',
      },
      '@supports not (font-variation-settings: "wght" 469)': {
        'font-weight': '700',
      },
    },
    'nuxt-link-exact-active': 'no-underline',
    'center-the-unknown':
      'absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'body-1': 'font-normal text-sm text-black hover:text-black',
    'overline-1': 'cmw-font-light tracking-wider text-xxs',
    'overline-2': 'cmw-font-light tracking-widest text-xs',
    'btn-base':
      'font-secondary flex items-center justify-center w-full transition-colors rounded border-2',
    'btn-base-spacing': 'px-4 py-3 md:(px-8 py-[0.8rem])',
    'btn-default':
      'font-secondary border-transparent bg-primary-400 text-white cmw-font-bold uppercase',
    'btn-text': 'border-transparent text-primary-400',
    'products-grid':
      'grid gap-2 phone-md:grid-cols-2 sm:gap-3 lg:(grid-cols-3 gap-4) desktop-wide:grid-cols-4',
  },
  alias: {
    // Note: This compiles single utilities, we need to use it with a '*' es. class="*big-titles"
    'nuxt-link-exact-active': 'no-underline',
    'center-the-unknown':
      'absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  },
  plugins: [

    // require('windicss/plugin/typography'),

    // require('windicss/plugin/line-clamp'),
    // // eslint-disable-next-line @typescript-eslint/no-var-requires
    // require('@windicss/plugin-animations')({
    //   settings: {
    //     animatedSpeed: 1000,
    //     heartBeatSpeed: 1000,
    //     hingeSpeed: 2000,
    //     bounceInSpeed: 750,
    //     bounceOutSpeed: 750,
    //     animationDelaySpeed: 1000,
    //   },
    // }),
    pluginAnimations({

      animatedSpeed: 1000,
      heartBeatSpeed: 1000,
      hingeSpeed: 2000,
      bounceInSpeed: 750,
      bounceOutSpeed: 750,
      animationDelaySpeed: 1000,

    }),
    plugin(({ addComponents }) => {
      const margins = {
        '.m-inline-auto': {
          'margin-inline': 'auto',
        },
      }
      addComponents(margins)
    }),
  ],
})

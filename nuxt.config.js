/* import { apiEndpoint } from "./sm.json"; */
import { join } from 'path'

/*
// Have a look at this
function requestMiddleware(request: RequestInit) {
  const token = getToken()
  return {
    ...request,
    headers: { ...request.headers, 'x-auth-token': token },
  }
} */

const THEME_COLORS = {
  CMW: `
  "dark-primary": #11312b,
  "light-primary": #155b53,
  "darker-secondary": #751f3d,
  "dark-secondary": #8e2440,
  "light-secondary": #da4865,
  `,
  CMW_UK: `
  "dark-primary": #11312b,
  "light-primary": #155b53,
  "darker-secondary": #751f3d,
  "dark-secondary": #8e2440,
  "light-secondary": #da4865,
  `,
  WILDVIGNERON: `
    "dark-primary": #0B4C3C,
    "light-primary": #0B4C3C,
    "darker-secondary": #0B4C3C,
    "dark-secondary": #0B4C3C,
    "light-secondary": #0B4C3C,
  `,
}

const FONTS = {
  CMW: '"main": "Open Sans", "header": "Open Sans"',
  CMW_UK: '"main": "Open Sans", "header": "Open Sans"',
  WILDVIGNERON: '"main": "Readex Pro", "header": "Inknut Antiqua"',
}

const TITLE = {
  CMW: 'CallMeWine',
  CMW_UK: 'CallMeWine UK',
  WILDVIGNERON: 'Wild Vigneron',
}

export default {
  loading: '~/components/LoadingBar.vue',
  loadingIndicator: {
    name: 'circle',
    color: '#3B8070',
    background: 'white',
  },
  head: {
    title: TITLE[process.env.STORE],
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: 'https://kit.fontawesome.com/b5939ad040.js',
        async: true,
        crossorigin: 'anonymous',
      },
    ],
  },

  css: [
    '@/assets/scss/main.scss',
    '@yzfe/svgicon/lib/svgicon.css',
    '@assets/css/vue-transitions.css',
    '@assets/css/layers/base.pcss',
    // Vendors
    '@/assets/css/vendors/swal.css',
    '@/assets/css/vendors/vue-slick-carousel.css',
  ],

  plugins: [
    { src: '~/plugins/repositories.js' },
    { src: '~/plugins/cookies.js' },
    { src: '~plugins/vee-validate', ssr: false },
    { src: '~plugins/vue-carousel-3d', ssr: false },
    { src: '~/plugins/vuex-persist', ssr: false },
    { src: '~/plugins/vue-flash-message.js', mode: 'client' },
    { src: '~/plugins/vue-svg-icon.js' },
    { src: '~/plugins/vue-slick-carousel.js', mode: 'client' },
    { src: '~/plugins/i18n.js' },
  ],

  components: [
    '~/components',
    { path: '~/components/Base', extensions: ['vue'] },
  ],

  buildModules: [
    ['@nuxtjs/eslint-module', {
      exclude: ['node_modules', '.nuxt', 'assets', 'components', 'config', 'layouts',
        'locales', 'middleware', 'pages', 'plugins', 'static'],
      fix: false,
    }],
    '@nuxtjs/composition-api/module',
    ['@pinia/nuxt', { disableVuex: false }],
    '@nuxtjs/google-fonts',
    '@nuxtjs/prismic',
    'nuxt-windicss',
    'nuxt-graphql-request',
  ],
  prismic: {
    endpoint: process.env.PRISMIC,
    modern: true,
    preview: true,
  },

  modules: [
    ['@nuxt/http'],
    '@nuxtjs/dayjs',
    'bootstrap-vue/nuxt',
    '@nuxtjs/style-resources',
    ['@nuxtjs/i18n'],
    '@nuxtjs/gtm',
    'cookie-universal-nuxt',
    '@nuxtjs/sentry',
  ],

  http: {
    baseURL: process.env.ELASTIC_URL,
  },

  graphql: {
    /**
     * An Object of your GraphQL clients
     */
    clients: {
      default: {
        /**
         * The client endpoint url
         */
        endpoint: process.env.DOMAIN, // 'https://swapi-graphql.netlify.com/.netlify/functions/index',
        /**
         * Per-client options overrides
         * See: https://github.com/prisma-labs/graphql-request#passing-more-options-to-fetch
         */
        options: {
          headers: {
            'X-Shopify-Storefront-Access-Token': process.env.STOREFRONT_ACCESS_TOKEN,
            'Content-Type': 'application/json, application/graphql',
          },
        },
      },
    },
    /**
     * Options
     * See: https://github.com/prisma-labs/graphql-request#passing-more-options-to-fetch
     */
    options: {
      method: 'get', // Default to `POST`
    },
    /**
     * Optional
     * default: true (this includes cross-fetch/polyfill before creating the graphql client)
     */
    useFetchPolyfill: true,
    /**
     * Optional
     * default: false (this includes graphql-tag for node_modules folder)
     */
    includeNodeModules: true,
  },

  i18n: {
    locales: [
      { code: 'en', iso: 'en-GB', file: 'en.js', dir: 'ltr' },
      { code: 'it', iso: 'it-IT', file: 'it.js', dir: 'ltr' },
      { code: 'de', iso: 'de-DE', file: 'de.js', dir: 'ltr' },
      { code: 'fr', iso: 'fr-FR', file: 'fr.js', dir: 'ltr' },
    ],
    defaultLocale: process.env.DEFAULT_LOCALE,
    lazy: true,
    langDir: 'locales/',
    vueI18n: {
      fallbackLocale: process.env.DEFAULT_LOCALE,
      numberFormats: {
        'en-GB': {
          currency: {
            style: 'currency',
            currency: 'GBP',
          },
        },
        'it-IT': {
          currency: {
            style: 'currency',
            currency: 'EUR',
          },
        },
        'de-GE': {
          currency: {
            style: 'currency',
            currency: 'EUR',
          },
        },
        'fr-FR': {
          currency: {
            style: 'currency',
            currency: 'EUR',
          },
        },
      },
      dateTimeFormats: {
        'en-GB': {
          short: {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          },
          long: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
          },
        },
        'it-IT': {
          short: {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          },
          long: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
          },
        },
      },
    },
  },

  sentry: {
    dsn: 'https://8976f88cc7254b248b330a78ba72a074@o1240128.ingest.sentry.io/4504560369008640',
    disabled: process.env.NODE_ENV !== 'production',
    config: {
      browserTracing: {
        tracePropagationTargets: ['callmewine.co.uk'],
      },
      vueOptions: {
        trackComponents: true,
      },
      tracesSampleRate: 1.0,
    },
  },

  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    icons: false,
  },

  router: {
    middleware: ['category'],
  },

  build: {
    transpile: ['@prismicio/vue', 'swiper', 'vue-svg-icon', 'vee-validate/dist/rules'],
    loaders: {
      scss: {
        additionalData: `
          $theme-colors: (${THEME_COLORS[process.env.STORE]});
          $font: (${FONTS[process.env.STORE]});
        `,
      },
    },
    extend(config) {
      const svgFilePath = join(__dirname, 'assets')
      const imageLoaderRule = config.module.rules.find(rule => rule.test && rule.test.test('.svg'))
      imageLoaderRule.test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        include: [svgFilePath],
        use: [
          {
            loader: '@yzfe/svgicon-loader',
            options: {
              svgFilePath: [svgFilePath],
              svgoConfig: null, // Custom svgo configuration
            },
          },
        ],
      })

      config.module.rules.push({
        test: /\.(cjs|mjs)$/,
        exclude: {
          and: [/node_modules/],
          not: [/pathe/],
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'ie 11' }]],
          },
        },
      })
    },
  },

  // https://google-fonts.nuxtjs.org/
  googleFonts: {
    download: true,
    base64: process.env.NODE_ENV === 'production',
    display: 'swap',
    prefetch: false,
    preconnect: false,
    stylePath: 'css/fonts.css',
    fontsDir: process.env.NODE_ENV === 'production' ? 'fonts' : undefined,
    fontsPath: process.env.NODE_ENV === 'production' ? '~assets/fonts' : undefined,
    families: {
      'Open Sans': [300, 400, 500, 600, 700],
    },
  },

  // Optional https://github.com/nuxt-community/dayjs-module
  dayjs: {
    locales: ['it'],
    defaultLocale: 'it',
    /* defaultTimeZone: 'Asia/Tokyo', */
    plugins: [
      // 'utc', // import 'dayjs/plugin/utc'
      // 'timezone', // import 'dayjs/plugin/timezone'
      // 'customParseFormat', // import 'dayjs/plugin/customParseFormat'
    ], // Your Day.js plugin
  },

  gtm: {
    id: process.env.GOOGLE_TAG_MANAGER_ID,
  },

  publicRuntimeConfig: {
    DOMAIN: process.env.DOMAIN,
    STOREFRONT_ACCESS_TOKEN: process.env.STOREFRONT_ACCESS_TOKEN,
    ELASTIC_URL: process.env.ELASTIC_URL,
    MAIN_COLOR: process.env.MAIN_COLOR,
    STORE: process.env.STORE === 'CMW' ? 'CMW_UK' : process.env.STORE,
    SALECHANNEL: process.env.SALECHANNEL,
    DEFAULT_LOCALE: process.env.DEFAULT_LOCALE,
    CUSTOMER_API: process.env.CUSTOMER_API,
    gtm: {
      id: process.env.GOOGLE_TAG_MANAGER_ID,
    },
  },
}

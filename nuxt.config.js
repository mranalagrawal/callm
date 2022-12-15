/* import { apiEndpoint } from "./sm.json"; */
import { join } from 'path'

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
};

const FONTS = {
  CMW: `"main": "Open Sans", "header": "Open Sans"`,
  CMW_UK: `"main": "Open Sans", "header": "Open Sans"`,
  WILDVIGNERON: `"main": "Readex Pro", "header": "Inknut Antiqua"`,
};

const TITLE = {
  CMW: "CallMeWine",
  CMW_UK: "CallMeWine UK",
  WILDVIGNERON: "Wild Vigneron",
};

export default {
  head: {
    title: TITLE[process.env.STORE],
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      {
        src: "https://kit.fontawesome.com/b5939ad040.js",
        async: true,
        crossorigin: "anonymous",
      },
    ],
  },

  css: ["@/assets/scss/main.scss", '@yzfe/svgicon/lib/svgicon.css'],

  plugins: [
    { src: "~plugins/vee-validate", ssr: false },
    { src: "~plugins/vue-carousel-3d", ssr: false },
    { src: "~/plugins/vuex-persist", ssr: false },
    { src: "~/plugins/vue-flash-message.js", mode: "client" },
    { src: "~/plugins/vue-svg-icon.js" },
    { src: "~/plugins/vue-slick-carousel.js", mode: "client" },
  ],

  components: [
    '~/components',
    { path: '~/components/Base', extensions: ['vue'] }
  ],

  buildModules: [
    '@nuxtjs/composition-api/module',
    '@nuxtjs/google-fonts',
    "@nuxtjs/prismic",
    'nuxt-windicss',
  ],
  prismic: {
    endpoint: process.env.PRISMIC,
    modern: true,
    preview: false,
  },

  modules: [
    "bootstrap-vue/nuxt",
    "@nuxtjs/style-resources",
    ["@nuxtjs/i18n"],
    "@nuxtjs/gtm",
  ],

  i18n: {
    locales: [
      { code: "en", iso: "en-GB", file: "en.js", dir: "ltr" },
      { code: "it", iso: "it-IT", file: "it.js", dir: "ltr" },
      { code: "de", iso: "de-DE", file: "de.js", dir: "ltr" },
      { code: "fr", iso: "fr-FR", file: "fr.js", dir: "ltr" },
    ],
    defaultLocale: process.env.DEFAULT_LOCALE,
    langDir: "locales/",
    vueI18n: {
      fallbackLocale: process.env.DEFAULT_LOCALE,
    },
  },

  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    icons: false,
  },

  build: {
    transpile: ["@prismicio/vue", "swiper", "vue-svg-icon"],
    loaders: {
      scss: {
        additionalData: `
          $theme-colors: (${THEME_COLORS[process.env.STORE]});
          $font: (${FONTS[process.env.STORE]});
        `,
      },
    },
    extend (config, ctx) {
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
              svgoConfig: null // Custom svgo configuration
            }
          }
        ]
      })
    },
  },

  babel: { compact: true },

  /* target: "static", */

  generate: {
    exclude: [
      /^\//, // rotte da escludere dalla generazione
    ],
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
      'Open Sans': [400, 600, 700],
      'Roboto': [400, 700],
    },
  },

  publicRuntimeConfig: {
    DOMAIN: process.env.DOMAIN,
    STOREFRONT_ACCESS_TOKEN: process.env.STOREFRONT_ACCESS_TOKEN,
    ELASTIC_URL: process.env.ELASTIC_URL,
    MAIN_COLOR: process.env.MAIN_COLOR,
    STORE: process.env.STORE == "CMW" ? "CMW_UK" : process.env.STORE,
    SALECHANNEL: process.env.SALECHANNEL,
    DEFAULT_LOCALE: process.env.DEFAULT_LOCALE,
    gtm: {
      id: process.env.GOOGLE_TAG_MANAGER_ID,
    },
  },
};

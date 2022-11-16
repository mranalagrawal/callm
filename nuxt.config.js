/* import { apiEndpoint } from "./sm.json"; */

const THEME_COLORS = {
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
  CMW_UK: `"main": "Open Sans", "header": "Open Sans"`,
  WILDVIGNERON: `"main": "Readex Pro", "header": "Inknut Antiqua"`,
};

const TITLE = {
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

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/scss/main.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "~plugins/vue-carousel-3d", ssr: false },
    { src: "~/plugins/vuex-persist", ssr: false },
    { src: "~/plugins/vue-flash-message.js", mode: "client" },
    { src: "~/plugins/vue-slick-carousel.js", mode: "client" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxtjs/prismic"],
  prismic: {
    endpoint: process.env.PRISMIC,
    modern: true,
    preview: false,
    /* see configuration for more */
  },

  // Modules: https://go.nuxtjs.dev/config-modules
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
    ],
    defaultLocale: process.env.STORE === "WILDVIGNERON" ? "it" : "en",
    langDir: "locales/",
    vueI18n: {
      fallbackLocale: "en",
    },
  },

  publicRuntimeConfig: {
    gtm: {
      id: process.env.GOOGLE_TAG_MANAGER_ID,
    },
  },

  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    icons: false,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["@prismicio/vue", "swiper"],
    loaders: {
      scss: {
        additionalData: `
          $theme-colors: (${THEME_COLORS[process.env.STORE]});
          $font: (${FONTS[process.env.STORE]});
        `,
      },
    },
  },

  babel: { compact: true },

  /* target: "static", */

  generate: {
    exclude: [
      /^\//, // rotte da escludere dalla generazione
    ],
  },

  publicRuntimeConfig: {
    DOMAIN: process.env.DOMAIN,
    STOREFRONT_ACCESS_TOKEN: process.env.STOREFRONT_ACCESS_TOKEN,
    ELASTIC_URL: process.env.ELASTIC_URL,
    MAIN_COLOR: process.env.MAIN_COLOR,
    STORE: process.env.STORE,
  },
};

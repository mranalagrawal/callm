import { apiEndpoint } from "./sm.json";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "CallMeWine",
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
    endpoint: apiEndpoint,
    modern: true,
    preview: false,
    /* see configuration for more */
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "bootstrap-vue/nuxt",
    "@nuxtjs/style-resources",
    [
      "@nuxtjs/i18n",
      {
        locales: [
          { code: "en", iso: "en-GB", file: "en.js", dir: "ltr" },
          { code: "it", iso: "it-IT", file: "it.js", dir: "ltr" },
        ],
        defaultLocale: "en",
        langDir: "locales/",

        vueI18n: {
          fallbackLocale: "en",
        },
      },
    ],
  ],

  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    icons: false,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["@prismicio/vue", "swiper"],
    /* loaders: {
      scss: {
        additionalData: `$MAIN_COLOR: ${process.env.MAIN_COLOR};`,
      },
    }, */
  },

  babel: { compact: true },

  /* target: "static", */

  generate: {
    exclude: [
      /^\//, // rotte da escludere dalla generazione, che poi sono tutte
    ],
  },

  publicRuntimeConfig: {
    DOMAIN: process.env.DOMAIN,
    STOREFRONT_ACCESS_TOKEN: process.env.STOREFRONT_ACCESS_TOKEN,
    ELASTIC_URL: process.env.ELASTIC_URL,
    MAIN_COLOR: process.env.MAIN_COLOR,
  },
};

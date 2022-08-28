import { apiEndpoint } from "./sm.json";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "wine",
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
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxtjs/prismic"],
  prismic: {
    endpoint: apiEndpoint,
    modern: true,
    /* see configuration for more */
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["bootstrap-vue/nuxt", "@nuxtjs/style-resources"],

  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    icons: false,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["@prismicio/vue"],
  },

  babel: { compact: true },

  target: "static",

  publicRuntimeConfig: {
    DOMAIN: process.env.DOMAIN,
    STOREFRONT_ACCESS_TOKEN: process.env.STOREFRONT_ACCESS_TOKEN,
  },
};

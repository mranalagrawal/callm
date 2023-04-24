/* import { apiEndpoint } from "./sm.json"; */
import { join } from 'node:path'

// Todo: Move these function to external files
// import getSitemapProducts from './utilities/getSitemapProducts'
// import getSitemapBrands from './utilities/getSitemapBrands'

import fetch from 'node-fetch'

async function getPageProducts(lang, cursor = null) {
  let response = {}
  await fetch(process.env.DOMAIN, {
    async: true,
    crossDomain: true,
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': process.env.STOREFRONT_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query getAllProducts($lang: LanguageCode!, $first: Int = 200, $cursor: String) @inContext(language: $lang) {
                  products(first: $first, after: $cursor, query: "tag:active") {
                    pageInfo {
                      endCursor
                      hasNextPage
                    }
                    nodes {
                      handle
                      title
                      updatedAt
                      featuredImage {
                        url
                      }
                      details: metafield(namespace: "custom", key: "details") {
                        value
                      }
                    }
                  }
                }`,
      variables: {
        lang,
        cursor,
      },
    }),
  })
    .then(async r => await r.json())
    .then(data => response = data || {})
    .catch(() => {
      response = {}
    })

  return response
}

async function getMoreProducts(lang, arr, endCursor) {
  const { data } = await getPageProducts(lang, endCursor)
  if (!data?.products.nodes)
    return arr
  arr = [...arr,
    ...data.products?.nodes.map(product => ({
      url: `/${product.handle}-${product.details?.value ? JSON.parse(product.details.value).key : 'OHBOY'}.htm`,
      lastmod: product.updatedAt,
      img: [
        {
          url: `${product.featuredImage?.url || 'missing'}`,
          title: product.title,
        },
      ],
    }))]

  if (data.products.pageInfo && data.products.pageInfo.hasNextPage)
    return await getMoreProducts(lang, arr, data.products.pageInfo.endCursor)
  else return arr
}

async function getSitemapProducts(lang) {
  let arr = []
  const { data } = await getPageProducts(lang)

  if (!data?.products?.nodes)
    return

  if (data.products.nodes) {
    arr = data.products?.nodes.map(product => ({
      url: `/${product.handle}-${product.details?.value ? JSON.parse(product.details.value).key : 'OHBOY'}.htm`,
      lastmod: product.updatedAt,
      img: [
        {
          url: `${product.featuredImage?.url || 'missing'}`,
          title: product.title,
        },
      ],
    }))
  }

  arr = await getMoreProducts(lang, arr, data.products.pageInfo.endCursor)
  return arr
}

async function getBrands(query) {
  let response = {}
  await fetch(`${process.env.ELASTIC_URL}brands/sitemap?${query}`, { method: 'GET' })
    .then(async res => await res.json())
    .then(data => response = data || {})
    .catch(() => { response = {} })

  return response
}

async function getMoreBrands(arr, query) {
  const { data, meta } = await getBrands(query)
  if (!data)
    return arr
  arr = [...arr,
    ...data.map((brand) => {
      const url = new URL(brand.url)

      return ({
        url: url.pathname,
        lastmod: brand.updatedAt,
      })
    })]

  if (meta.next_cursor)
    return await getMoreBrands(arr, `paginate=300&cursor=${meta.next_cursor}`)
  else return arr
}

async function getSitemapBrands() {
  let arr = []
  const { data, meta } = await getBrands('paginate=300')

  if (!data)
    return

  arr = data.map((brand) => {
    const url = new URL(brand.url)

    return ({
      url: url.pathname,
      lastmod: brand.updatedAt,
    })
  })

  arr = await getMoreBrands(arr, `paginate=300&cursor=${meta.next_cursor}`)
  return arr
}
/*
// Have a look at this
function requestMiddleware(request: RequestInit) {
  const token = getToken()
  return {
    ...request,
    headers: { ...request.headers, 'x-auth-token': token },
  }
} */

function storeLocales(store) {
  /* { code: 'de', iso: 'de-DE', file: 'de.js', dir: 'ltr' },
  { code: 'fr', iso: 'fr-FR', file: 'fr.js', dir: 'ltr' }, */

  const obj = {
    CMW: [
      { code: 'en', iso: 'en-GB', file: 'en.js', dir: 'ltr' },
      { code: 'it', iso: 'it-IT', file: 'it.js', dir: 'ltr' },
    ],
    CMW_UK: [
      { code: 'en', iso: 'en-GB', file: 'en.js', dir: 'ltr' },
      // { code: 'it', iso: 'it-IT', file: 'it.js', dir: 'ltr' }, // Todo: Remove this line
    ],
    CMW_DE: [
      { code: 'de', iso: 'de-DE', file: 'de.js', dir: 'ltr' },
    ],
    WILDVIGNERON: [
      { code: 'en', iso: 'en-GB', file: 'en.js', dir: 'ltr' },
    ],
  }

  return obj[store]
}

const SITEMAP = {
  CMW: [
    {
      path: '/sitemap_it.xml',
    }, {
      path: '/sitemap_en.xml',
      routes: ['bar/1', 'bar/2'],
      exclude: ['/**'],
    },
  ],
  CMW_UK: [
    {
      path: '/sitemap_en_product_pages.xml',
      routes: () => getSitemapProducts('EN'),
      exclude: ['/**'],
    },
    {
      path: '/sitemap_en_category_listing_pages.xml',
      routes: async () => getSitemapBrands(),
      exclude: ['/**'],
    },
    {
      path: '/sitemap_en_editorial_other_pages.xml',
      exclude: ['/product/**', '/search/**', '/profile', '/profile/**', '/catalog', '/privacy', '/terms-of-sales', '/cookie', '/business-gifts', '/cart', '/gift-cards', '/login', '/new-password', '/preview', '/recover', '/thank-you', '/winery'],
    },
  ],
  CMW_DE: [
    {
      path: '/sitemap_en_product_pages.xml',
      routes: () => getSitemapProducts('EN'),
      exclude: ['/**'],
    },
    {
      path: '/sitemap_en_category_listing_pages.xml',
      routes: async () => getSitemapBrands(),
      exclude: ['/**'],
    },
    {
      path: '/sitemap_en_editorial_other_pages.xml',
      exclude: ['/product/**', '/search/**', '/profile', '/profile/**', '/catalog', '/privacy', '/terms-of-sales', '/cookie', '/business-gifts', '/cart', '/gift-cards', '/login', '/new-password', '/preview', '/recover', '/thank-you', '/winery'],
    },
  ],
  WILDVIGNERON: [
    {
      path: '/sitemap-it.xml',
      routes: ['about-us', 'cookie'],
      lastmod: '2017-06-31',
      gzip: true,
    }, {
      path: '/folder/sitemap-bar.xml',
      routes: ['bar/1', 'bar/2'],
      exclude: ['/**'],
    },
  ],
}
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
  CMW_DE: `
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
  CMW_DE: '"main": "Open Sans", "header": "Open Sans"',
  WILDVIGNERON: '"main": "Readex Pro", "header": "Inknut Antiqua"',
}

const TITLE = {
  CMW: 'Callmewine',
  CMW_UK: 'Callmewine UK',
  CMW_DE: 'Callmewine DE',
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
      lang: process.env.DEFAULT_LOCALE,
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
    { src: '~/plugins/vue-agile.js' },
    { src: '~/plugins/cmw-api.js' },
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
    // ['@nuxtjs/eslint-module', {
    //   // extends: ['@antfu'],
    //   exclude: ['node_modules', '.nuxt', 'assets', 'components', 'config', 'layouts',
    //     'locales', 'middleware', 'pages', 'plugins', 'static'],
    //   fix: false,
    // }],
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
    ['@nuxtjs/robots'],
    ['@nuxt/http'],
    '@nuxtjs/dayjs',
    'bootstrap-vue/nuxt',
    '@nuxtjs/style-resources',
    ['@nuxtjs/i18n'],
    '@nuxtjs/gtm',
    'cookie-universal-nuxt',
    '@nuxtjs/sentry',
    '@nuxtjs/sitemap',
  ],

  sitemap: {
    path: '/sitemap.xml',
    gzip: true,
    sitemaps: SITEMAP[process.env.STORE],
  },

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
    locales: storeLocales(process.env.STORE),
    defaultLocale: process.env.DEFAULT_LOCALE,
    lazy: true,
    langDir: 'locales/',
    parsePages: false,
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
    disabled: process.env.ENVIRONMENT !== 'prod',
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
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: 'search',
          path: '/(.*)-:filter_key_1(V|C|R|D|B|N|M):filter_id_1(\\d+).htm/',
          component: resolve(__dirname, 'pages/search/categories.vue'),
        },
        {
          name: 'search-deep',
          path: '/(.*)-:filter_key_1(V|C|R|D|B|N|M):filter_id_1(\\d+):filter_key_2(V|C|R|D|B|N|M):filter_id_2(\\d+).htm/',
          component: resolve(__dirname, 'pages/search/categories.vue'),
        },
        {
          name: 'catalog',
          path: '/catalog',
          component: resolve(__dirname, 'pages/search/categories.vue'),
        },
        {
          name: 'product',
          path: '/(.*)-P:id(\\d+).htm/',
          component: resolve(__dirname, 'pages/product/details.vue'),
        },
      )
    },
  },

  build: {
    transpile: ['@prismicio/vue', 'swiper', 'vue-svg-icon', 'vee-validate/dist/rules', 'vue-agile'],
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
    CMW_API: process.env.CMW_API,
    CMW_API_KEY: process.env.CMW_API_KEY,
    MAIN_COLOR: process.env.MAIN_COLOR,
    STORE: process.env.STORE === 'CMW' ? 'CMW_UK' : process.env.STORE,
    SALECHANNEL: process.env.SALECHANNEL,
    DEFAULT_LOCALE: process.env.DEFAULT_LOCALE,
    CUSTOMER_API: process.env.CUSTOMER_API,
    ENVIRONMENT: process.env.ENVIRONMENT,
    gtm: {
      id: process.env.GOOGLE_TAG_MANAGER_ID,
    },
  },

  robots: () => {
    return {
      UserAgent: '*',
      Disallow: process.env.ENVIRONMENT === 'prod' ? ['/*?*', '/catalog*'] : '/',
      // Be aware that this will NOT work on target: 'static' mode
      ...(process.env.ENVIRONMENT === 'prod' && { Sitemap: req => `https://${req.headers.host}/sitemap.xml` }),
    }
  },
}

/* import { apiEndpoint } from "./sm.json"; */
import fetch from 'node-fetch'
import { join } from 'path'

// Todo: Move these function to external files
// import getSitemapProducts from './utilities/getSitemapProducts'
// import getSitemapBrands from './utilities/getSitemapBrands'

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
      query: `query getAllProducts($lang: LanguageCode!, $first: Int = 200, $cursor: String) @inContext(language: ) {
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
    .then(data => (response = data || {}))
    .catch(() => {
      response = {}
    })
  return response
}

async function getMoreProducts(lang, arr, endCursor) {
  const { data } = await getPageProducts(lang, endCursor)
  if (!data?.products.nodes) {
    return arr
  }
  arr = [
    ...arr,
    ...data.products?.nodes.map(product => ({
      url: `/${product.handle}-${
        product.details?.value ? JSON.parse(product.details.value).key : 'OHBOY'
      }.htm`,
      lastmod: product.updatedAt,
      img: [
        {
          url: `${product.featuredImage?.url || 'missing'}`,
          title: product.title,
        },
      ],
    })),
  ]

  if (data.products.pageInfo && data.products.pageInfo.hasNextPage) {
    return await getMoreProducts(lang, arr, data.products.pageInfo.endCursor)
  } else {
    return arr
  }
}

async function getSitemapProducts(lang) {
  let arr = []
  const { data } = await getPageProducts(lang)

  if (!data?.products?.nodes) {
    return
  }

  if (data.products.nodes) {
    arr = data.products?.nodes.map(product => ({
      url: `/${product.handle}-${
        product.details?.value ? JSON.parse(product.details.value).key : 'OHBOY'
      }.htm`,
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
  await fetch(`${process.env.ELASTIC_URL}/brands/sitemap?${query}`, {
    method: 'GET',
  })
    .then(async res => await res.json())
    .then(data => (response = data || {}))
    .catch(() => {
      response = {}
    })

  return response
}

async function getMoreBrands(arr, query) {
  const { data, meta } = await getBrands(query)
  if (!data) {
    return arr
  }
  arr = [
    ...arr,
    ...data.map((brand) => {
      const url = new URL(brand.url)

      return {
        url: url.pathname,
        lastmod: brand.updatedAt,
      }
    }),
  ]

  if (meta.next_cursor) {
    return await getMoreBrands(arr, `paginate=300&cursor=${meta.next_cursor}`)
  } else {
    return arr
  }
}

async function getSitemapBrands() {
  let arr = []
  const { data, meta } = await getBrands('paginate=300')

  if (!data) {
    return
  }

  arr = data.map((brand) => {
    const url = new URL(brand.url)

    return {
      url: url.pathname,
      lastmod: brand.updatedAt,
    }
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
  const obj = {
    CMW: [
      {
        'code': 'en',
        'iso': 'en-GB',
        'file': 'en.js',
        'dir': 'ltr',
        'iso-3166-1-alpha-3': 'gbr',
      },
      {
        'code': 'it',
        'iso': 'it-IT',
        'file': 'it.js',
        'dir': 'ltr',
        'iso-3166-1-alpha-3': 'ita',
      },
    ],
    B2B: [
      {
        'code': 'it',
        'iso': 'it-IT',
        'file': 'it-b2b.js',
        'dir': 'ltr',
        'iso-3166-1-alpha-3': 'ita',
      },
    ],
    CMW_UK: [
      {
        'code': 'en',
        'iso': 'en-GB',
        'file': 'en.js',
        'dir': 'ltr',
        'iso-3166-1-alpha-3': 'gbr',
      },
      // { code: 'it', iso: 'it-IT', file: 'it.js', dir: 'ltr' }, // Todo: Remove this line
    ],
    CMW_FR: [
      {
        'code': 'fr',
        'iso': 'fr-FR',
        'file': 'fr.js',
        'dir': 'ltr',
        'iso-3166-1-alpha-3': 'fra',
      },
    ],
    CMW_DE: [
      {
        'code': 'de',
        'iso': 'de-DE',
        'file': 'de.js',
        'dir': 'ltr',
        'iso-3166-1-alpha-3': 'deu',
      },
    ],
  }

  return obj[store]
}

const SITEMAP = {
  CMW: [
    {
      path: '/sitemap_it.xml',
    },
    {
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
      exclude: [
        '/product/**',
        '/search/**',
        '/profile',
        '/profile/**',
        '/catalog',
        '/privacy',
        '/terms-of-sales',
        '/cookie',
        '/cart',
        '/gift-cards',
        '/login',
        '/preview',
        '/recover',
        '/thank-you',
        '/winery',
      ],
    },
  ],
  CMW_DE: [
    {
      path: '/sitemap_en_product_pages.xml',
      routes: () => getSitemapProducts('DE'),
      exclude: ['/**'],
    },
    {
      path: '/sitemap_en_category_listing_pages.xml',
      routes: async () => getSitemapBrands(),
      exclude: ['/**'],
    },
    {
      path: '/sitemap_en_editorial_other_pages.xml',
      exclude: [
        '/product/**',
        '/search/**',
        '/profile',
        '/profile/**',
        '/catalog',
        '/privacy',
        '/terms-of-sales',
        '/cookie',
        '/cart',
        '/gift-cards',
        '/login',
        '/preview',
        '/recover',
        '/thank-you',
        '/winery',
      ],
    },
  ],
  CMW_FR: [
    {
      path: '/sitemap_en_product_pages.xml',
      routes: () => getSitemapProducts('FR'),
      exclude: ['/**'],
    },
    {
      path: '/sitemap_en_category_listing_pages.xml',
      routes: async () => getSitemapBrands(),
      exclude: ['/**'],
    },
    {
      path: '/sitemap_en_editorial_other_pages.xml',
      exclude: [
        '/product/**',
        '/search/**',
        '/profile',
        '/profile/**',
        '/catalog',
        '/privacy',
        '/terms-of-sales',
        '/cookie',
        '/cart',
        '/gift-cards',
        '/login',
        '/preview',
        '/recover',
        '/thank-you',
        '/winery',
      ],
    },
  ],
}

const TITLE = {
  CMW: 'Callmewine: Vendita Vino Online, Enoteca e Shop Online',
  B2B: 'Callmewine: Vendita Vino Online, Enoteca e Shop Online',
  CMW_UK: 'Italian Wine Shop - Callmewine',
  CMW_FR: 'Achat Vin, Vente de Vins En Ligne - Callmewine',
  CMW_DE: 'Online Önothek, Verkauf italienischer Weine – Callmewine',
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
  },

  css: [
    '@yzfe/svgicon/lib/svgicon.css',
    '@assets/css/vue-transitions.css',
    '@assets/css/layers/base.pcss',
    '@assets/css/prose.css',
    // Vendors
    '@/assets/css/vendors/flash-message.css',
    '@/assets/css/vendors/swal.css',
    '@/assets/css/vendors/vue-slick-carousel.css',
    '@/assets/css/vendors/vue-ssr-carousel.css',
  ],

  plugins: [
    // The order is important here, cmw-project-config.ts needs to go first
    { src: '~/plugins/app-utils.js', ssr: false },
    { src: '~/plugins/cmw-project-config.ts' },
    { src: '~/plugins/cmw-api.ts' },
    { src: '~/plugins/cmw-gtm.ts' },
    { src: '~/plugins/product-mapping.ts' },
    { src: '~/plugins/repositories.ts' },
    { src: '~/plugins/cookies.ts' },
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
    { path: '~/components/Cmw', extensions: ['vue'] },
    { path: '~/components/Home', extensions: ['vue'] },
  ],

  buildModules: [
    // ['@nuxtjs/eslint-module', {
    //   // extends: ['@antfu'],
    //   exclude: ['node_modules', '.nuxt', 'assets', 'components', 'config', 'layouts',
    //     'locales', 'middleware', 'pages', 'plugins', 'static'],
    //   fix: false,
    // }],
    'vue-ssr-carousel/nuxt',
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
    '@nuxtjs/recaptcha',
    '@nuxt/typescript-build',
    ['@nuxtjs/robots'],
    ['@nuxt/http'],
    '@nuxtjs/dayjs',
    '@nuxtjs/style-resources',
    ['@nuxtjs/i18n'],
    'cookie-universal-nuxt',
    '@nuxtjs/sentry',
    '@nuxtjs/gtm',
    '@nuxtjs/sitemap',
  ],

  recaptcha: {
    hideBadge: false, // Boolean, // Hide badge element (v3 & v2 via size=invisible)
    // language: String, // Recaptcha language (v2)
    // mode: String, // Mode: 'base', 'enterprise'
    siteKey: '6LcbdBwlAAAAAGDJdHe5Hzlv09V6OuP2GO-0ysbG', // Site key for requests
    version: 3, // Version
    size: 'compact', // String, // Size: 'compact', 'normal', 'invisible' (v2)
  },

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
            'X-Shopify-Storefront-Access-Token':
              process.env.STOREFRONT_ACCESS_TOKEN,
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
    detectBrowserLanguage: false,
    locales: storeLocales(process.env.STORE),
    defaultLocale: process.env.DEFAULT_LOCALE,
    lazy: true,
    langDir: 'locales/',
    parsePages: false,
    pages: {
      'winery/index': {
        it: '/cantina',
        en: '/winery',
        fr: '/domaine',
        de: '/weinkellerei',
      },
      'winery/_handle': {
        it: '/cantina/:handle',
        en: '/winery/:handle',
        fr: '/domaine/:handle',
        de: '/weinkellerei/:handle',
      },
    },
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
    disabled: process.env.DEPLOY_ENV !== 'prod',
    config: {
      browserTracing: {
        // tracePropagationTargets: ['callmewine.co.uk'],
      },
      vueOptions: {
        trackComponents: true,
      },
      tracesSampleRate: 1.0,
    },
    clientIntegrations: {
      Replay: {},
    },
    clientConfig: {
      // This sets the sample rate to be 10%. You may want this to be 100% while
      // in development and sample at a lower rate in production
      replaysSessionSampleRate: 0.1,
      // If the entire session is not sampled, use the below sample rate to sample
      // sessions when an error occurs.
      replaysOnErrorSampleRate: 1.0,
    },
  },

  router: {
    middleware: ['url-checker', 'auth-b2b'],
    prefetchLinks: false,
    linkPrefetchedClass: 'nuxt-link-prefetched',
    extendRoutes(routes, resolve) {
      const validCategoriesFilterLetters = 'V|C|R|D|B|N|M|A|F'
      routes.push(
        {
          name: 'search',
          path: `/(.*)-:filter_key_1(${validCategoriesFilterLetters}):filter_id_1(\\d+).htm/`,
          component: resolve(__dirname, 'pages/search/categories.vue'),
          meta: { actionField: 'category' },
        },
        {
          name: 'search-deep',
          path: `/(.*)-:filter_key_1(${validCategoriesFilterLetters}):filter_id_1(\\d+):filter_key_2(${validCategoriesFilterLetters}):filter_id_2(\\d+).htm/`,
          component: resolve(__dirname, 'pages/search/categories.vue'),
          meta: { actionField: 'category' },
        },
        {
          name: 'search-deep-deep',
          path: `/(.*)-:filter_key_1(${validCategoriesFilterLetters}):filter_id_1(\\d+):filter_key_2(${validCategoriesFilterLetters}):filter_id_2(\\d+):filter_key_3(${validCategoriesFilterLetters}):filter_id_3(\\d+).htm/`,
          component: resolve(__dirname, 'pages/search/categories.vue'),
          meta: { actionField: 'category' },
        },
        {
          name: 'catalog',
          path: '/catalog',
          component: resolve(__dirname, 'pages/search/categories.vue'),
          meta: { actionField: 'category' },
        },
        {
          name: 'product',
          path: '/(.*)-P:id(\\d+).htm/',
          component: resolve(__dirname, 'pages/product/details.vue'),
          meta: { actionField: 'related_products' },
        },
      )
    },
  },

  build: {
    publicPath: '/_cmw/',
    transpile: [
      '@prismicio/vue',
      '@vercel/kv',
      '/@upstash/redis',
      'swiper',
      'vue-svg-icon',
      'vee-validate/dist/rules',
      'vee-validate/dist/locale/de.json',
      'vee-validate/dist/locale/en.json',
      'vee-validate/dist/locale/fr.json',
      'vee-validate/dist/locale/it.json',
    ],
    extend(config) {
      const svgFilePath = join(__dirname, 'assets')
      const imageLoaderRule = config.module.rules.find(
        rule => rule.test && rule.test.test('.svg'),
      )
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
    fontsPath:
      process.env.NODE_ENV === 'production' ? '~assets/fonts' : undefined,
    families: {
      'Open Sans': {
        wght: [300, 400, 600, 700],
      },
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
    enabled:
      process.env.DEPLOY_ENV === 'prod' || process.env.DEPLOY_ENV === 'staging',
    pageTracking: false,
    pageViewEventName: 'nuxtRoute',
    autoInit:
      process.env.DEPLOY_ENV === 'prod' || process.env.DEPLOY_ENV === 'staging',
    debug: !process.env.DEPLOY_ENV || process.env.DEPLOY_ENV === 'dev',
  },

  env: {
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_URL: process.env.KV_URL,
    NX_DAEMON: process.env.NX_DAEMON,
    TURBO_REMOTE_ONLY: process.env.TURBO_REMOTE_ONLY,
    TURBO_RUN_SUMMARY: process.env.TURBO_RUN_SUMMARY,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
  },

  publicRuntimeConfig: {
    CMW_API: process.env.CMW_API,
    CMW_API_KEY: process.env.CMW_API_KEY,
    DEPLOY_ENV: process.env.DEPLOY_ENV,
    DOMAIN: process.env.DOMAIN,
    ELASTIC_URL: process.env.ELASTIC_URL,
    MULTIPASS_URL: process.env.MULTIPASS_URL,
    SALECHANNEL: process.env.SALECHANNEL,
    STORE: process.env.STORE,
    STOREFRONT_ACCESS_TOKEN: process.env.STOREFRONT_ACCESS_TOKEN,
    gtm: {
      id: process.env.GOOGLE_TAG_MANAGER_ID,
    },
    recaptcha: {
      /* reCAPTCHA options */
      hideBadge: false, // Boolean, // Hide badge element (v3 & v2 via size=invisible)
      // language: String, // Recaptcha language (v2)
      // mode: String, // Mode: 'base', 'enterprise'
      siteKey: '6LcbdBwlAAAAAGDJdHe5Hzlv09V6OuP2GO-0ysbG', // Site key for requests
      version: 3, // Version
      size: 'compact', // String, // Size: 'compact', 'normal', 'invisible' (v2)
    },
  },

  robots: () => {
    const isProd = process.env.DEPLOY_ENV === 'prod'
    const isCMWUKStore = process.env.STORE === 'CMW_UK'

    const commonDisallowPaths = [
      '/catalog',
      '/?search=',
      '/*?search=*',
      '/?search=*',
      '/catalog.htm',
      '/catalog.htm?*',
      '/collections/*',
      '/selections/*',
      '/*catalog.htm',
      '/*catalog.htm?*',
      '/*?pricerange=*',
      '/*?acustom=*',
      '/*?pcustom=*',
      '/*?aid=*',
      '/*?sel=*',
      '/*?mid=*',
      '/*?zid=*',
      '/*?sid=*',
      '/*?fpid=*',
      '/*?fid=*',
      '/*?pid=*',
      '/*?s_id=*',
      '/*sort=*',
      '/notificadisponibilita',
      '/en/notificadisponibilita*',
      '/it/',
    ]

    const disallowPaths = isProd
      ? isCMWUKStore
        ? ['/*?*', '/catalog*']
        : [...commonDisallowPaths]
      : ['/']

    return [
      {
        UserAgent: '*',
        Disallow: ['/*?*', '/*?*=true'],
        Allow: ['*page', '*/wp-content/', '*/wp-includes/'],
      },
      {
        Disallow: disallowPaths,
        ...(isProd && {
          Sitemap: req => `https://${req.headers.host}/sitemap.xml`,
        }),
      },
      {
        UserAgent: 'dotbot',
        Disallow: '/',
      },
      {
        UserAgent: 'DotBot/1.2',
        Disallow: '/',
      },
      {
        UserAgent: 'BLEXBot/1.0',
        Disallow: '/',
      },
      {
        UserAgent: 'PetalBot',
        Disallow: '/',
      },
      {
        UserAgent: 'DataForSeoBot/1.0',
        Disallow: '/',
      },
    ]
  },
}

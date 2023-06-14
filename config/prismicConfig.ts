import type { TISO639, TStores } from '~/config/themeConfig'

export type TPrismicIsoCodes = 'it-it' | 'it-bn' | 'en-eu' | 'en-gb' | 'fr-fr' | 'de-de'
export type TPrismicComponents =
  | 'aboutUs'
  | 'callToAction'
  | 'cookiePage'
  | 'contactPage'
  | 'conditionsPage'
  | 'footer'
  | 'homeCarousel'
  | 'homeBanner'
  | 'homeBoxes'
  | 'megaMenu'
  | 'producers'
  | 'shipping'
  | 'shippingPage'
  | 'selections'
  | 'paymentsPage'
  | 'partners'
  | 'privacyPage'
  | 'topbar'
  | 'wineShops'

type TPrismicIsoMap = {
  [k in TISO639]?: TPrismicIsoCodes
}

type TPrismicComponentsMap = {
  [k in TPrismicComponents]?: string
}

interface IPrismicConfig {
  components: TPrismicComponentsMap
  isoCode: TPrismicIsoMap
}

type TPrismicConfig = {
  [k in TStores]?: IPrismicConfig
}

const defaultPrismicComponents: TPrismicComponentsMap = {
  aboutUs: 'about_us',
  callToAction: 'call-to-action',
  cookiePage: 'cookie-policy',
  conditionsPage: 'conditions',
  contactPage: 'contact_us',
  footer: 'footer',
  homeCarousel: 'home-carousel',
  homeBanner: 'HomeBanner',
  megaMenu: 'mega-menu-test',
  partners: 'partners',
  topbar: 'topbar',
  homeBoxes: 'home-boxes',
  producers: 'productors',
  shipping: 'shipping',
  shippingPage: 'shipping-page',
  selections: 'selections',
  paymentsPage: 'payments',
  privacyPage: 'privacy-policy',
  wineShops: 'restaurants-wineshops',
}

const prismicConfig: TPrismicConfig = {
  CMW: {
    components: defaultPrismicComponents,
    isoCode: {
      it: 'it-it',
      en: 'en-eu',
    },
  },
  B2B: {
    components: defaultPrismicComponents,
    isoCode: {
      it: 'it-bn',
    },
  },
  CMW_UK: {
    components: defaultPrismicComponents,
    isoCode: { en: 'en-gb' },
  },
  CMW_FR: {
    components: defaultPrismicComponents,
    isoCode: { fr: 'fr-fr' },
  },
  CMW_DE: {
    components: defaultPrismicComponents,
    isoCode: { de: 'de-de' },
  },
}

// Note: maybe we can rethink this export to gain some performance, that way we could just import necessary
export default prismicConfig

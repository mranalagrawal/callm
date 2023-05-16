import type { TISO639, TStores } from '~/config/themeConfig'

export type TPrismicIsoCodes = 'it-it' | 'it-bn' | 'en-eu' | 'en-gb' | 'fr-fr' | 'de-de'
export type TPrismicComponents =
  | 'aboutUs'
  | 'cookiePage'
  | 'contactPage'
  | 'conditionsPage'
  | 'homeCarousel'
  | 'homeBoxes'
  | 'producers'
  | 'shipping'
  | 'shippingPage'
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
  homeCarousel: 'home-carousel',
  partners: 'partners',
  topbar: 'topbar',
  homeBoxes: 'home-boxes',
  producers: 'productors',
  shipping: 'shipping',
  aboutUs: 'about_us',
  shippingPage: 'shipping-page',
  paymentsPage: 'payments',
  conditionsPage: 'conditions',
  contactPage: 'contact_us',
  privacyPage: 'privacy-policy',
  cookiePage: 'cookie-policy',
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
  WILDVIGNERON: {
    components: {
      homeCarousel: 'wv_home-carousel',
      partners: 'partners',
      topbar: 'wv_topbar',
      homeBoxes: 'wv_home-boxes',
      producers: 'wv_productors',
      shipping: 'wv_shipping',
      aboutUs: 'wv_about_us',
      shippingPage: 'wv_shipping-page',
      paymentsPage: 'wv_payments',
      conditionsPage: 'wv_conditions',
      contactPage: 'wv_contact_us',
      privacyPage: 'wv_privacy-policy',
      cookiePage: 'wv_cookie-policy',
      wineShops: 'wv_restaurants-wineshops',
    },
    isoCode: { it: 'it-it' },
  },
}

export default prismicConfig

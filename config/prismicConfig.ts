import type { IPrismicPageData, TPrismicComponentsMap, TPrismicConfig } from '~/types/prismic'

const defaultPrismicComponents: TPrismicComponentsMap = {
  aboutUs: 'about_us',
  callToAction: 'call-to-action',
  cookiePage: 'cookie-policy',
  conditionsPage: 'conditions',
  contactPage: 'contact_us',
  footer: 'footer',
  homeCarousel: 'home-carousel',
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

const prismicConfig: TPrismicConfig = [
  {
    store: 'CMW',
    components: defaultPrismicComponents,
    isoCode: {
      it: 'it-it',
      en: 'en-eu',
    },
  },
  {
    store: 'B2B',
    components: defaultPrismicComponents,
    isoCode: {
      it: 'it-bn',
    },
  },
  {
    store: 'CMW_UK',
    components: defaultPrismicComponents,
    isoCode: { en: 'en-gb' },
  },
  {
    store: 'CMW_FR',
    components: defaultPrismicComponents,
    isoCode: { fr: 'fr-fr' },
  },
  {
    store: 'CMW_DE',
    components: defaultPrismicComponents,
    isoCode: { de: 'de-de' },
  },
]

const initialPageData: IPrismicPageData = {
  title: '',
  image: {
    alt: '',
    dimensions: {
      height: 0,
      width: 0,
    },
    url: '',
  },
  content: [],
  section: [],
}

export { prismicConfig, initialPageData }

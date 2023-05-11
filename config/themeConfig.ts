import colors from 'windicss/colors'

export type TStores = 'CMW' | 'B2B' | 'CMW_UK' | 'CMW_FR' | 'CMW_DE' | 'WILDVIGNERON'
export type TSalesChannel = 'cmw_it_b2c' | 'cmw_it_b2b' | 'cmw_uk_b2c' | 'cmw_fr_b2c' | 'cmw_de_b2c'
export type TISO639 = 'it' | 'en' | 'fr' | 'de'
export type TPrismicIsoCodes = 'it-it' | 'it-bn' | 'en-eu' | 'en-gb' | 'fr-fr' | 'de-de'
export type TPrismicComponents =
  | 'topbar'
  | 'homeBoxes'
  | 'producers'
  | 'shipping'
  | 'aboutUs'
  | 'shippingPage'
  | 'paymentsPage'
  | 'conditionsPage'
  | 'contactPage'
  | 'privacyPage'
  | 'cookiePage'
  | 'wineShops'

type TPrismicIsoMap = {
  [k in TISO639]?: TPrismicIsoCodes
}

type TPrismicComponentsMap = {
  [k in TPrismicComponents]?: string
}

interface IStoreConfig {
  id: number
  customerType: string
  prismic: {
    components: TPrismicComponentsMap
    isoCode: TPrismicIsoMap
  }
  fonts: {
    sans: string[]
    secondary: string[]
  }
  colors: Record<string, any>
}

type TThemeConfig = {
  [k in TStores]?: IStoreConfig
}

const defaultColors = {
  primary: {
    DEFAULT: '#992545',
    50: '#fae4e8',
    100: '#F3BAC6',
    400: '#d94965',
    900: '#751f3e',
  },
  secondary: {
    DEFAULT: '#10312b',
    800: '#134c45',
    700: '#155B53',
    400: '#2C8982',
    100: '#ADD3D1',
  },
  body: colors.zinc[700],
  success: '#299100',
  error: '#E6362E',
  warning: '#FFB800',
  info: '#69baf1',
}

const defaultPrismicComponents: TPrismicComponentsMap = {
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

const themeConfig: TThemeConfig = {
  CMW: {
    id: 1,
    customerType: 'B2C',
    prismic: {
      components: defaultPrismicComponents,
      isoCode: {
        it: 'it-it',
        en: 'en-eu',
      },
    },
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  B2B: {
    id: 5,
    customerType: 'B2B',
    prismic: {
      components: defaultPrismicComponents,
      isoCode: {
        it: 'it-bn',
      },
    },
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  CMW_UK: {
    id: 2,
    customerType: 'B2C',
    prismic: {
      isoCode: { en: 'en-gb' },
      components: defaultPrismicComponents,
    },
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  CMW_FR: {
    id: 3,
    customerType: 'B2C',
    prismic: {
      components: defaultPrismicComponents,
      isoCode: { fr: 'fr-fr' },
    },
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  CMW_DE: {
    id: 4,
    customerType: 'B2C',
    prismic: {
      components: defaultPrismicComponents,
      isoCode: { de: 'de-de' },
    },
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  WILDVIGNERON: {
    id: 5,
    customerType: 'B2C',
    prismic: {
      components: {
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
    fonts: {
      sans: ['"Readex Pro"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Readex Pro"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: {
      primary: {
        DEFAULT: '#0B4C3C',
        50: '#fae4e8',
        100: '#F3BAC6',
        400: '#d94965',
        900: '#751f3e',
      },
      secondary: {
        DEFAULT: '#10312b',
        800: '#154c44',
        700: '#175b53',
        400: '#2c8982',
        100: '#ADD3D1',
      },
      body: colors.zinc[700],
      success: '#299100',
      error: '#E6362E',
      warning: '#FFB800',
      info: '#69baf1',
    },
  },
}

export default themeConfig

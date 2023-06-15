import colors from 'windicss/colors'
import type { IMoneyV2 } from '~/types/common-objects'

export type TCustomerType = 'B2C' | 'B2B'
export type TStores = 'CMW' | 'B2B' | 'CMW_UK' | 'CMW_FR' | 'CMW_DE'
export type TSalesChannel = 'cmw_it_b2c' | 'cmw_it_b2b' | 'cmw_uk_b2c' | 'cmw_fr_b2c' | 'cmw_de_b2c'
export type TISO639 = 'it' | 'en' | 'fr' | 'de'

export interface ICompanyAddress {
  city: string
  copyright: string
  country: string
  countryCode: string
  description: string
  footer: string
  name: string
  province?: string
  rights?: string
  shareCapital?: IMoneyV2
  street: string
  vatCode: string
  zip: string
}

interface IStoreConfig {
  id: number
  defaultLocale: TISO639
  salesChannel: TSalesChannel
  customerType: TCustomerType
  fonts: {
    sans: string[]
    secondary: string[]
  }
  colors: Record<string, any>
  address: ICompanyAddress
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
const defaultAddress: ICompanyAddress = {
  city: 'Milano',
  copyright: '© Callmewine 2021',
  country: 'Italia',
  countryCode: 'IT',
  description: 'Cam.Com MI REA 1937916 - Società soggetta a direzione e coordinamento di Italmobiliare S.p.A., C.F. 00796400158',
  footer: 'CALLMEWINE S.R.L., Via Lovanio 5, 20121 Milano, Italia. Partita IVA 07130650968, REA 1937916, Società soggetta a direzione e coordinamento di Italmobiliare S.p.A., C.F. 00796400158',
  name: 'CALLMEWINE S.R.L.',
  province: 'MI',
  rights: 'tutti i diritti riservati',
  shareCapital: {
    amount: 12245.92,
    currencyCode: 'EUR',
  },
  street: 'Via Lovanio 5',
  vatCode: '07130650968',
  zip: '20121',
}

const themeConfig: TThemeConfig = {
  CMW: {
    id: 1,
    defaultLocale: 'it',
    salesChannel: 'cmw_it_b2c',
    customerType: 'B2C',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
    address: defaultAddress,
  },
  B2B: {
    id: 5,
    defaultLocale: 'it',
    salesChannel: 'cmw_it_b2b',
    customerType: 'B2B',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
    address: defaultAddress,
  },
  CMW_UK: {
    id: 2,
    defaultLocale: 'en',
    salesChannel: 'cmw_uk_b2c',
    customerType: 'B2C',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
    address: {
      city: 'London',
      copyright: '© Callmewine 2022',
      country: 'United Kingdom',
      countryCode: 'UK',
      description: 'registered in England & Wales under company number 14216917',
      name: 'Callmewine UK Limited',
      street: '167-169 Great Portland Street, 5th Floor',
      vatCode: '429918749',
      zip: 'W1W 5PF',
      footer: '© Callmewine 2022 - Callmewine UK Limited, registered in England & Wales under company number 14216917 and our registered office is at 167-169 Great Portland Street, 5th Floor, L',
    },
  },
  CMW_FR: {
    id: 3,
    defaultLocale: 'fr',
    salesChannel: 'cmw_fr_b2c',
    customerType: 'B2C',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
    address: defaultAddress,
  },
  CMW_DE: {
    id: 4,
    defaultLocale: 'de',
    salesChannel: 'cmw_de_b2c',
    customerType: 'B2C',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
    address: defaultAddress,
  },
}

export default themeConfig

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

export interface IStoreConfig {
  address: ICompanyAddress
  customerType: TCustomerType
  defaultLocale: TISO639
  id: number
  salesChannel: TSalesChannel
  shippingThreshold: number
  store: TStores
  telephone: string
  website: string
}

type TThemeConfig = {
  [k in TStores]?: IStoreConfig
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

// Fixme: convert this to an array to make it easier, we can get the current STORE with id | store
// Fixme: split colors in a way we don't import this on every component

const themeConfig: TThemeConfig = {
  CMW: {
    address: defaultAddress,
    customerType: 'B2C',
    defaultLocale: 'it',
    id: 1,
    salesChannel: 'cmw_it_b2c',
    store: 'CMW',
    telephone: '+39 02 81480430',
    shippingThreshold: 59.90,
    website: 'https://www.callmewine.com',
  },
  B2B: {
    address: defaultAddress,
    customerType: 'B2B',
    defaultLocale: 'it',
    id: 5,
    salesChannel: 'cmw_it_b2b',
    store: 'B2B',
    telephone: '+39 02 81480430',
    shippingThreshold: 285.00,
    website: 'https://b2b.callmewine.com/',
  },
  CMW_UK: {
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
    customerType: 'B2C',
    defaultLocale: 'en',
    id: 2,
    salesChannel: 'cmw_uk_b2c',
    store: 'CMW_UK',
    telephone: '+39 02 81480430',
    shippingThreshold: 129,
    website: 'https://www.callmewine.co.uk',
  },
  CMW_FR: {
    address: defaultAddress,
    customerType: 'B2C',
    defaultLocale: 'fr',
    id: 3,
    salesChannel: 'cmw_fr_b2c',
    store: 'CMW_FR',
    telephone: '+39 02 81480430',
    shippingThreshold: 150,
    website: 'https://www.callmewine.fr',
  },
  CMW_DE: {
    address: defaultAddress,
    customerType: 'B2C',
    defaultLocale: 'de',
    id: 4,
    salesChannel: 'cmw_de_b2c',
    store: 'CMW_DE',
    telephone: '+39 02 81480430',
    shippingThreshold: 150,
    website: 'https://www.callmewine.de',
  },
}

export default themeConfig

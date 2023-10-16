import type { TISO639, TStores } from '~/config/themeConfig'

export type TPrismicIsoCodes = 'it-it' | 'it-bn' | 'en-eu' | 'en-gb' | 'fr-fr' | 'de-de'
export type TPrismicComponentsNames =
  | 'about_us'
  | 'call-to-action'
  | 'conditions'
  | 'contact_us'
  | 'cookie-policy'
  | 'footer'
  | 'footer-info'
  | 'footer-elements'
  | 'footer-test'
  | 'home-boxes'
  | 'home-carousel'
  | 'home-featured'
  | 'mega-menu-test'
  | 'partners'
  | 'payments'
  | 'privacy-policy'
  | 'productors'
  | 'restaurants-wineshops'
  | 'selections'
  | 'shipping'
  | 'shipping-page'
  | 'sustainability'
  | 'topbar'

export type TPrismicComponents =
  | 'aboutUs'
  | 'callToAction'
  | 'conditionsPage'
  | 'contactPage'
  | 'cookiePage'
  | 'footer'
  | 'homeBoxes'
  | 'homeCarousel'
  | 'megaMenu'
  | 'partners'
  | 'paymentsPage'
  | 'privacyPage'
  | 'producers'
  | 'selections'
  | 'shipping'
  | 'shippingPage'
  | 'topbar'
  | 'wineShops'

type TPrismicUid =
  | 'corporate-gifts'
  | 'customer-service'
  | 'guide-to-our-wines'
  | 'footer-elements'
  | 'footer-test'

export interface IPrismicPageParams {
  page: string
  uid?: TPrismicUid
}

export type TPrismicIsoMap = {
  [k in TISO639]?: TPrismicIsoCodes
}

export type TPrismicComponentsMap = {
  [k in TPrismicComponents]?: TPrismicComponentsNames
}

export interface IPrismicConfig {
  store: TStores
  components: TPrismicComponentsMap
  isoCode: TPrismicIsoMap
}

export type TPrismicConfig = IPrismicConfig[]

export interface IPrismicPageData {
  title: string
  image: {
    alt: string
    dimensions: {
      height: number
      width: number
    }
    url: string
  }
  main_banner?: {
    alt: string
    dimensions: {
      height: number
      width: number
    }
    url: string
  }
  section: Record<string, any>
  content: Record<string, any>
  body?: Record<string, any>[]
  box?: Record<string, any>[]
  text?: any
  text_sm?: any
  description?: string
  newsletter_cta?: string
  first_check?: string
  second_check?: string
  info?: string
  subtitle?: string
  cta_button?: string
  cta_link?: string
  shown?: string
  hidden?: string
  productor?: Record<string, any>[]
  featured?: Record<string, any>[]
  label?: string
  threshold?: string
  threshold_not_reached?: string
  threshold_reached?: string
}

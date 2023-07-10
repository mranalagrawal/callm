import type { IMoneyV2 } from '~/types/common-objects'
import type { TImage } from '~/types/types'

export interface IProductRating {
  description: string | null
  id: number
  productFeId: number
  productId: number
  score: number | null
  shopifyCustomerId: number
  shopifyStoreId: number
}

export interface IProductAward {
  id: string | number
  maxValue: string | number
  quote: string
  title: string
  value: string | number
  year: string | number
}

export type TProductFeatures =
  | 'favourite'
  | 'isnew'
  | 'inpromotion'
  | 'isInPromotion'
  | 'foreveryday'
  | 'togift'
  | 'unusualvariety'
  | 'rarewine'
  | 'artisanal'
  | 'organic'
  | 'topsale'

interface IProductSeo {
  description: string
  title: string
}

interface IProductImage {
  thumbnail: TImage
  source: TImage
}

export interface IProductBreadcrumbs {
  handle: string
  label: string
  to: string
}

export interface IBaseProductMapped {
  availableForSale: boolean
  id: string | number
  image: IProductImage
  quantityAvailable: number
  shopify_product_id: string | number
  shopify_product_variant_id: string | number
  title: string
}

export interface IProductMapped extends IBaseProductMapped {
  // availableForSale: boolean
  // awards: []
  // handle: []
  // shopify_product_id: string
  // shopify_product_variant_id: string
  availableFeatures: TProductFeatures[]
  awards: IProductAward[]
  compareAtPrice: IMoneyV2
  descriptionHtml: HTMLElement | string
  details: Record<string, any> // Todo: type this
  gtmProductData: any
  priceLists: Record<string, any>
  seo: IProductSeo
  sku: string
  source_id: string | number
  url: string
}

interface IGiftCardVariantMapped extends IBaseProductMapped {
  compareAtPrice: IMoneyV2
  price: IMoneyV2
}

export interface IGiftCardMapped extends IBaseProductMapped {
  breadcrumbs: IProductBreadcrumbs[]
  description: string
  href: string
  seo: IProductSeo
  variants: IGiftCardVariantMapped[]
}
// export interface TProductAward {
//   id: number
//   title: string
//   value: number
//   maxValue: number
//   year: number
//   quote: Record<string, any> // Todo: Locale
//   type: string
// }

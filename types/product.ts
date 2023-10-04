import type { TranslateResult } from 'vue-i18n'
import type { IMoneyV2, ITranslations } from '~/types/common-objects'
import type { TImage } from '~/types/types'

type TChoice = 'yes' | 'no'
type TStock = 'in_stock' | 'out_of_stock'

export interface IGtmProductData {
  internal_id: string
  stock_id: string
  id: string
  name: string
  brand: string
  category: string
  subcategory: string
  winelist: string
  vintage: string
  favourite: TChoice
  artisanal: TChoice
  rarewine: TChoice
  price: string
  compare_at_price: string
  stock_status: TStock
  quantity: number | string
}

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
  | 'artisanal'
  | 'exclusive'
  | 'favourite'
  | 'foreveryday'
  | 'inpromotion'
  | 'isInPromotion'
  | 'isnew'
  | 'organic'
  | 'rarewine'
  | 'togift'
  | 'topsale'
  | 'unusualvariety'

interface IProductSeo {
  description: string
  title: string
}

interface IProductImage {
  thumbnail: TImage
  source: TImage
  hd?: TImage
}

export interface IProductBreadcrumbs {
  handle: string
  label: TranslateResult
  to: string
}

export interface IDetailsObj {
  id: string | number
  name: ITranslations
  slug?: ITranslations
}

export interface IProductCharacteristics {
  denomination?: ITranslations
  grapes?: ITranslations
  subCategory?: ITranslations
  region?: IDetailsObj
  country?: IDetailsObj
  alcoholContent?: string
  size?: ITranslations
  winemaking?: ITranslations
  agingDescription?: ITranslations
  productionPhilosophies?: IDetailsObj[]
  productInformations?: IDetailsObj[]
  color?: ITranslations
  taste?: ITranslations
  aroma?: ITranslations
  vineyards?: ITranslations
  organic?: boolean
  rarewine?: boolean
  bioOperator?: string
}

export interface IBaseProductMapped {
  availableForSale: boolean
  id: string | number
  image: IProductImage
  isGiftCard: boolean
  merchandiseId: string
  quantityAvailable: number
  shopify_product_id: string | number
  shopify_product_variant_id: string | number
  tags: string[]
  title: string
}

export interface IProductMapped extends IBaseProductMapped {
  milliliters: any
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
  characteristics?: IProductCharacteristics
}

export interface IGiftCardVariantMapped extends IBaseProductMapped {
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

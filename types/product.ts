import type { TranslateResult } from 'vue-i18n'

import type { availableUsersValues } from '~/store/customer'

import type { IMoneyV2 } from '~/types/common-objects'
import type { TImage } from '~/types/types'

type TChoice = 'yes' | 'no'
type TStock = 'in_stock' | 'out_of_stock'

interface SEO {
  description: string
  title: string
}

interface ProductPriceRange {
  maxVariantPrice: IMoneyV2
  minVariantPrice: IMoneyV2
}

export interface IProductPriceList {
  compareAtPrice: IMoneyV2
  lowestPrice: IMoneyV2
  price: IMoneyV2
}

export type ProductPriceByCustomer = Record<availableUsersValues, IProductPriceList>

export interface IShopifyProduct {
  availableForSale: boolean
  compareAtPriceRange: ProductPriceRange
  createdAt: string // DateTime!
  description: string
  descriptionHtml: string // HTML!
  featuredImage: TImage
  handle: string
  id: string // ID!
  isGiftCard: boolean
  // onlineStoreUrl: URL
  // options: [ProductOption!]!
  // priceRange: ProductPriceRange!
  productType: string
  publishedAt: string // DateTime!
  requiresSellingPlan: boolean
  seo: SEO
  tags: string[]
  title: string
  totalInventory: number // Int!
  updatedAt: string // DateTime!
  // variantBySelectedOptions: ProductVariant
  vendor: string
  // MetaFields
  breadcrumbs: { value: string }
  bundle: { value: string }
  details: { value: string }
  priceLists: { value: string }
  // Connections
  variants: {
    nodes: IShopifyProductVariant[]
  }
}

export interface IShopifyProductVariant {
  availableForSale: boolean
  barcode: string
  compareAtPrice: IMoneyV2
  currentlyNotInStock: boolean
  id: string // ID!
  image: TImage
  details: { value: string }
  // metafield: Metafield
  // metafields: String # Todo: [Metafield]!
  price: IMoneyV2
  product: any // TODO: Product
  quantityAvailable?: number
  requiresShipping?: boolean
  selectedOptions?: string // Todo: [selectedOptions!]!
  sku: string
  title: string // Todo: [selectedOptions!]!
  unitPrice?: IMoneyV2
  unitPriceMeasurement?: string // Todo: UnitPriceMeasurement
  weight?: string // TODO: Float
  weightUnit?: string // TODO: WeightUnit
}

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

export interface IBaseProductMapped {
  availableForSale: boolean
  id: string | number
  image: IProductImage | null
  isGiftCard: boolean
  merchandiseId: string
  quantityAvailable: number
  shopify_product_id: string | number | undefined
  shopify_product_variant_id: string | undefined
  tags: string[]
  title: string
}

export interface IProductMapped extends IBaseProductMapped {
  availableFeatures: TProductFeatures[]
  awards: IProductAward[]
  bundle?: {
    product_name: string
    quantity: string
  }[]
  characteristics?: any
  compareAtPrice: IMoneyV2
  descriptionHtml: HTMLElement | string
  details: Record<string, any> // Todo: type this
  gtmProductData: any
  handle: string
  milliliters: any
  priceLists: Partial<ProductPriceByCustomer>
  seo?: IProductSeo
  sku: string
  source_id: string
  tbd?: any
  url: string
  vendor: string
}

export interface IGiftCardVariantMapped extends IBaseProductMapped {
  compareAtPrice: IMoneyV2
  price: IMoneyV2
  gtmProductData: any
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

/* Represents information about the buyer that is interacting with the cart. */
import type { IAttribute } from '~/types/common-objects'
import type { IShopifyProductVariant } from '~/types/product'

interface CartBuyerIdentity {
  /* The country where the buyer is located. */
  countryCode: string // TODO: CountryCode

  /* The customer account associated with the cart. */
  // customer: Customer

  /* An ordered set of delivery addresses tied to the buyer that is interacting with the cart.
   The rank of the preferences is determined by the order of the addresses in the array.
    Preferences can be used to populate relevant fields in the checkout flow. */

  // deliveryAddressPreferences: [DeliveryAddress!]!

  /* The email address of the buyer that is interacting with the cart. */
  email?: string

  /* The phone number of the buyer that is interacting with the cart. */
  // phone: String

  /* A set of wallet preferences tied to the buyer that is interacting with the cart. Preferences can be used to populate relevant payment fields in the checkout flow. */
  // walletPreferences: [String!]!
}

export interface IShopifyBaseCartLine {
  /* An attribute associated with the cart line. */
  // attribute: IAttribute
  /* The attributes associated with the cart line. Attributes are represented as key-value pairs. */
  attributes: IAttribute[]
  /* The cost of the merchandise that the buyer will pay for at checkout. The costs are subject to change and changes will be reflected at checkout. */
  // cost: CartLineCost!
  /* The discounts that have been applied to the cart line. */
  // discountAllocations: [CartDiscountAllocation!]!
  /* A globally-unique ID. */
  id: string // ID!
  /* The merchandise that the buyer intends to purchase. */
  merchandise: IShopifyProductVariant
  /* The quantity of the merchandise that the customer intends to purchase. */
  quantity: number // Int!
  /* The selling plan associated with the cart line and the effect that each selling plan has on variants when they're purchased. */
  // sellingPlanAllocation: SellingPlanAllocation
}

export interface IShopifyCart {
  buyerIdentity: CartBuyerIdentity
  checkoutUrl: Location | undefined
  createdAt: string // DateTime!
  id: string
  lines: { nodes: IShopifyBaseCartLine[] }
  note: string | null
}

export interface ICartLinesMapped {
  attributes: IAttribute[]
  // discountAllocations?: [] // TODO: [DiscountAllocation!]!
  id: string
  quantity: number
  // title: string
  // unitPrice?: IMoneyV2
  merchandise: Record<string, any> // Todo: get right type
  priceLists: Record<string, any> // Todo: get right type
}

export interface ICartMapped {
  // completedAt: string | null
  // email: string
  buyerIdentity: CartBuyerIdentity
  checkoutUrl: Location | undefined
  createdAt: string // DateTime!
  id: string
  lines: ICartLinesMapped[]
  note: string | null
}

export interface IShopifyCartLineInput {
  attributes: IAttribute[]
  merchandiseId: string
  quantity: number
  sellingPlanId?: string
}

export interface IShopifyCartLineUpdateInput {
  attributes: IAttribute[]
  id: string
  merchandiseId: string
  quantity: number
  sellingPlanId?: string
}

// The input fields to create a cart.
export interface IShopifyCartInput {
  attributes?: IAttribute[]
  buyerIdentity?: CartBuyerIdentity
  discountCodes?: string[]
  lines: IShopifyCartLineInput[] // [CartLineInput!]
  metafields?: string // [CartInputMetafieldInput!]
  note?: string
}

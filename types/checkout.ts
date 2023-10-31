import type { IMoneyV2 } from '~/types/common-objects'
import type { IShopifyProductVariant } from '~/types/product'

interface IAttribute {
  key: string
  value: string
}

/* The input fields for the identity of the customer associated with the checkout. */
interface CheckoutBuyerIdentityInput {
/* The country code of one of the shop's enabled countries. For example, CA. Including this field creates a checkout in the specified country's currency. */
  countryCode: string // TODO: CountryCode!
}

export interface IShopifyCheckoutLineItem {
  /* Extra information in the form of an array of Key-Value pairs about the line item. */
  customAttributes: IAttribute[]
  /* The discounts that have been allocated onto the checkout line item by discount applications. */
  discountAllocations?: string // TODO: [DiscountAllocation!]!
  /* A globally-unique ID. */
  id: string // ID!
  /* The quantity of the line item. */
  quantity: number // Int!
  /* Title of the line item. Defaults to the product's title. */
  title: string
  /* Unit price of the line item. */
  unitPrice: IMoneyV2
  /* Product variant of the line item. */
  variant: IShopifyProductVariant
}

export interface IShopifyCheckout {
  /* The gift cards used on the checkout. */
  appliedGiftCards?: string // TODO: [AppliedGiftCard!]!
  /* The available shipping rates for this Checkout. Should only be used when checkout requiresShipping is true and the shipping address is valid. */
  availableShippingRates?: string // TODO: AvailableShippingRates
  /* The identity of the customer associated with the checkout. */
  buyerIdentity: CheckoutBuyerIdentityInput
  /* The date and time when the checkout was completed. */
  completedAt: string // DateTime
  /* The date and time when the checkout was created. */
  createdAt?: string // DateTime!
  /* The currency code for the checkout. */
  currencyCode?: 'EUR' | 'GBP' // CurrencyCode!
  /* A list of extra information that's added to the checkout. */
  customAttributes?: IAttribute[]
  /* The email attached to this checkout. */
  email: string
  /* A globally-unique ID. */
  id: string
  /* A list of line item objects, each one containing information about an item in the checkout. */
  lineItems: {
    nodes: IShopifyCheckoutLineItem[]
  }
  /* The sum of all the prices of all the items in the checkout. Duties, taxes, shipping and discounts excluded. */
  lineItemsSubtotalPrice: IMoneyV2
  /* The note associated with the checkout. */
  note: string
  /* The resulting order from a paid checkout. */
  // order: Order
  /* The Order Status Page for this Checkout, null when checkout isn't completed. */
  // orderStatusUrl: URL
  /* The amount left to be paid. This is equal to the cost of the line items, taxes and shipping minus discounts and gift cards. */
  // paymentDue: MoneyV2!
  /* Whether or not the Checkout is ready and can be completed. Checkouts may have asynchronous operations that can take time to finish.
    If you want to complete a checkout or ensure all the fields are populated and up to date, polling is required until the value is true. */
  // ready: Boolean!
  /* States whether or not the fulfillment requires shipping. */
  // requiresShipping: Boolean!
  /* The shipping address to where the line items will be shipped. */
  // shippingAddress: MailingAddress
  /* The discounts that have been allocated onto the shipping line by discount applications. */
  // shippingDiscountAllocations: [DiscountAllocation!]!
  /* Once a shipping rate is selected by the customer it's transitioned to a shipping_line object. */
  // shippingLine: String # TODO ShippingRate
  /* The price at checkout before shipping and taxes. */
  // subtotalPrice: MoneyV2!
  /* Whether the checkout is tax exempt. */
  // taxExempt: Boolean!
  /* Whether taxes are included in the line item and shipping line prices. */
  // taxesIncluded: Boolean!
  /* The sum of all the duties applied to the line items in the checkout. */
  // totalDuties: MoneyV2
  /* The sum of all the prices of all the items in the checkout, including taxes and duties. */
  // totalPrice: MoneyV2!
  /* The sum of all the taxes applied to the line items and shipping lines in the checkout. */
  // totalTax: MoneyV2!
  /* The date and time when the checkout was last updated. */
  // updatedAt: DateTime!
  /* The url pointing to the checkout accessible from the web. */
  webUrl: Location | string | undefined // URL!
  /* # Connections
  discountApplications(first: Int, reverse: Boolean):OrderDiscountApplicationsConnection
  lineItems(first: Int, reverse: Boolean):CheckoutLineItemConnection */
}

export interface ICheckoutLineItemMapped {
  customAttributes: IAttribute[]
  discountAllocations?: [] // TODO: [DiscountAllocation!]!
  id: string
  quantity: number
  title: string
  unitPrice?: IMoneyV2
  variant: Record<string, any> // Todo: get right type
  priceLists: Record<string, any> // Todo: get right type
}

export interface CheckoutMapped {
  buyerIdentity: {
    countryCode: string
  }
  completedAt: string | null
  email: string
  id: string
  lineItems: ICheckoutLineItemMapped[]
  note: string | null
  webUrl: Location | undefined
}

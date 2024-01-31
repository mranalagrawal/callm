import type { IMailingAddress } from '~/types/mailingAddress'
import type { IMoneyV2 } from '~/types/common-objects'

export interface ICartLineItem {
  id: string
  gtmProductData: any
  image: string
  productVariantId: string
  quantity: number
  title: string
  totalInventory: string | number
  singleAmount: string | number
  singleAmountFullPrice: string | number
  merchandise: Record<string, any>
}

export interface ILineItem {
  currentQuantity: number
  customAttributes: [] // [Attribute!]!
  discountAllocations: [] // [DiscountAllocation!]!
  discountedTotalPrice: IMoneyV2
  originalTotalPrice: IMoneyV2
  quantity: number
  title: string
  variant: Record<string, any> // Todo: get right type
}

export interface IOrder {
  billingAddress: IMailingAddress
  cancelReasonTodo: string // # Todo: OrderCancelReason
  canceledAt: string // String # Todo: DateTime
  currencyCode: string // String # Todo: CurrencyCode!
  currentSubtotalPrice: IMoneyV2
  currentTotalDuties: IMoneyV2
  currentTotalPrice: IMoneyV2
  currentTotalTax: IMoneyV2
  customerLocale: string // String
  customerUrl: string // String # Todo: URL
  edited: boolean
  email: string // String
  financialStatus: string // String # Todo: OrderFinancialStatus
  fulfillmentStatus: string // String # Todo: OrderFulfillmentStatus!
  id: string // ID!
  metafield: string // String # Todo: Metafield
  metafields: string // String # Todo: [Metafield]!
  name: string // String!
  orderNumber: number
  originalTotalDuties: IMoneyV2
  originalTotalPrice: IMoneyV2
  phone: string // String
  processedAt: string // String # Todo: DateTime!
  shippingAddress: IMailingAddress
  shippingDiscountAllocations: string // String # Todo: [DiscountAllocation!]!
  statusUrl: string // String # Todo: URL!
  subtotalPrice: IMoneyV2
  successfulFulfillments: string // String #Todo: [Fulfillment!]
  totalPrice: IMoneyV2
  totalRefundedV2: IMoneyV2
  totalShippingPrice: IMoneyV2
  totalTaxV2: IMoneyV2
  lineItems: { nodes: ILineItem[] }
  discountApplications: any
  sourceTrackingNumber: any
}

import type { IBillingAddress, IMailingAddress } from '~/types/mailingAddress'
import type { IShopifyCart } from '~/types/cart'

enum CustomerErrorCode {
  ALREADY_ENABLED,
  BAD_DOMAIN,
  BLANK,
  CONTAINS_HTML_TAGS,
  CONTAINS_URL,
  CUSTOMER_DISABLED,
  INVALID,
  INVALID_MULTIPASS_REQUEST,
  NOT_FOUND,
  PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE,
  TAKEN,
  TOKEN_INVALID,
  TOO_LONG,
  TOO_SHORT,
  UNIDENTIFIED_CUSTOMER,
}

export interface ICustomerUserError {
  code: CustomerErrorCode
  field: string[]
  message: string
}

export interface IShopifyCustomer {
  // metafield(namespace:string!,key:string!): Metafield
  // metafields: [Metafield]!
  // updatedAt: DateTime!
  acceptsMarketing: boolean
  amountSpent: { value: string }
  approved: { value: string }
  billing: { value: string }
  createdAt: Date
  defaultAddress: IMailingAddress | null
  displayName: string
  email: string
  firstName: string
  id: string
  isCheckoutMigrated: { value: string }
  lastIncompleteCart: { value: string }
  lastIncompleteCheckout: { id: string }
  lastName: string
  newsletterFrequency: { value: string }
  numberOfOrders: string
  phone: string
  tags: string[]
//   addresses(first: Int, reverse: Boolean):MailingAddressConnection
//   orders(first: Int, reverse: Boolean, query: string):OrderConnection
// // Connections
}

export interface IMappedCustomer {
  acceptsMarketing: boolean
  amountSpent: string
  approved: boolean
  billing: IBillingAddress | null
  createdAt: Date | string | undefined
  defaultAddress: IMailingAddress | null
  email: string
  firstName: string
  id: string
  isCheckoutMigrated: boolean
  lastIncompleteCart: IShopifyCart | null
  lastIncompleteCheckout: string
  lastName: string
  newsletterFrequency: string
  numberOfOrders: string
  phone: string
  tags: string[]
}

export interface IEditingCustomer {
  acceptsMarketing: boolean
  email: string
  firstName: string
  lastName: string
  password: string
  phone: string
}

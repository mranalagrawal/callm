import { defineStore } from 'pinia'

import { useCheckout } from '~/store/checkout'
import type { availableUsersValues } from '~/store/customer'
import { useCustomer } from '~/store/customer'

import type { TSalesChannel } from '~/config/themeConfig'
import cartCreate from '~/graphql/mutations/cart/cartCreate.graphql'
import cartLinesAdd from '~/graphql/mutations/cart/cartLinesAdd.graphql'
import cartLinesRemove from '~/graphql/mutations/cart/cartLinesRemove.graphql'
import cartLinesUpdate from '~/graphql/mutations/cart/cartLinesUpdate.graphql'
import cartNoteUpdate from '~/graphql/mutations/cartNoteUpdate.graphql'
import getProductsById from '~/graphql/queries/getProductsById.graphql'
import type { ICartLinesMapped, ICartMapped, IShopifyCart, IShopifyCartInput, IShopifyCartLineInput, IShopifyCartLineUpdateInput } from '~/types/cart'
import type { IShopifyCheckout } from '~/types/checkout'
import type { IProductMapped } from '~/types/product'
import { getCountryFromStore } from '~/utilities/currency'
import { getCheckoutHostname, getCustomerId } from '~/utilities/shopify'
import { awaitPromise } from '~/utilities/strings'
import { SweetAlertToast } from '~/utilities/Swal'

interface IState {
  cart: ICartMapped
  suitableGift: IProductMapped | undefined
}

const parseGtmProductData = (item: IShopifyCartLineInput | ICartLinesMapped) => {
  const gtmProductData = item.attributes
    .find(el => el.key === 'gtmProductData' || el.key === '_gtmProductData')

  if (gtmProductData) {
    return JSON.parse(gtmProductData.value)
  } else {
    return { id: 'missing gtmProductData' }
  }
}

export const useCart = defineStore({
  id: 'cart',
  state: () => <IState>({
    cart: {
      buyerIdentity: {
        countryCode: '',
        email: '',
      },
      checkoutUrl: undefined,
      createdAt: '',
      id: '',
      lines: [],
      note: null,
    },
    suitableGift: undefined,
  }),

  getters: {
    cartTotalQuantity(state) {
      return state.cart.lines?.reduce((t, n) => t + n.quantity, 0) || 0
    },

    cartTotalPrice(state) {
      return (salesChannel: TSalesChannel, customerType: availableUsersValues) => {
        let cartLines = []

        if (!state.cart?.lines?.length) { return 0 }

        cartLines = state.cart.lines.map(n => ({
          quantity: n.quantity,
          price: !n.merchandise.product.isGiftCard
            ? JSON.parse(n.merchandise.product.details.value)
              .priceLists[salesChannel][customerType]
            : n.merchandise.price.amount,
        })) || []

        const subtotal = cartLines.reduce((t, n) => t + n.quantity * n.price, 0)

        let giftTotal = 0
        // If the suitableGift is in the checkout lines, sum their price
        // runs a loop to subtract all the suitableGift lines
        if (this.cart.lines.length) {
          for (const line of this.cart.lines) {
            const customAttribute = line.attributes.find(el => el.key === 'gift')
            if (customAttribute) {
              giftTotal += Number(line.priceLists[customerType]?.price?.amount) * line.quantity
            }
          }
        }

        return subtotal - giftTotal
      }
    },
  },

  actions: {
    setMappedCart(cart: IShopifyCart) {
      const cartMapped: ICartMapped = {
        buyerIdentity: cart.buyerIdentity,
        checkoutUrl: cart.checkoutUrl,
        createdAt: cart.createdAt,
        id: cart.id,
        lines: cart.lines.nodes.map(line => ({
          attributes: line.attributes,
          id: line.id,
          quantity: line.quantity,
          title: line.merchandise.title,
          merchandise: line.merchandise,
          priceLists: JSON.parse(line.merchandise.product.priceLists?.value || '{}'),
        })),
        note: cart.note,
      }

      this.$patch({ cart: cartMapped })

      this.setCartIdCookie(cart.id, cart.createdAt)
    },

    async checkSuitableGift(cart: IShopifyCart) {
      const lines_items = cart.lines.nodes.map(line => ({
        product_name: line.merchandise.product.title,
        product_id: `${line.merchandise.product.id}`.substring(`${line.merchandise.product.id}`.lastIndexOf('/') + 1),
        variant_id: `${line.merchandise.id}`.substring(`${line.merchandise.id}`.lastIndexOf('/') + 1),
        quantity: line.quantity,
        price: line.merchandise.price.amount,
      }))

      if (!lines_items.length) { return }

      await this.$nuxt.$cmw.$post('/checkouts/discounts/gift-eligible', {
        lines_items,
      })
        .then(async (response: any) => {
          const { data, responseCode } = response

          if (responseCode === 0) {
            if (data && (data.type.toLowerCase() === 'gift')) {
              if (data.eligibles?.length) {
                await this.$nuxt.$graphql.default.request(getProductsById, {
                  lang: this.$nuxt.i18n.locale.toUpperCase(),
                  id: data.eligibles[0].id,
                })
                  .then(async ({ product }) => {
                    if (product) {
                      const suitableGift = this.$nuxt.$productMapping.fromShopify([product])[0]
                      // @ts-expect-error TODO: fix this type
                      this.$patch({ suitableGift })
                    }
                  })
              }
            } else {
              // If the suitableGift is in the checkout lines, remove it
              // run a loop to remove all the suitableGift lines
              if (this.cart.lines.length) {
                for (const line of this.cart.lines) {
                  const customAttribute = line.attributes.find(el => el.key === 'gift')
                  if (customAttribute) {
                    await this.cartLinesRemove(this.cart.id, [line])
                  }
                }
              }

              this.$patch({ suitableGift: undefined })
            }
          }
        })
    },

    async goToCheckout() {
      const { customer } = useCustomer()

      if (this.cart.note) {
        await this.cartNoteUpdate(this.cart.note)
      }

      let redirectUrl = this.cart?.checkoutUrl

      if (!redirectUrl) { return }

      if (!customer.id && typeof window !== 'undefined' && redirectUrl) {
        const url = new URL(redirectUrl.toString())
        url.hostname = new URL(getCheckoutHostname(this.$nuxt.$cmwStore)).hostname

        window.location.href = url.toString()
        return
      }

      try {
        const res: any = await this.$nuxt.$elastic.$post('/checkout', {
          customerAccessToken: this.$nuxt.$cookieHelpers.getToken(),
          store: this.$nuxt.$config.STORE,
          checkoutUrl: redirectUrl,
          email: customer.email,
        })

        redirectUrl = res.link
      } catch (error) {
        this.$nuxt.$handleApiErrors(`Catch on checkout: ${error}`)
      }

      if (!redirectUrl) { return }

      window.location.href = redirectUrl.toString()
    },

    async cartCreate(input: IShopifyCartInput) {
      await this.$nuxt.$graphql.default
        .request(cartCreate, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          input,
        })
        .then(async ({ cartCreate }) => {
          const { cart, userErrors } = cartCreate

          if (!userErrors.length) {
            this.setMappedCart(cart)
            await this.saveCartOnCustomerMetafield(cart)
          } else {
            const { field } = userErrors[0]

            // Check if the property field array contains 'quantity'
            if (field.includes('quantity') && cart?.id) {
              // Retry cartCreate with the quantity of the lineItems reduced by limit
              await this.getCartById(cart.id)
            }
          }
        })
    },

    async handleTemporaryCheckoutReplace(id: string) {
      await this.$nuxt.$cmwRepo.customer.getCheckout(id)
        .then(({ node }: any) => {
          if (!node || node.completedAt) {
            this.$nuxt.$cookies.remove('checkoutId')
            return
          }
          this.mutateShopifyCheckoutIntoCart(node)
        })
    },

    async mutateShopifyCheckoutIntoCart(checkout: IShopifyCheckout) {
      const lines = checkout.lineItems.nodes?.map(line => ({
        attributes: line.customAttributes,
        quantity: line.quantity,
        merchandiseId: line.variant.id,
      }))
      const { customer } = useCustomer()

      const cartInput: IShopifyCartInput = {
        buyerIdentity: {
          countryCode: getCountryFromStore(this.$nuxt.$cmwStore.settings.store),
          ...(customer.email && { email: customer.email }),
        },
        lines,
        note: checkout.note,
      }

      await this.cartCreate(cartInput)
      this.$nuxt.$cookies.remove('checkoutId')
    },

    /**
       * Create a function that merges a cart from cartIdCookie and a cart from checkoutId (checkoutOnCookie and cartIdCookie)
       * Control if the lineItems are the same, if not, use cartLinesAdd to add the lineItems to the checkout
       * If the lineItems are the same, sum the quantity of both lineItems and use cartNoteUpdate to update the quantity
      */
    async mergeCartCookieWithCheckoutId(checkoutId: string, cartIdCookie: string) {
      const { node: checkoutOnCookie } = await this.$nuxt.$cmwRepo.customer.getCheckout(checkoutId)

      if (!checkoutOnCookie) { return }

      const { cart: cartOnCookie } = await this.$nuxt.$cmwRepo.customer.getCart(cartIdCookie)

      if (!cartOnCookie) { return }

      // Create a cartInput with the lineItems of the checkoutOnCookie
      const linesOfCheckoutOnCookie = checkoutOnCookie.lineItems.nodes?.map((line: any) => ({
        attributes: line.customAttributes,
        quantity: line.quantity,
        merchandiseId: line.variant.id,
      }))

      const CheckoutOnCookieCartInput = {
        buyerIdentity: checkoutOnCookie.buyerIdentity,
        lines: linesOfCheckoutOnCookie,
        note: checkoutOnCookie.note,
      }

      // Create a cartInput with the lineItems of the cartOnCookie
      const linesOfCartOnCookie = cartOnCookie.lines?.nodes?.map((line: any) => ({
        attributes: line.attributes,
        quantity: line.quantity,
        merchandiseId: line.merchandise.id,
      }))

      const cartOnCookieCartInput = {
        buyerIdentity: cartOnCookie.buyerIdentity,
        lines: linesOfCartOnCookie,
        note: cartOnCookie.note,
      }

      // Merge this two cartInputs into one merging possible duplicates
      // Merge the lineItems from both carts while avoiding duplicates
      const mergedCartLines = cartOnCookieCartInput.lines.reduce((acc: any, line: any) => {
        // Check if the line already exists in the accumulator
        const existingLine = acc.find((l: any) => l.merchandiseId === line.merchandiseId)

        // If it exists, update the quantity; otherwise, add the line
        if (existingLine) {
          existingLine.quantity += line.quantity
        } else {
          acc.push(line)
        }

        return acc
      }, [...CheckoutOnCookieCartInput.lines]) // Use the initial value as a copy of CheckoutOnCookieCartInput.lines

      const mergedCartInput = {
        buyerIdentity: checkoutOnCookie.buyerIdentity,
        lines: mergedCartLines,
        note: checkoutOnCookie.note,
      }

      // Create a new cart with the mergedCartInput
      await this.cartCreate(mergedCartInput)
    },

    async mergeCartCookieWithLastIncompleteCart(lastIncompleteCart: IShopifyCart, cartIdCookie: string) {
      if (!lastIncompleteCart) { return }

      const { cart: cartOnCookie } = await this.$nuxt.$cmwRepo.customer.getCart(cartIdCookie)

      if (!cartOnCookie) { return }

      // Create a cartInput with the lineItems of the lastIncompleteCart
      const linesOfLastIncompleteCart = lastIncompleteCart.lines.nodes?.map(line => ({
        attributes: line.attributes,
        quantity: line.quantity,
        merchandiseId: line.merchandise.id,
      }))

      const CheckoutOnCookieCartInput = {
        buyerIdentity: lastIncompleteCart.buyerIdentity,
        lines: linesOfLastIncompleteCart,
        note: lastIncompleteCart.note,
      }

      // Create a cartInput with the lineItems of the cartOnCookie
      const linesOfCartOnCookie = cartOnCookie.lines?.nodes?.map((line: any) => ({
        attributes: line.attributes,
        quantity: line.quantity,
        merchandiseId: line.merchandise.id,
      }))

      const cartOnCookieCartInput = {
        buyerIdentity: cartOnCookie.buyerIdentity,
        lines: linesOfCartOnCookie,
        note: cartOnCookie.note,
      }

      // Merge this two cartInputs into one merging possible duplicates
      // Merge the lineItems from both carts while avoiding duplicates
      const mergedCartLines = cartOnCookieCartInput.lines.reduce((acc: any, line: any) => {
        // Check if the line already exists in the accumulator
        const existingLine = acc.find((l: any) => l.merchandiseId === line.merchandiseId)

        // If it exists, update the quantity; otherwise, add the line
        if (existingLine) {
          existingLine.quantity += line.quantity
        } else {
          acc.push(line)
        }

        return acc
      }, [...CheckoutOnCookieCartInput.lines]) // Use the initial value as a copy of CheckoutOnCookieCartInput.lines

      const mergedCartInput: IShopifyCartInput = {
        buyerIdentity: lastIncompleteCart.buyerIdentity,
        lines: mergedCartLines,
        note: lastIncompleteCart.note ?? '',
      }

      // Create a new cart with the mergedCartInput
      await this.cartCreate(mergedCartInput)
    },

    async cartLinesAdd(cartId: string, lines: IShopifyCartInput['lines']) {
      await this.$nuxt.$graphql.default
        .request(cartLinesAdd, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          cartId,
          lines,
        })
        .then(({ cartLinesAdd }) => {
          const { cart, userErrors } = cartLinesAdd

          if (!userErrors.length) {
            this.setMappedCart(cart)
            this.checkSuitableGift(cart)
            this.saveCartOnCustomerMetafield(cart)

            this.$nuxt.$gtm.push({
              event: 'addToCart',
              ecommerce: {
                currencyCode: this.$nuxt.$cmwStore.isUk ? 'GBP' : 'EUR',
                add: {
                  products: lines.map(item => parseGtmProductData(item)),
                },
              },
            })

            this.$nuxt.$cmwGtmUtils.resetDatalayerSpecificField('ecommerce')
          }
        })
    },

    async cartLinesUpdate(cartId: string, lines: IShopifyCartLineUpdateInput[], isRemoving = false) {
      await this.$nuxt.$graphql.default
        .request(cartLinesUpdate, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          cartId,
          lines,
        })
        .then(({ cartLinesUpdate }) => {
          const { cart, userErrors } = cartLinesUpdate

          if (!userErrors.length) {
            this.setMappedCart(cart)
            this.checkSuitableGift(cart)
            this.saveCartOnCustomerMetafield(cart)

            this.$nuxt.$gtm.push({
              event: isRemoving ? 'removeFromCart' : 'addToCart',
              ecommerce: {
                currencyCode: this.$nuxt.$cmwStore.isUk ? 'GBP' : 'EUR',
                add: {
                  products: lines.map(item => parseGtmProductData(item)),
                },
              },
            })

            this.$nuxt.$cmwGtmUtils.resetDatalayerSpecificField('ecommerce')
          }
        })
    },

    async cartLinesRemove(cartId: string, cartLines: ICartLinesMapped[]) {
      const lineIds = cartLines.map((item: any) => item.id)

      await this.$nuxt.$graphql.default
        .request(cartLinesRemove, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          cartId,
          lineIds,
        })
        .then(({ cartLinesRemove }) => {
          const { cart, userErrors } = cartLinesRemove

          if (!userErrors.length) {
            this.setMappedCart(cart)
            this.checkSuitableGift(cart)
            this.saveCartOnCustomerMetafield(cart)

            this.$nuxt.$gtm.push({
              event: 'removeFromCart',
              ecommerce: {
                currencyCode: this.$nuxt.$cmwStore.isUk ? 'GBP' : 'EUR',
                remove: {
                  products: cartLines.map(item => parseGtmProductData(item)),
                },
              },
            })
          }
        })
    },

    async cartNoteUpdate(note = '') {
      const cartId = this.cart.id
      if (!note || !cartId) { return }

      await this.$nuxt.$graphql.default
        .request(cartNoteUpdate, { cartId, note })
        .then(({ cartNoteUpdate: { cart, userErrors } }) => {
          if (!userErrors.length) {
            // Success
            this.$patch({
              cart: {
                ...this.cart,
                note: cart.note,
              },
            })
          } else {
            SweetAlertToast.fire({
              icon: 'error',
              text: userErrors[0].message,
            })
          }
        })
    },

    async getCartById(id: IShopifyCart['id']) {
      await this.$nuxt.$cmwRepo.customer.getCart(id)
        .then(({ cart }: any) => {
          if (!cart?.id) {
            this.$nuxt.$cookies.remove('cartId')
            return
          }

          const emptyAttribute = cart.lines.nodes.some((line: any) => !line.attributes.length)

          if (emptyAttribute) {
            this.fillCartLineAttributes(cart)
          } else {
            this.setMappedCart(cart)
            this.checkSuitableGift(cart)
            this.saveCartOnCustomerMetafield(cart)
          }
        })
    },

    fillCartLineAttributes(cart: IShopifyCart) {
      const updatedCartLinesInput: IShopifyCartLineUpdateInput[] = cart.lines.nodes.map(line => ({
        attributes: !line.attributes.length
          ? [
              {
                key: 'bundle',
                value: (line.merchandise.product?.tags.includes('BUNDLE')).toString(),
              },
            ]
          : line.attributes,
        id: line.id,
        quantity: line.quantity,
        merchandiseId: line.merchandise.id,
      }))

      this.cartLinesUpdate(cart.id, updatedCartLinesInput)
    },

    async saveCartOnCustomerMetafield(cart: IShopifyCart) {
      const customerStore = useCustomer()
      const { customer } = customerStore

      if (!customer.id) { return }

      const customerAccessToken = this.$nuxt.$cookieHelpers.getToken()
      const customerId = getCustomerId(customer.id)
      this.$nuxt.$cmw.setHeader('X-Shopify-Customer-Access-Token', customerAccessToken)

      await this.$nuxt.$cmw.$post(`/customers/${customerId}/last-incomplete-cart`, {
        ...cart,
      }).then((response: any) => {
        const { data, responseCode } = response

        if (responseCode === 0) {
          if (data?.metafield?.value) {
            customerStore.$patch({
              customer: {
                ...customer,
                lastIncompleteCart: JSON.parse(data.metafield.value),
              },
            })
          }
        }
      })
    },

    async getInitialCart() {
      const customerStore = useCustomer()
      const cartIdCookie = this.$nuxt.$cookies.get('cartId')
      const customerId = await awaitPromise(10).then(() => getCustomerId(customerStore.customer.id))

      if (cartIdCookie) {
        if (customerStore.customer.lastIncompleteCheckout && !customerStore.customer.isCheckoutMigrated) {
          await this.mergeCartCookieWithCheckoutId(customerStore.customer.lastIncompleteCheckout, cartIdCookie)
          await this.$nuxt.$cmw.$post(`/customers/${customerId}/set-checkout-migrated`)
        } else if (customerStore.customer.lastIncompleteCart?.id && customerStore.customer.lastIncompleteCart?.id !== cartIdCookie) {
          await this.mergeCartCookieWithLastIncompleteCart(customerStore.customer.lastIncompleteCart, cartIdCookie)
        } else {
          await this.getCartById(cartIdCookie)
        }
      } else {
        if (customerStore.customer.lastIncompleteCheckout
          && !customerStore.customer.lastIncompleteCart?.id
          && !customerStore.customer.isCheckoutMigrated) {
          const checkout = await useCheckout().getCheckoutById(customerStore.customer.lastIncompleteCheckout)

          if (checkout) {
            await this.mutateShopifyCheckoutIntoCart(checkout)
            await this.$nuxt.$cmw.$post(`/customers/${customerId}/set-checkout-migrated`)
          }
        } else if (customerStore.customer.lastIncompleteCart?.id) {
          await this.getCartById(customerStore.customer.lastIncompleteCart.id)
        }
      }
    },

    setCartIdCookie(id: IShopifyCart['id'], createdAt: IShopifyCart['createdAt']) {
      const createdAtTimestamp = new Date(createdAt).getTime() // Convert createdAt to milliseconds
      const expiresTimestamp = createdAtTimestamp + (10 * 24 * 60 * 60 * 1000) // Add 10 days in milliseconds

      const expires = new Date(expiresTimestamp)
      const currentDate = new Date()
      const maxAge = Math.floor((expires.getTime() - currentDate.getTime()) / 1000)

      // Note: we should encrypt the cart cookie
      this.$nuxt.$cookies.set('cartId', id, {
        path: '/',
        maxAge,
        sameSite: 'none',
        secure: true,
        expires,
      })
    },
  },

})

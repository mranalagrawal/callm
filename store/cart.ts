import { defineStore } from 'pinia'
import { useCustomer } from '~/store/customer'

import type { ICartLinesMapped, ICartMapped, IShopifyCart } from '~/types/cart'
import type { IProductMapped } from '~/types/product'
import type { IShopifyCheckout } from '~/types/checkout'
import type { TSalesChannel } from '~/config/themeConfig'

import cartCreate from '~/graphql/mutations/cart/cartCreate.graphql'
import cartLinesAdd from '~/graphql/mutations/cart/cartLinesAdd.graphql'
import cartLinesRemove from '~/graphql/mutations/cart/cartLinesRemove.graphql'
import cartLinesUpdate from '~/graphql/mutations/cart/cartLinesUpdate.graphql'
import cartNoteUpdate from '~/graphql/mutations/cartNoteUpdate.graphql'
import getProductsById from '~/graphql/queries/getProductsById.graphql'

import { getCheckoutHostname } from '~/utilities/shopify'
import { getCountryFromStore } from '~/utilities/currency'
import { SweetAlertToast } from '~/utilities/Swal'

interface IState {
  cart: ICartMapped
  suitableGift: IProductMapped | undefined
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
      return (salesChannel: TSalesChannel, customerType: string) => {
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
              giftTotal += line.priceLists[salesChannel][customerType] * line.quantity
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
        // email: checkout.email,
        id: cart.id,
        lines: cart.lines.nodes.map(line => ({
          attributes: line.attributes,
          id: line.id,
          quantity: line.quantity,
          title: line.merchandise.title,
          merchandise: line.merchandise,
          priceLists: JSON.parse(line.merchandise.product.details.value).priceLists,
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

    async cartCreate(input: any) {
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
            // this.$nuxt.$cookies.remove('checkoutId')
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
      const lines = checkout.lineItems.nodes?.map((line: any) => ({
        attributes: line.attributes,
        quantity: line.quantity,
        merchandiseId: line.variant.id,
      }))
      const { customer } = useCustomer()

      const cartInput = {
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

      const mergedCartInput = {
        buyerIdentity: lastIncompleteCart.buyerIdentity,
        lines: mergedCartLines,
        note: lastIncompleteCart.note,
      }

      // Create a new cart with the mergedCartInput
      await this.cartCreate(mergedCartInput)
    },

    async cartLinesAdd(cartId: string, lines: any[]) {
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
                  products: lines.map((item: any) =>
                    JSON.parse(item.attributes.find((el: any) => el.key === 'gtmProductData').value)),
                },
              },
            })

            if (typeof window !== 'undefined' && window.google_tag_manager
                && window.google_tag_manager[this.$nuxt.app.$config.gtm.id]) {
              window.google_tag_manager[this.$nuxt.app.$config.gtm.id].dataLayer.set('ecommerce', undefined)
            }
          }
        })
    },

    async cartLinesUpdate(cartId: string, lines: any[], isRemoving = false) {
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
                  products: lines.map((item: any) =>
                    JSON.parse(item.attributes.find((el: any) => el.key === 'gtmProductData').value)),
                },
              },
            })

            if (typeof window !== 'undefined' && window.google_tag_manager
                && window.google_tag_manager[this.$nuxt.app.$config.gtm.id]) {
              window.google_tag_manager[this.$nuxt.app.$config.gtm.id].dataLayer.set('ecommerce', undefined)
            }
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
                  products: cartLines.map((item: any) =>
                    JSON.parse(item.attributes.find((el: any) => el.key === 'gtmProductData').value)),
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

    async getCartById(id: string) {
      await this.$nuxt.$cmwRepo.customer.getCart(id)
        .then(({ cart }: any) => {
          if (!cart?.id) {
            this.$nuxt.$cookies.remove('cart')
            return
          }

          this.setMappedCart(cart)
          this.checkSuitableGift(cart)
          this.saveCartOnCustomerMetafield(cart)
        })
    },

    async saveCartOnCustomerMetafield(cart: any) {
      const customerStore = useCustomer()
      const { customer } = customerStore

      if (!customer.id) { return }

      const customerAccessToken = this.$nuxt.$cookieHelpers.getToken()
      const customerId = `${customer.id}`.substring(`${customer.id}`.lastIndexOf('/') + 1)
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
                lastIncompleteCart: { value: JSON.parse(data.metafield.value) },
              },
            })
          }
        }
      })
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

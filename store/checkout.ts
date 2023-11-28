import { defineStore } from 'pinia'
import type { TSalesChannel } from '~/config/themeConfig'
import getProductsById from '~/graphql/queries/getProductsById.graphql'
import { useCustomer } from '~/store/customer'
import type { CheckoutMapped, ICheckoutLineItemMapped, IShopifyCheckout } from '~/types/checkout'
import type { IProductMapped } from '~/types/product'
import { getCountryFromStore } from '~/utilities/currency'
import checkoutAttributesUpdateV2 from '~/graphql/mutations/checkout/checkoutAttributesUpdateV2.graphql'
import checkoutCreate from '~/graphql/mutations/checkout/checkoutCreate.graphql'
import checkoutEmailUpdateV2 from '~/graphql/mutations/checkout/checkoutEmailUpdateV2.graphql'
import checkoutLineItemsAdd from '~/graphql/mutations/checkout/checkoutLineItemsAdd.graphql'
import checkoutLineItemsRemove from '~/graphql/mutations/checkout/checkoutLineItemsRemove.graphql'
import checkoutLineItemsUpdate from '~/graphql/mutations/checkout/checkoutLineItemsUpdate.graphql'
import { SweetAlertToast } from '~/utilities/Swal'

interface IState {
  checkout: CheckoutMapped
  suitableGift: IProductMapped | undefined
}
export const useCheckout = defineStore({
  id: 'checkout',
  state: () => <IState>({
    checkout: {
      buyerIdentity: {
        countryCode: '',
      },
      completedAt: null,
      email: '',
      id: '',
      lineItems: [],
      note: null,
      webUrl: undefined,
    },
    suitableGift: undefined,
  }),

  getters: {
    checkoutTotalQuantity(state) {
      return state.checkout.lineItems?.reduce((t, n) => t + n.quantity, 0) || 0
    },

    checkoutTotalPrice(state) {
      return (salesChannel: TSalesChannel, customerType: string) => {
        let checkoutLines = []

        if (!state.checkout?.lineItems?.length) { return 0 }

        checkoutLines = state.checkout.lineItems.map(n => ({
          quantity: n.quantity,
          price: !n.variant.product.isGiftCard
            ? JSON.parse(n.variant.product.details.value)
              .priceLists[salesChannel][customerType]
            : n.variant.price.amount,
        })) || []

        const subtotal = checkoutLines.reduce((t, n) => t + n.quantity * n.price, 0)

        let giftTotal = 0
        // If the suitableGift is in the checkout lines, sum their price
        // run a loop to subtract all the suitableGift lines
        if (this.checkout.lineItems.length) {
          for (const lineItem of this.checkout.lineItems) {
            const customAttribute = lineItem.customAttributes.find(el => el.key === 'gift')
            if (customAttribute) {
              giftTotal += lineItem.priceLists[salesChannel][customerType] * lineItem.quantity
            }
          }
        }

        return subtotal - giftTotal
      }
    },
  },

  actions: {
    setMappedCheckout(checkout: IShopifyCheckout) {
      const checkoutMapped: CheckoutMapped = {
        buyerIdentity: checkout.buyerIdentity,
        completedAt: checkout.completedAt,
        email: checkout.email,
        id: checkout.id,
        lineItems: checkout.lineItems.nodes.map(lineItem => ({
          customAttributes: lineItem.customAttributes,
          id: lineItem.id,
          quantity: lineItem.quantity,
          title: lineItem.title,
          variant: lineItem.variant,
          priceLists: JSON.parse(lineItem.variant.product.details.value).priceLists,
        })),
        note: checkout.note,
        webUrl: checkout.webUrl as Location,
      }

      this.$patch({ checkout: checkoutMapped })
      this.setCheckoutIdCookie(checkout.id, checkout.createdAt)
    },

    async checkSuitableGift(checkout: IShopifyCheckout) {
      const lines_items = checkout.lineItems.nodes.map(lineItem => ({
        product_name: lineItem.title,
        product_id: `${lineItem.variant.product.id}`.substring(`${lineItem.variant.product.id}`.lastIndexOf('/') + 1),
        variant_id: `${lineItem.variant.id}`.substring(`${lineItem.variant.id}`.lastIndexOf('/') + 1),
        quantity: lineItem.quantity,
        price: lineItem.variant.price.amount,
      }))

      if (!lines_items.length) { return }

      await this.$nuxt.$cmw.$post('/checkouts/discounts/gift-eligible', {
        lines_items,
      })
        .then(async (response: any) => {
          const { data, responseCode } = response

          if (responseCode === 0) {
            if (data && (data.type === 'gift' || data.type === 'GIFT')) {
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
              if (this.checkout.lineItems.length) {
                for (const lineItem of this.checkout.lineItems) {
                  const customAttribute = lineItem.customAttributes.find(el => el.key === 'gift')
                  if (customAttribute) {
                    await this.checkoutLineItemsRemove(this.checkout.id, [lineItem])
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

      if (this.checkout.note) {
        await this.checkoutAttributesUpdateV2({
          note: this.checkout.note,
        })
      }

      let redirectUrl = this.checkout.webUrl

      if (!customer.id && typeof window !== 'undefined' && redirectUrl) {
        window.location = redirectUrl
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

      window.location = redirectUrl as Location
    },

    async checkoutCreate(input: any) {
      // const { customer } = useCustomer()
      await this.$nuxt.$graphql.default
        .request(checkoutCreate, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          input,
        })
        .then(({ checkoutCreate }) => {
          const { checkout, checkoutUserErrors } = checkoutCreate

          if (!checkoutUserErrors.length) {
            this.setMappedCheckout(checkout)
            this.setCheckoutIdCookie(checkout.id, checkout.createdAt)

            this.$nuxt.$cookies.remove('cartId')
            // Todo: use checkoutCustomerAssociateV2 to associate the customer to the checkout
          }
        })
    },

    async checkoutAttributesUpdateV2(input: any) {
      const checkoutId = this.checkout.id
      if (!input || !checkoutId) { return }

      await this.$nuxt.$graphql.default
        .request(checkoutAttributesUpdateV2, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          checkoutId,
          input,
        })
        .then(({ checkoutAttributesUpdateV2: { checkout, checkoutUserErrors } }) => {
          if (!checkoutUserErrors.length) {
            // Success
            this.setMappedCheckout(checkout)
            // this.$patch({ ...this.checkout, checkout })
          } else {
            SweetAlertToast.fire({
              icon: 'error',
              text: checkoutUserErrors[0].message,
            })
          }
        })
    },

    async handleTemporaryCartReplace(cartId: string) {
      await this.$nuxt.$cmwRepo.customer.getCart(cartId)
        .then(async (response: { cart: any }) => {
          const { cart } = response
          await this.mutateShopifyCartIntoCheckout(cart.note, cart.lines.nodes ?? [])
        })
    },

    async mutateShopifyCartIntoCheckout(note = '', lines?: any[]) {
      const lineItems = lines?.map((line: any) => ({
        customAttributes: line.attributes,
        quantity: line.quantity,
        variantId: line.merchandise.id,
      }))
      const { customer } = useCustomer()

      const CheckoutCreateInput = {
        // discountCodes: [''],
        buyerIdentity: {
          countryCode: getCountryFromStore(this.$nuxt.$cmwStore.settings.store),
        },
        ...(customer.email && { email: customer.email }),
        lineItems,
        note,
      }

      // TODO: add missing fields from others implementations like cartLinesAdd
      await this.checkoutCreate(CheckoutCreateInput)
    },

    /**
       * Create a function that separate the lineItems already in the Store Checkout and the lineItems in the Last Checkout
       * Control if the lineItems are the same, if not, use checkoutLineItemsAdd to add the lineItems to the checkout
       * If the lineItems are the same, sum the quantity of both lineItems and use checkoutLineItemsUpdate to update the quantity
      */
    async mergeCheckoutStoreWithCheckout(lastIncompleteCheckout: string) {
      const { node: lastCheckout } = await this.$nuxt.$cmwRepo.customer.getCheckout(lastIncompleteCheckout)

      const storeLineItems = this.checkout.lineItems || []
      const lastCheckoutLineItems = lastCheckout.lineItems || []

      // TODO: implement types
      // Separate lineItems into alreadyInCheckoutItems and notInCheckoutItems
      const { alreadyInCheckoutItems, notInCheckoutItems } = storeLineItems.reduce(
        (result: any, storeLineItem: any) => {
          const checkoutLineItem = lastCheckoutLineItems.nodes.find(
            (checkoutItem: any) => checkoutItem.variant.id === storeLineItem.variant.id,
          )

          if (checkoutLineItem) {
            // If the lineItem is the same, add it to alreadyInCheckoutItems
            result.alreadyInCheckoutItems.push({
              customAttributes: checkoutLineItem.customAttributes,
              id: checkoutLineItem.id,
              quantity: checkoutLineItem.quantity + storeLineItem.quantity,
              variantId: checkoutLineItem.variant.id,
            })
          } else {
            // If the lineItem is not in the last checkout, add it to notInCheckoutItems
            result.notInCheckoutItems.push({
              customAttributes: storeLineItem.customAttributes,
              quantity: storeLineItem.quantity,
              variantId: storeLineItem.variant.id,
            })
          }

          return result
        },
        { alreadyInCheckoutItems: [], notInCheckoutItems: [] },
      )

      if (notInCheckoutItems.length) {
        await this.checkoutLineItemsAdd(lastCheckout.id, notInCheckoutItems)
      }

      if (alreadyInCheckoutItems.length) {
        await this.checkoutLineItemsUpdate(lastCheckout.id, alreadyInCheckoutItems)
      }

      // Todo: update checkout, shippingAddress, billingAddress, discountCodes, note...
      await this.checkoutEmailUpdateV2(lastCheckout.id, lastCheckout.email)

      this.setCheckoutIdCookie(lastCheckout.id, lastCheckout.createdAt)
    },

    async checkoutEmailUpdateV2(checkoutId: string, email: string) {
      await this.$nuxt.$graphql.default
        .request(checkoutEmailUpdateV2, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          checkoutId,
          email,
        })
        .then(({ checkoutEmailUpdateV2 }) => {
          const { checkout, checkoutUserErrors } = checkoutEmailUpdateV2

          if (!checkoutUserErrors.length) {
            this.setMappedCheckout(checkout)
          }
        })
    },

    async checkoutLineItemsAdd(checkoutId: string, lineItems: any[]) {
      await this.$nuxt.$graphql.default
        .request(checkoutLineItemsAdd, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          checkoutId,
          lineItems,
        })
        .then(({ checkoutLineItemsAdd }) => {
          const { checkout, checkoutUserErrors } = checkoutLineItemsAdd

          if (!checkoutUserErrors.length) {
            this.setMappedCheckout(checkout)
            this.checkSuitableGift(checkout)

            this.$nuxt.$gtm.push({
              event: 'addToCart',
              ecommerce: {
                currencyCode: this.$nuxt.$cmwStore.isUk ? 'GBP' : 'EUR',
                add: {
                  products: lineItems.map((item: any) =>
                    JSON.parse(item.customAttributes.find((el: any) => el.key === 'gtmProductData').value)),
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

    async checkoutLineItemsUpdate(checkoutId: string, lineItems: any[], isRemoving = false) {
      await this.$nuxt.$graphql.default
        .request(checkoutLineItemsUpdate, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          checkoutId,
          lineItems,
        })
        .then(({ checkoutLineItemsUpdate }) => {
          const { checkout, checkoutUserErrors } = checkoutLineItemsUpdate

          if (!checkoutUserErrors.length) {
            this.setMappedCheckout(checkout)
            this.checkSuitableGift(checkout)

            this.$nuxt.$gtm.push({
              event: isRemoving ? 'removeFromCart' : 'addToCart',
              ecommerce: {
                currencyCode: this.$nuxt.$cmwStore.isUk ? 'GBP' : 'EUR',
                add: {
                  products: lineItems.map((item: any) =>
                    JSON.parse(item.customAttributes.find((el: any) => el.key === 'gtmProductData').value)),
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

    async checkoutLineItemsRemove(checkoutId: string, lineItems: ICheckoutLineItemMapped[]) {
      const lineItemIds = lineItems.map((item: any) => item.id)

      await this.$nuxt.$graphql.default
        .request(checkoutLineItemsRemove, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          checkoutId,
          lineItemIds,
        })
        .then(({ checkoutLineItemsRemove }) => {
          const { checkout, checkoutUserErrors } = checkoutLineItemsRemove

          if (!checkoutUserErrors.length) {
            this.setMappedCheckout(checkout)
            this.checkSuitableGift(checkout)

            this.$nuxt.$gtm.push({
              event: 'removeFromCart',
              ecommerce: {
                currencyCode: this.$nuxt.$cmwStore.isUk ? 'GBP' : 'EUR',
                remove: {
                  products: lineItems.map((item: any) =>
                    JSON.parse(item.customAttributes.find((el: any) => el.key === 'gtmProductData').value)),
                },
              },
            })
          }
        })
    },

    async getCheckoutById(id: string) {
      await this.$nuxt.$cmwRepo.customer.getCheckout(id)
        .then(({ node }: any) => {
          if (!node || node.completedAt) {
            this.$nuxt.$cookies.remove('checkoutId')
            return
          }

          this.setMappedCheckout(node)
          this.checkSuitableGift(node)
        })
    },

    setCheckoutIdCookie(id: string, createdAt: string) {
      const createdAtTimestamp = new Date(createdAt).getTime() // Convert createdAt to milliseconds
      const expiresTimestamp = createdAtTimestamp + (45 * 24 * 60 * 60 * 1000) // Add 45 days in milliseconds

      const expires = new Date(expiresTimestamp)
      const currentDate = new Date()
      const maxAge = Math.floor((expires.getTime() - currentDate.getTime()) / 1000)

      this.$nuxt.$cookies.set('checkoutId', id, {
        path: '/',
        maxAge,
        sameSite: 'none',
        secure: true,
        expires,
      })
    },
  },

})

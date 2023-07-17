import { useContext } from '@nuxtjs/composition-api'
import { defineStore, storeToRefs } from 'pinia'
import { useCustomer } from './customer'
import addProductToCart from '~/graphql/mutations/addProductToCart'
import createCart from '~/graphql/mutations/createCart'
import updateItemInCart from '~/graphql/mutations/updateItemInCart'
import getCart from '~/graphql/queries/getCart'
import { getCountryFromStore } from '~/utilities/currency'

export const useShopifyCart = defineStore({
  id: 'shopifyCart',
  state: () => ({
    shopifyCart: null,
    salesChannel: process.env.SALECHANNEL, // FixMe: :)
  }),

  getters: {
    cartTotalQuantity: state => state.shopifyCart?.totalQuantity || 0,
    cartTotal: (state) => {
      let cartLines = []
      const { getCustomerType } = storeToRefs(useCustomer())

      if (!state.shopifyCart?.lines?.edges?.length)
        return cartLines

      cartLines = state.shopifyCart.lines.edges?.map(edge => ({
        quantity: edge.node.quantity,
        price: !edge.node.merchandise.product.isGiftCard
          ? JSON.parse(edge.node.merchandise.product.details.value)
            .priceLists[state.salesChannel][getCustomerType.value]
          : edge.node.merchandise.price.amount,
        cartLineId: edge.node.id,
      }))

      return cartLines.reduce((t, n) => t + n.quantity * n.price, 0)
    },
  },

  actions: {
    async createShopifyCart() {
      const { customer } = useCustomer()
      const buyer = customer
        ? {
            buyerIdentity: {
              countryCode: getCountryFromStore(process.env.STORE),
              customerAccessToken: customer.token,
            },
          }
        : null

      const data = await this.$nuxt.$graphql.default
        .request(createCart, {
          input: {
            buyer,
            discountCodes: [''],
            lines: [],
            note: '',
          },
        })
        .then(data => data.cartCreate.cart)

      this.$nuxt.$cookies.set('cartId', data.id)
      this.$patch({ shopifyCart: data })
    },

    // Fix me: need workaround for cart line
    async addProductToCart(product, fromCartLine = false) {
      const cartId = this.shopifyCart.id

      let lines
      if (fromCartLine) {
        lines = {
          merchandiseId: product.merchandise.id,
          quantity: 1,
          attributes: [
            {
              key: 'gtmProductData',
              value: product.attributes.find(el => el.key === 'gtmProductData').value,
            },
            {
              key: 'bundle',
              value: product.attributes.find(el => el.key === 'bundle').value,
            },
          ],
        }
      } else {
        lines = {
          merchandiseId: product.shopify_product_variant_id,
          quantity: 1,
          attributes: [
            {
              key: 'gtmProductData',
              value: product.gtmProductData ? JSON.stringify(product.gtmProductData) : 'false',
            },
            {
              key: 'bundle',
              value: (product.tags) ? product.tags.includes('BUNDLE').toString() : 'false',
            },
          ],
        }
      }

      const variables = {
        cartId,
        lines,
      }

      const data = await this.$nuxt.$graphql.default
        .request(addProductToCart, variables)
        .then(data => data)

      this.$nuxt.$gtm.push({
        event: 'addToCart',
        ecommerce: {
          currencyCode: this.$nuxt.$config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          add: {
            products: !fromCartLine ? [product.gtmProductData] : [JSON.parse(product.attributes.find(el => el.key === 'gtmProductData').value)],
          },
        },
      })

      if (typeof window !== 'undefined' && window.google_tag_manager && window.google_tag_manager[this.$nuxt.app.$config.gtm.id])
        window.google_tag_manager[this.$nuxt.app.$config.gtm.id].dataLayer.set('ecommerce', undefined)

      this.$patch({ shopifyCart: data.cartLinesAdd.cart })
    },

    async updateItemInCart(product, quantity, fromCartLine = false) {
      const cartId = this.shopifyCart.id

      let lines
      if (fromCartLine) {
        lines = [
          {
            id: product.id,
            quantity,
            attributes: [
              {
                key: 'gtmProductData',
                value: product.attributes.find(el => el.key === 'gtmProductData').value,
              },
              {
                key: 'bundle',
                value: product.attributes.find(el => el.key === 'bundle').value,
              },
            ],
          },
        ]
      } else {
        const lineId = this.shopifyCart.lines.edges.find(el => el.node.merchandise.id === product.shopify_product_variant_id).node.id
        lines = [
          {
            id: lineId,
            quantity,
            attributes: [
              {
                key: 'gtmProductData',
                value: JSON.stringify(product.gtmProductData),
              },
              {
                key: 'bundle',
                value: product.tags.includes('BUNDLE').toString(),
              },
            ],
          },
        ]
      }

      const variables = {
        cartId,
        lines,
      }
      const data = await this.$nuxt.$graphql.default
        .request(updateItemInCart, variables)
        .then(data => data)

      this.$nuxt.$gtm.push({
        event: 'removeFromCart',
        ecommerce: {
          currencyCode: this.$nuxt.$config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          remove: {
            products: !fromCartLine ? [product.gtmProductData] : [JSON.parse(product.attributes.find(el => el.key === 'gtmProductData').value)],
          },
        },
      })

      if (typeof window !== 'undefined' && window.google_tag_manager && window.google_tag_manager[this.$nuxt.app.$config.gtm.id])
        window.google_tag_manager[this.$nuxt.app.$config.gtm.id].dataLayer.set('ecommerce', undefined)

      this.$patch({ shopifyCart: data.cartLinesUpdate.cart })
    },

    getFinalPrice(item) {
      const { $config } = useContext()
      const customerStore = useCustomer()
      const customerType = customerStore.getCustomerType

      return !item.merchandise.product.isGiftCard
        ? JSON.parse(item.merchandise.product.details.value).priceLists[$config.SALECHANNEL][customerType]
        : item.merchandise.price.amount
    },
    async getShopifyCart(id) {
      try {
        const data = await this.$nuxt.$graphql.default
          .request(getCart, { id })
          .then(data => data.cart)

        this.$patch({ shopifyCart: data })
      } catch (e) {
        throw new Error('Invalid cart id')
      }
    },
  },
})

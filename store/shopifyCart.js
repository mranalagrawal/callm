import { useContext } from '@nuxtjs/composition-api'
import { defineStore } from 'pinia'
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
  }),

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

      this.$patch({ shopifyCart: data }) // TODO: fix here
      return await data
    },

    // Fix me: need workaround for cartline
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

      return data.cartLinesAdd.cart
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

      return data.cartLinesUpdate.cart
    },

    getCartLines() {
      const { $config } = useContext()
      const customerStore = useCustomer()
      const customerType = customerStore.getCustomerType

      return this.shopifyCart.lines.edges.map((edge) => {
        const price = (edge.node.merchandise.product.details.value?.priceLists)
          ? JSON.parse(edge.node.merchandise.product.details.value)
            .priceLists[$config.SALECHANNEL][customerType]
          : edge.node.merchandise.price.amount

        return {
          quantity: edge.node.quantity,
          price,
          cartLineId: edge.node.id,
        }
      })
    },
    getFinalPrice(item) {
      const { $config } = useContext()
      const customerStore = useCustomer()
      const customerType = customerStore.getCustomerType

      return (item.merchandise.product.details.value?.priceLists)
        ? JSON.parse(item.merchandise.product.details.value).priceLists[$config.SALECHANNEL][customerType]
        : item.merchandise.price.amount // default prezzo di shopify, usato nelle gift card
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

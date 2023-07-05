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

      // this.$patch({ shopifyCart: data }) TODO: fix here
      return await data
    },

    async addProductToCart(lines) {
      const cartId = this.shopifyCart.id

      const variables = {
        cartId,
        lines,
      }
      const data = await this.$nuxt.$graphql.default
        .request(addProductToCart, variables)
        .then(data => data)

      return data.cartLinesAdd.cart
    },
    async updateItemInCart(lineId, quantity) {
      const cartId = this.shopifyCart.id

      const variables = {
        cartId,
        lines: [
          {
            id: lineId,
            quantity,
          },
        ],
      }
      const data = await this.$nuxt.$graphql.default
        .request(updateItemInCart, variables)
        .then(data => data)

      return data.cartLinesUpdate.cart
    },

    getCartLines() {
      const { $config } = useContext()
      const customerStore = useCustomer()
      const customerType = customerStore.getCustomerType

      return this.shopifyCart.lines.edges.map((edge) => {
        return {
          quantity: edge.node.quantity,
          price: JSON.parse(edge.node.merchandise.product.details.value)
            .priceLists[$config.SALECHANNEL][customerType],
          cartLineId: edge.node.id,
        }
      })
    },
    getFinalPrice(item) {
      const { $config } = useContext()
      const customerStore = useCustomer()
      const customerType = customerStore.getCustomerType

      return JSON.parse(item.merchandise.product.details.value).priceLists[
        $config.SALECHANNEL
      ][customerType]
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

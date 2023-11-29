import { defineStore } from 'pinia'
import { useCustomer } from './customer'
import { SweetAlertToast } from '~/utilities/Swal'
import cartNoteUpdate from '~/graphql/mutations/cartNoteUpdate'

export const useShopifyCart = defineStore({
  id: 'shopifyCart',
  state: () => ({
    shopifyCart: null,
  }),

  getters: {
    cartTotalQuantity: state => state.shopifyCart?.totalQuantity || 0,
    cartTotal: (state) => {
      return (salesChannel) => {
        const customerStore = useCustomer()

        let cartLines = []

        if (!state.shopifyCart?.lines?.edges?.length) { return cartLines }

        cartLines = state.shopifyCart.lines.edges?.map(edge => ({
          quantity: edge.node.quantity,
          price: !edge.node.merchandise.product.isGiftCard
            ? JSON.parse(edge.node.merchandise.product.details.value)
              .priceLists[salesChannel][customerStore.getCustomerType]
            : edge.node.merchandise.price.amount,
          cartLineId: edge.node.id,
        }))

        return cartLines.reduce((t, n) => t + n.quantity * n.price, 0)
      }
    },
  },

  actions: {
    async cartNoteUpdate(note = '') {
      const cartId = this.shopifyCart.id
      if (!note) { return }

      await this.$nuxt.$graphql.default
        .request(cartNoteUpdate, { cartId, note })
        .then(({ cartNoteUpdate: { cart, userErrors } }) => {
          if (!userErrors.length) {
            // Success
            this.$patch({ ...this.shopifyCart, note: cart.note })
          } else {
            SweetAlertToast.fire({
              icon: 'error',
              text: userErrors[0].message,
            })
          }
        })
    },

    async checkout() {
      const { customer } = useCustomer()

      if (this.shopifyCart.note) {
        await this.cartNoteUpdate(this.shopifyCart.note)
      }

      if (!customer.id) {
        // crea checkoutUrl
        window.location = this.shopifyCart.checkoutUrl
        return
      }

      try {
        const res = await this.$nuxt.$elastic.$post('/checkout', {
          customerAccessToken: this.$nuxt.$cookieHelpers.getToken(),
          store: this.$nuxt.$config.STORE,
          checkoutUrl: this.shopifyCart.checkoutUrl,
          email: customer.email,
        })
        window.location = res.link
      } catch (error) {
        this.$nuxt.$handleApiErrors(`Catch on checkout: ${error}`)
      }
    },
  },
})

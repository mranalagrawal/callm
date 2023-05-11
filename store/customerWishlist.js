import { defineStore } from 'pinia'

import { useCustomer } from '~/store/customer'

import { regexRules } from '@/utilities/validators'

const setCustomerWishlist = (value) => {
  const json = JSON.parse(value)
  return json.filter(product => new RegExp(regexRules('isProduct')).test(product))
}

export const useCustomerWishlist = defineStore({
  id: 'customerWishlist',
  state: () => ({
    /** @Type: {ProductType.Product[]} */
    wishlistProducts: [],
    /** @Type: {String[]} */
    wishlistArr: [],
  }),

  getters: {
    favoritesCount: state => state.wishlistArr.length,
  },

  actions: {
    async getCustomerWishlist() {
      const { customer } = useCustomer()
      this.$patch({
        wishlistArr: (customer.value.wishlist && customer.value.wishlist.value) ? setCustomerWishlist(customer.customer.wishlist.value) : [],
      })
    },

    async getWishlistProducts({ query, first = 30 }) {
      await this.$nuxt.$cmwRepo.products.getAll({
        first: Number(first),
        query,
      })
        .then(({ products }) => {
          this.$patch({
            wishlistProducts: products.nodes,
          })
        })
    },
  },
})

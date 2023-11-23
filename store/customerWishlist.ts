import { defineStore } from 'pinia'
import type { IOptions } from '~/types/types'
// import { regexRules } from '@/utilities/validators'

/* const setCustomerWishlist = (value: string) => {
  const json = JSON.parse(value)
  return json.filter((product: string) => new RegExp(regexRules('isProduct')).test(product))
} */
interface IState {
  wishlistArr: any[]
  wishlistProducts: any[]
  filters: {
    categoriesFilters: {
      'id': number
      'name': string
      'subcategories': {
        'id': number
        'name': string
      }[]
    }[]
    wineListsFilters: {
      'id': number
      'name': string
    }[]
  }
}

export const useCustomerWishlist = defineStore({
  id: 'customerWishlist',
  state: () => <IState>({
    wishlistArr: [],
    wishlistProducts: [],
    filters: {
      categoriesFilters: [],
      wineListsFilters: [],
    },
  }),

  getters: {
    favoritesCount: state => state.wishlistArr.length,

    categoriesFilters: (state): IOptions[] =>
      state.filters.categoriesFilters?.map(({ id: categoryId, name: label }) => ({
        value: JSON.stringify({ categoryId }),
        label,
      })) || [],

    subcategoriesFilters: (state): IOptions[] =>
      state.filters.categoriesFilters?.map(({ id: categoryId, subcategories }) =>
        subcategories?.map(({ id: subcategoryId, name: label }) => ({
          value: JSON.stringify({ categoryId, subcategoryId }),
          label,
        }))).flat() || [],

    wineListsFilters: (state): IOptions[] =>
      state.filters.wineListsFilters?.map(({ id: wineListId, name: label }) => ({
        value: JSON.stringify({ wineListId }),
        label,
      })) || [],

  },

  actions: {
    /* async getCustomerWishlist() {
      const { customer } = useCustomer()
      this.$patch({
        wishlistArr: (customer.value.wishlist && customer.value.wishlist.value) ? setCustomerWishlist(customer.customer.wishlist.value) : [],
      })
    }, */

    async getWishlistProducts({ query = '', first = 30 }) {
      await this.$nuxt.$cmwRepo.products.getAll({
        first: Number(first),
        query,
      })
        .then(({ products }: any) => {
          this.$patch({
            wishlistProducts: products.nodes,
          })
        })
    },
  },
})

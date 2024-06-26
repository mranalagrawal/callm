import { defineStore } from 'pinia'

import { useCustomer } from '~/store/customer'

import type { IProductRating, IShopifyProduct } from '~/types/product'
import type { IOptions } from '~/types/types'
import { getIconAsImg } from '~/utilities/icons'
import { getCustomerId } from '~/utilities/shopify'
import { SweetAlertConfirm, SweetAlertToast } from '~/utilities/Swal'

interface IState {
  customerWishlistProducts: IProductRating[]
  elements: any[]
  filteredElements: any[]
  filters: {
    categories: {
      'id': number
      'name': string
      'subcategories': {
        'id': number
        'name': string
      }[]
    }[]
    wineLists: {
      'id': number
      'name': string
    }[]
  }
  wishlistShopifyProducts: IShopifyProduct[]
}

export const useCustomerWishlist = defineStore({
  id: 'customerWishlist',
  state: () => <IState>({
    customerWishlistProducts: [],
    elements: [],
    filteredElements: [],
    filters: { categories: [], wineLists: [] },
    wishlistShopifyProducts: [],
  }),

  getters: {

    wishlistArr(state): string[] {
      const ids = state.elements.flatMap(({ productFeId, relatedVintage }) =>
        (relatedVintage ? [productFeId] : [productFeId]))

      return [...new Set(ids.map(id => `'P${id}'`))]
    },

    filteredWishlistArr(state): string[] {
      const ids = state.filteredElements.flatMap(({ productFeId, relatedVintage }) =>
        (relatedVintage ? [productFeId] : [productFeId]))

      return [...new Set(ids.map(id => `'P${id}'`))]
    },

    favoritesCount(): number {
      return this.wishlistArr.length
    },

    filteredCategories: (state): IOptions[] =>
      state.filters.categories?.map(({ id: categoryId, name: label }) => ({
        value: JSON.stringify({ categoryId }),
        label,
      })) || [],

    filteredSubcategories: (state): IOptions[] =>
      state.filters.categories?.map(({ id: categoryId, subcategories }) =>
        subcategories?.map(({ id: subcategoryId, name: label }) => ({
          value: JSON.stringify({ categoryId, subcategoryId }),
          label,
        }))).flat() || [],

    filteredWineLists: (state): IOptions[] =>
      state.filters.wineLists?.map(({ id: wineListId, name: label }) => ({
        value: JSON.stringify({ wineListId }),
        label,
      })) || [],

  },

  actions: {
    async getCustomerWishlist(id: string) {
      const { customer } = useCustomer()
      const customerId = id || getCustomerId(customer.id)
      const customerAccessToken = this.$nuxt.$cookieHelpers.getToken()

      this.$nuxt.$cmw.setHeader('X-Shopify-Customer-Access-Token', customerAccessToken)

      await this.$nuxt.$cmw.$get(`/wishlists/full?shopifyCustomerId=${customerId}&sortingDirection=ASC&sortingField=createdat`)
        .then(({ data, responseCode }: any) => {
          if (responseCode === 0) {
            this.$patch({ elements: data.elements, filteredElements: data.elements })
          }
        })
        .catch(() => {
          SweetAlertToast.fire({
            icon: 'error',
            text: this.$nuxt.app.i18n.t('common.feedback.KO.unknown'),
          })
        })
    },

    async getWishlistProducts({ query = '', first = 30 }) {
      await this.$nuxt.$cmwRepo.products.getAllV2({
        first: Number(first),
        query,
      })
        .then((products) => {
          this.$patch({
            wishlistShopifyProducts: products,
          })
        })
    },

    async addToWishlist(args: any) {
      const customerStore = useCustomer()
      const customerAccessToken = this.$nuxt.$cookieHelpers.getToken()
      const shopifyCustomerId = `${customerStore.customer.id}`.substring(`${customerStore.customer.id}`.lastIndexOf('/') + 1)
      this.$nuxt.$cmw.setHeader('X-Shopify-Customer-Access-Token', customerAccessToken)
      await this.$nuxt.$cmw.$post(`/wishlists?shopifyCustomerId=${shopifyCustomerId}`, {
        shopifyCustomerId,
        productFeId: args.id, // 19052, //
        score: args.score || 0,
        description: args.description,
      })
        .then(async (data: any) => {
          const { responseCode } = data

          // This means success :)
          if (responseCode === 0) {
            SweetAlertToast.fire({
              iconHtml: getIconAsImg('success'),
              text: this.$nuxt.app.i18n.t(args.isUpdating ? 'common.feedback.OK.wishlistUpdated' : 'common.feedback.OK.wishlistAdded'),
            })

            // Create a function to add args.id to state.elements and state.filteredElements 🤦🏻‍️🙈🫣
            // Find the object in data.elements with the same productFeId as args.id and remove it
            let elements = this.elements.filter(p => p.productFeId !== args.id)
            elements = [...elements, ...data.data.elements]
            this.$patch({ elements })

            await this.$nuxt.$cmwGtmUtils.resetDatalayerFields()

            this.$nuxt.$gtm.push({
              event: 'addToWishlist',
              wishlistAddedProduct: {
                products: [{
                  ...args.gtmProductData,
                }],
              },
            })
          }
        })
        .catch(() => {
          SweetAlertToast.fire({
            icon: 'error',
            text: this.$nuxt.app.i18n.t('common.feedback.KO.unknown'),
          })
        })
    },

    async removeFromWishlist(args: any) {
      const customerStore = useCustomer()
      const customerAccessToken = this.$nuxt.$cookieHelpers.getToken()
      const shopifyCustomerId = `${customerStore.customer.id}`.substring(`${customerStore.customer.id}`.lastIndexOf('/') + 1)
      this.$nuxt.$cmw.setHeader('X-Shopify-Customer-Access-Token', customerAccessToken)
      await this.$nuxt.$cmw.$put('/wishlists', {
        shopifyCustomerId,
        productFeId: args.id,
      }).then((data: any) => {
        const { responseCode } = data
        // This means success :)
        if (responseCode === 0) {
          SweetAlertToast.fire({
            iconHtml: getIconAsImg('success'),
            text: this.$nuxt.app.i18n.t('common.feedback.OK.wishlistRemoved'),
          })

          // Create a function to remove args.id from state.elements and state.filteredElements 🤦🏻‍️🙈🫣
          const filteredArr = this.elements.filter(p => `${p.productFeId}` !== `${args.id}`)
          this.$patch({ elements: filteredArr })
        }
      })
        .catch(() => {
          SweetAlertToast.fire({
            icon: 'error',
            text: this.$nuxt.app.i18n.t('common.feedback.KO.unknown'),
          })
        })
    },

    handleWishlist(args: any) {
      const customerStore = useCustomer()
      if (!customerStore.customer.id) {
        // TODO: Find a better UX for no logged users, maybe a login modal
        this.$nuxt.app.router?.push('/login')
        return
      }

      if (!customerStore.customerId || !args.id) { throw new Error('missing arguments') }

      if (args.isOnFavourite) {
        SweetAlertConfirm.fire({
          // TODO: Add some cool animated icons and the use with iconHtml: getIconAsImg('error'),
          icon: 'question',
          text: this.$nuxt.app.i18n.t('common.confirm.wishlistRemove'),
          cancelButtonText: this.$nuxt.app.i18n.t('common.cta.cancel'),
          confirmButtonText: this.$nuxt.app.i18n.t('common.cta.confirm'),
          preConfirm: () => this.removeFromWishlist(args),
        }).then(() => {})
      } else {
        this.addToWishlist(args).then(() => {})
      }
    },
  },
})

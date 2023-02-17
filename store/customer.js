import { defineStore } from 'pinia'
import { SweetAlertConfirm, SweetAlertToast } from '~/utilities/Swal'
import { getIconAsImg } from '~/utilities/icons'
import customerAccessTokenCreate from '~/graphql/mutations/authenticateUser'
// import { useCustomerWishlist } from '@/store/customerWishlist'

import { regexRules } from '@/utilities/validators'

const setCustomerWishlist = (value) => {
  const json = JSON.parse(value)
  return json.filter(product => new RegExp(regexRules('isProduct')).test(product))
}
export const useCustomer = defineStore({
  id: 'customer',
  state: () => ({
    customer: {},
    // FixMe: on Nuxt 3 or using GraphQl local storage properly we shouldn't need this,
    //  we need to reduce the extra objects and relay on the state,
    //  I believe there is an issue with deep watch, for some reason getters are not updating accordingly
    wishlistArr: [],
    /** @type: {InputObjects.CustomerUpdateInput} */
    editingCustomer: {
      acceptsMarketing: false,
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      phone: '',
    },
  }),

  getters: {
    favoritesCount: state => state.wishlistArr.length,
    customerId: (state) => {
      return `${state.customer.id}`.substring(`${state.customer.id}`.lastIndexOf('/') + 1)
    },
  },

  actions: {
    async login(email, password) {
      let valid = false
      const data
        = await this.$nuxt.$graphql.default.request(customerAccessTokenCreate, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          input: {
            email,
            password,
          },
        })
          .then(data => data && data.customerAccessTokenCreate)

      const { customerAccessToken, customerUserErrors } = data

      if (customerAccessToken && customerAccessToken.accessToken && typeof customerAccessToken.accessToken === 'string') {
        const token = customerAccessToken.accessToken
        this.$nuxt.app.$cookieHelpers.setToken(token)
        this.$nuxt.$graphql.default.setHeader('authorization', `Bearer ${token}`)
        valid = true
      } else {
        SweetAlertToast.fire({
          icon: 'error',
          text: customerUserErrors[0].message,
        })
      }

      return valid
    },
    async getCustomer() {
      await this.$nuxt.$cmwRepo.customer.getCustomer()
        .then(({ customer }) => {
          if (customer) {
            // Todo: Remove this when done with Vuex
            this.$nuxt.store.commit('user/setUser', {
              token: this.$nuxt.$cookieHelpers.getToken(),
              customer,
            })
            this.$patch({
              customer,
              wishlistArr: (customer.wishlist && customer.wishlist.value) ? setCustomerWishlist(customer.wishlist.value) : [],
            })
          } else {
            SweetAlertToast.fire({ text: this.$nuxt.app.i18n.t('common.feedback.KO.login') })
          }
        })
    },
    async logout() {
      this.$nuxt.store.commit('user/setUser', null)
      await this.$nuxt.$cookieHelpers.onLogout()
      this.$reset()
      this.$nuxt.$graphql.default.setHeader('authorization', '')
      await this.$nuxt.app.router.push(this.$nuxt.app.localePath('/'))
    },

    async addOrRemoveFromWishlist(args) {
      const customerId = `${this.customer.id}`.substring(`${this.customer.id}`.lastIndexOf('/') + 1)
      const { ELASTIC_URL, STORE } = this.$nuxt.app.$config
      await fetch(
        `${ELASTIC_URL}customers/${STORE}/${customerId}/wishlist/${args.id}`,
        { method: 'POST' },
      )
        .then(response => (response.json()))
        .then((array) => {
          // TODO: Animate the filling heart for a better UX
          this.$patch({ wishlistArr: setCustomerWishlist(JSON.stringify(array)) })
          SweetAlertToast.fire({
            iconHtml: getIconAsImg('success'),
            text: this.$nuxt.app.i18n.t(args.isOnFavourite ? 'common.feedback.OK.wishlistRemoved' : 'common.feedback.OK.wishlistAdded'),
          })
        })
        .catch(() => {
          SweetAlertToast.fire({
            icon: 'error',
            text: this.$nuxt.app.i18n.t('common.feedback.KO.unknown'),
          })
        })
    },

    handleWishlist(args) {
      if (!this.customer.id) {
        // TODO: Find a better UX for no logged users, maybe a login modal
        this.$nuxt.app.router.push('/login')
        return
      }

      if (!this.customerId || !args.id)
        throw new Error('missing arguments')

      if (args.isOnFavourite) {
        SweetAlertConfirm.fire({
          // TODO: Add some cool animated icons and the use with iconHtml: getIconAsImg('error'),
          icon: 'question',
          text: this.$nuxt.app.i18n.t('common.confirm.wishlistRemove'),
          cancelButtonText: this.$nuxt.app.i18n.t('common.cta.cancel'),
          confirmButtonText: this.$nuxt.app.i18n.t('common.cta.confirm'),
          preConfirm: () => this.addOrRemoveFromWishlist(args),
        }).then(() => {
        })
      } else {
        this.addOrRemoveFromWishlist(args)
      }
    },
    async customerUpdateData(customer = {}, feedbackOk = '', feedbackKo = '') {
      await this.$nuxt.$cmwRepo.customer.customerUpdate(customer)
        .then(({ customerUpdate: { customer, customerAccessToken, customerUserErrors } }) => {
          if (customer && customer.id) {
            // Todo: Remove this when done with Vuex
            this.$nuxt.store.commit('user/setUser', {
              token: this.$nuxt.$cookieHelpers.getToken(),
              customer: { ...customer },
            })
            this.$patch({
              customer: {
                ...customer,
              },
            })

            if (customerAccessToken && customerAccessToken.accessToken) {
              this.$nuxt.$cookieHelpers.setToken(customerAccessToken.accessToken)
              this.$nuxt.$graphql.default.setHeader('authorization', `Bearer ${customerAccessToken.accessToken}`)
            }

            SweetAlertToast.fire({ icon: 'success', text: feedbackOk })
          } else {
            SweetAlertToast.fire({ icon: 'error', text: customerUserErrors[0].message })
          }
        })
        .catch(() => {
          SweetAlertToast.fire({ icon: 'error', text: feedbackKo })
        })
    },
  },
})

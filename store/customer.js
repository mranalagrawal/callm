import { defineStore } from 'pinia'
import themeConfig from '~/config/themeConfig'
import { useCustomerOrders } from '~/store/customerOrders.ts'
import { getIconAsImg } from '~/utilities/icons'
import { SweetAlertConfirm, SweetAlertToast } from '~/utilities/Swal'
import customerAccessTokenCreate from '~/graphql/mutations/authenticateUser'
// import { useCustomerWishlist } from '@/store/customerWishlist'

import { regexRules } from '@/utilities/validators'

function setCustomerWishlist(value) {
  const json = JSON.parse(value)
  return json.filter(product => new RegExp(regexRules('isProduct')).test(product))
}

// Note: Backend should use enums here 'GOLD' | 'B2B' | 'MAIN', this way we could simplify this to an array
const availableUsers = {
  list_gold: 'gold',
  list_b2b: 'b2b',
  main: 'main',
}

export const useCustomer = defineStore({
  id: 'customer',
  state: () => ({
    customer: {
      acceptsMarketing: false,
      firstName: '',
      id: '',
      lastName: '',
      email: '',
      phone: '',
      orders_count: '',
      total_spent: '',
      validated: false,
    },
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
    getCustomerType(state) {
      const userType = (state.customer.tags && state.customer.tags.find(k => Object.keys(availableUsers).includes(k))) || 'main'
      return availableUsers[userType]
    },
  },

  actions: {
    async login(email, password) {
      let valid = false

      // call cww api before make login
      await this.$nuxt.$cmw.$post('/customers/check-login', {
        email,
        password,
      })
        .then(() => {})
        .catch((err) => {
          this.$nuxt.$sentry.captureException(`Catch on check-login: ${err.response?.data?.error || err}`)
        })

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
        this.$nuxt.$cookieHelpers.setToken(token)
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

    async getCustomer(event = '') {
      const customerOrders = useCustomerOrders()
      await this.$nuxt.$cmwRepo.customer.getCustomer()
        .then(async ({ customer }) => {
          if (customer) {
            await customerOrders.getOrders('processed_at:>2010-01-01')
            await this.$nuxt.$cmw.$get(`/customers/${customer.id.substring(`${customer.id}`.lastIndexOf('/') + 1)}/user-info`)
              .then(({ data = {}, errors = [] }) => {
                if (errors.length) {
                  this.$nuxt.$handleApiErrors('error getCustomer')
                } else {
                  customer = {
                    ...customer,
                    ...data,
                  }
                }
              })

            // Todo: Remove this when done with Vuex
            this.$nuxt.store.commit('user/setUser', {
              token: this.$nuxt.$cookieHelpers.getToken(),
              customer,
            })
            this.$patch({
              customer,
              wishlistArr: (customer.wishlist && customer.wishlist.value) ? setCustomerWishlist(customer.wishlist.value) : [],
            })

            if (event) {
              await this.$nuxt.$cmwGtmUtils.resetDatalayerFields()

              this.$nuxt.$gtm.push({
                event,
                userType: themeConfig[this.$nuxt.$config.STORE].customerType,
                userId: this.customer.id,
                userFirstName: this.customer.firstName,
                userLastName: this.customer.lastName,
                userEmail: this.customer.email,
                userPhone: this.customer.phone,
                userPurchasesCount: this.customer.orders_count,
                userPurchasesTot: this.customer.total_spent,
              })
            }
          } else {
            await SweetAlertToast.fire({ text: this.$nuxt.app.i18n.t('common.feedback.KO.login') })
          }
        })
    },
    async logout() {
      const customerOrders = useCustomerOrders()
      this.$nuxt.$gtm.push({
        event: 'logout',
        userType: themeConfig[this.$nuxt.$config.STORE].customerType,
        userId: this.customer.id,
        userFirstName: this.customer.firstName,
        userLastName: this.customer.lastName,
        userEmail: this.customer.email,
        userPhone: this.customer.phone,
      })
      this.$nuxt.store.commit('user/setUser', null)
      await this.$nuxt.$cookieHelpers.onLogout()
      this.$reset()
      customerOrders.$reset()
      this.$nuxt.$cookies.remove('newsletter')
      this.$nuxt.$graphql.default.setHeader('authorization', '')
      this.$nuxt.$cmw.setHeader('X-Shopify-Customer-Access-Token', undefined)
      window.google_tag_manager[this.$nuxt.app.$config.gtm.id] && window.google_tag_manager[this.$nuxt.app.$config.gtm.id].dataLayer.reset()
      await this.$nuxt.app.router.push(this.$nuxt.app.localePath('/'))
    },

    async addToWishlist(args) {
      const customerAccessToken = this.$nuxt.$cookieHelpers.getToken()
      const shopifyCustomerId = `${this.customer.id}`.substring(`${this.customer.id}`.lastIndexOf('/') + 1)
      this.$nuxt.$cmw.setHeader('X-Shopify-Customer-Access-Token', customerAccessToken)
      await this.$nuxt.$cmw.$post('/wishlists', {
        shopifyCustomerId,
        productFeId: args.id,
      }).then(async () => {
        await this.getCustomer().then(async () => {
          SweetAlertToast.fire({
            iconHtml: getIconAsImg('success'),
            text: this.$nuxt.app.i18n.t('common.feedback.OK.wishlistAdded'),
          })

          await this.$nuxt.$cmwGtmUtils.resetDatalayerFields()

          this.$nuxt.$gtm.push({
            event: 'addToWishlist',
            wishlistAddedProduct: {
              products: [{
                ...args.gtmProductData,
              }],
            },
          })
        })
      })
        .catch(() => {
          SweetAlertToast.fire({
            icon: 'error',
            text: this.$nuxt.app.i18n.t('common.feedback.KO.unknown'),
          })
        })
    },

    async removeFromWishlist(args) {
      const customerAccessToken = this.$nuxt.$cookieHelpers.getToken()
      const shopifyCustomerId = `${this.customer.id}`.substring(`${this.customer.id}`.lastIndexOf('/') + 1)
      await this.$nuxt.$cmw.setHeader('X-Shopify-Customer-Access-Token', customerAccessToken)
      await this.$nuxt.$cmw.$put('/wishlists', {
        shopifyCustomerId,
        productFeId: args.id,
      }).then(async () => {
        await this.getCustomer().then(async () => {
          SweetAlertToast.fire({
            iconHtml: getIconAsImg('success'),
            text: this.$nuxt.app.i18n.t('common.feedback.OK.wishlistRemoved'),
          })
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
          preConfirm: () => this.removeFromWishlist(args),
        }).then(() => {})
      } else {
        this.addToWishlist(args).then(() => {})
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

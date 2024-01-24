import { defineStore } from 'pinia'

import { awaitPromise, djb2Hash } from '~/utilities/strings'
import { getCustomerId } from '~/utilities/shopify'
import { SweetAlertToast } from '~/utilities/Swal'
import { useCart } from '~/store/cart'
import { useCheckout } from '~/store/checkout'
import { useCustomerOrders } from '~/store/customerOrders.ts'
import { useCustomerWishlist } from '~/store/customerWishlist'

import customerAccessTokenCreate from '~/graphql/mutations/authenticateUser'
import customerAccessTokenCreateWithMultipass from '~/graphql/mutations/authenticateUserWithMultipass'
import themeConfig from '~/config/themeConfig'

// Note: Backend should use enums here 'GOLD' | 'B2B' | 'MAIN', this way we could simplify this to an array
const availableUsers = {
  LIST_GOLD: 'gold',
  list_gold: 'gold',
  list_b2b: 'b2b',
  main: 'main',
}

export const useCustomer = defineStore({
  id: 'customer',
  state: () => ({
    customer: {
      acceptsMarketing: false,
      amountSpent: { value: '' },
      billing: { value: '' },
      email: '',
      firstName: '',
      id: '',
      isCheckoutMigrated: { value: false },
      lastIncompleteCart: { value: { id: '' } },
      lastIncompleteCheckout: { id: '' },
      lastName: '',
      newsletterFrequency: { value: '' },
      numberOfOrders: '',
      phone: '',
      tags: [],
    },
    // FixMe: on Nuxt 3 or using GraphQl local storage properly we shouldn't need this,
    //  we need to reduce the extra objects and relay on the state,
    //  I believe there is an issue with deep watch, for some reason getters are not updating accordingly
    approved: false,
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
    customerId: (state) => {
      if (!state.customer.id) { return '' }

      return getCustomerId(state.customer.id)
    },
    getCustomerType: (state) => {
      const userType = (state.customer.tags && state.customer.tags.find(k => Object.keys(availableUsers).includes(k))) || 'main'
      return availableUsers[userType]
    },
  },

  actions: {

    async loginWithMultipass(multipassToken = '') {
      let valid = false

      const data
        = await this.$nuxt.$graphql.default.request(customerAccessTokenCreateWithMultipass, {
          multipassToken,
        })
          .then(data => data && data.customerAccessTokenCreateWithMultipass)

      const { customerAccessToken, customerUserErrors } = data
      if (customerAccessToken && customerAccessToken.accessToken && typeof customerAccessToken.accessToken === 'string') {
        const { accessToken, expiresAt } = customerAccessToken
        this.$nuxt.$cookieHelpers.setToken(accessToken, expiresAt)
        this.$nuxt.$graphql.default.setHeader('authorization', `Bearer ${accessToken}`)
        valid = true
      } else {
        SweetAlertToast.fire({
          icon: 'error',
          text: customerUserErrors[0].message,
        })
      }

      return valid
    },

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
        const { accessToken, expiresAt } = customerAccessToken
        this.$nuxt.$cookieHelpers.setToken(accessToken, expiresAt)
        this.$nuxt.$graphql.default.setHeader('authorization', `Bearer ${accessToken}`)
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
      await this.$nuxt.$cmwRepo.customer.getCustomer()
        .then(async ({ customer }) => {
          if (customer?.id) {
            // Todo: Implement shopify customerAccessTokenRenew
            const customerAccessToken = this.$nuxt.$cookieHelpers.getToken()
            const customerId = await awaitPromise(300).then(() => getCustomerId(customer.id))
            this.$nuxt.$cmw.setHeader('X-Shopify-Customer-Access-Token', customerAccessToken)

            const approved = (customer.approved && customer.approved.value) ? JSON.parse(customer.approved.value) : false

            this.$patch({
              customer,
              billing: (customer.billing && customer.billing.value) ? JSON.parse(customer.billing.value) : [],
              approved,
            })

            if (this.$nuxt.$cmwStore.isB2b && approved) {
              const hashedValue = djb2Hash(this.$nuxt.$cookieHelpers.getToken())
              this.$nuxt.$cookies.set('b2b-approved', hashedValue, {
                sameSite: 'none',
                secure: true,
              })
            }

            const cartStore = useCart()
            const cartIdCookie = this.$nuxt.$cookies.get('cartId')
            const lastIncompleteCart = customer.lastIncompleteCart?.value && JSON.parse(customer.lastIncompleteCart?.value)

            if (cartIdCookie) {
              if (customer.lastIncompleteCheckout?.id && !customer.isCheckoutMigrated?.value) {
                await cartStore.mergeCartCookieWithCheckoutId(customer.lastIncompleteCheckout?.id, cartIdCookie)
                await this.$nuxt.$cmw.$post(`/customers/${customerId}/set-checkout-migrated`)
              } else if (lastIncompleteCart?.id && lastIncompleteCart?.id !== cartIdCookie) {
                await cartStore.mergeCartCookieWithLastIncompleteCart(lastIncompleteCart, cartIdCookie)
              } else {
                await cartStore.getCartById(cartIdCookie)
              }
            } else {
              if (customer.lastIncompleteCheckout?.id && !lastIncompleteCart?.id && !customer.isCheckoutMigrated?.value) {
                const checkout = await useCheckout().getCheckoutById(customer.lastIncompleteCheckout?.id)

                if (checkout) {
                  await cartStore.mutateShopifyCheckoutIntoCart(checkout)
                  await this.$nuxt.$cmw.$post(`/customers/${customerId}/set-checkout-migrated`)
                }
              } else if (lastIncompleteCart?.id) {
                await cartStore.getCartById(lastIncompleteCart.id)
              }
            }

            if (event) {
              await this.$nuxt.$cmwGtmUtils.resetDatalayerFields()

              this.$nuxt.$gtm.push({
                event,
                userEmail: this.customer.email,
                userFirstName: this.customer.firstName,
                userId: this.customerId,
                userLastName: this.customer.lastName,
                userPhone: this.customer.phone,
                userPurchasesCount: this.customer.numberOfOrders,
                userPurchasesTot: this.customer.amountSpent?.value,
                userType: themeConfig[this.$nuxt.$config.STORE].customerType,
              })
            }
          } else {
            await SweetAlertToast.fire({ text: this.$nuxt.app.i18n.t('common.feedback.KO.login') })
          }
        })
        .catch(() => {
          SweetAlertToast.fire({ text: this.$nuxt.app.i18n.t('common.feedback.KO.login') })
        })
    },

    async logout() {
      const customerOrders = useCustomerOrders()
      const customerWishlist = useCustomerWishlist()
      const checkoutStore = useCheckout()
      const cartStore = useCart()

      this.$nuxt.$gtm.push({
        event: 'logout',
        userType: themeConfig[this.$nuxt.$config.STORE].customerType,
        userId: this.customerId,
        userFirstName: this.customer.firstName,
        userLastName: this.customer.lastName,
        userEmail: this.customer.email,
        userPhone: this.customer.phone,
      })
      this.$nuxt.$cookieHelpers.onLogout()
      this.$reset()
      customerOrders.$reset()
      customerWishlist.$reset()
      // TODO: Create a fresh checkout and add current items to it
      checkoutStore.$reset()
      cartStore.$reset()

      this.$nuxt.$cookies.remove('checkoutId')
      this.$nuxt.$cookies.remove('cartId')
      this.$nuxt.$cookies.remove('newsletter')
      this.$nuxt.$cookies.remove('b2b-approved')
      this.$nuxt.$graphql.default.setHeader('authorization', '')
      this.$nuxt.$cmw.setHeader('X-Shopify-Customer-Access-Token', undefined)
      window.google_tag_manager && window.google_tag_manager[this.$nuxt.app.$config.gtm.id] && window.google_tag_manager[this.$nuxt.app.$config.gtm.id].dataLayer.reset()
      await this.$nuxt.app.router.push(this.$nuxt.app.localePath('/'))
    },

    async customerUpdateData(customer = {}, feedbackOk = '', feedbackKo = '') {
      await this.$nuxt.$cmwRepo.customer.customerUpdate(customer)
        .then(({ customerUpdate: { customer, customerAccessToken, customerUserErrors } }) => {
          if (customer && customer.id) {
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

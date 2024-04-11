import { defineStore } from 'pinia'

import { useCart } from '~/store/cart'
import { useCheckout } from '~/store/checkout'
import { useCustomerOrders } from '~/store/customerOrders'
import { useCustomerWishlist } from '~/store/customerWishlist'

import themeConfig from '~/config/themeConfig'
import customerAccessTokenCreate from '~/graphql/mutations/authenticateUser.graphql'
import customerAccessTokenCreateWithMultipass from '~/graphql/mutations/authenticateUserWithMultipass.graphql'
import type { IEditingCustomer, IMappedCustomer, IShopifyCustomer } from '~/types/customer'
import { getCustomerId } from '~/utilities/shopify'
import { djb2Hash } from '~/utilities/strings'
import { SweetAlertToast } from '~/utilities/Swal'

interface IState {
  customer: IMappedCustomer
  editingCustomer: IEditingCustomer
}

// Note: Backend should use enums here 'GOLD' | 'B2B' | 'MAIN', this way we could simplify this to an array
type availableUsersKeys = 'LIST_GOLD' | 'list_gold' | 'list_b2b' | 'main'
export type availableUsersValues = 'gold' | 'b2b' | 'main'

const availableUsers: { [key in availableUsersKeys]: availableUsersValues } = {
  LIST_GOLD: 'gold',
  list_gold: 'gold',
  list_b2b: 'b2b',
  main: 'main',
}

export const useCustomer = defineStore({
  id: 'customer',
  state: () => <IState>({
    customer: {
      acceptsMarketing: false,
      amountSpent: '',
      approved: false,
      billing: null,
      createdAt: undefined,
      defaultAddress: null,
      displayName: '',
      email: '',
      firstName: '',
      id: '',
      isCheckoutMigrated: false,
      lastIncompleteCart: null,
      lastIncompleteCheckout: '',
      lastName: '',
      newsletterFrequency: '',
      numberOfOrders: '',
      phone: '',
      tags: [],
    },
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
      const availableUsersKeys = Object.keys(availableUsers)
      const userType: availableUsersKeys = state.customer.tags
        .find(k => availableUsersKeys.includes(k)) as availableUsersKeys || 'main'
      return availableUsers[userType]
    },
  },

  actions: {
    setMappedCustomer(customer: IShopifyCustomer) {
      const {
        acceptsMarketing,
        amountSpent,
        billing,
        createdAt,
        defaultAddress,
        email,
        firstName,
        id,
        isCheckoutMigrated,
        lastIncompleteCart,
        lastIncompleteCheckout,
        lastName,
        newsletterFrequency,
        numberOfOrders,
        phone,
        tags,
      } = customer

      this.$patch({
        customer: {
          acceptsMarketing,
          amountSpent: amountSpent?.value || '',
          approved: customer.approved?.value === 'true',
          billing: billing?.value ? JSON.parse(billing.value) : null,
          createdAt,
          defaultAddress,
          email,
          firstName,
          id,
          isCheckoutMigrated: isCheckoutMigrated?.value === 'true',
          lastIncompleteCart: lastIncompleteCart?.value ? JSON.parse(lastIncompleteCart.value) : null,
          lastIncompleteCheckout: lastIncompleteCheckout?.id || '',
          lastName,
          newsletterFrequency: newsletterFrequency?.value || '',
          numberOfOrders,
          phone,
          tags,
        },
      })
    },

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

    async login(email: string, password: string) {
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

    removeCookies() {
      this.$nuxt.$cookies.remove('b2b-approved')
      this.$nuxt.$cookies.remove('cartId')
      this.$nuxt.$cookies.remove('checkoutId')
      this.$nuxt.$cookies.remove('newsletter')
    },

    setB2bLogin() {
      const hashedValue = djb2Hash(this.$nuxt.$cookieHelpers.getToken())
      // We cannot read the expiration date from the session cookie and set it to the b2b-approved cookie,
      // so instead we will set the expiration date as 1 month from now
      const expires = new Date()
      expires.setMonth(expires.getMonth() + 1)
      const currentDate = new Date()
      const maxAge = Math.floor((+expires - +currentDate) / 1000)

      this.$nuxt.$cookies.set('b2b-approved', hashedValue, {
        expires,
        maxAge,
        path: '/',
        sameSite: 'none',
        secure: true,
      })
    },

    async getCustomer() {
      // Note: this is a temporary solution, in time, the cookies flow will work as expected
      // this.removeCookies()
      this.$nuxt.$cookies.remove('b2b-approved')
      this.$nuxt.$cookies.remove('checkoutId')
      this.$nuxt.$cookies.remove('newsletter')

      await this.$nuxt.$cmwRepo.customer.getCustomer()
        .then(async ({ customer }: Record<string, any>) => {
          if (customer?.id) {
            // Todo: Implement shopify customerAccessTokenRenew
            const customerAccessToken = this.$nuxt.$cookieHelpers.getToken()
            this.$nuxt.$cmw.setHeader('X-Shopify-Customer-Access-Token', customerAccessToken)
            const approved = (customer.approved && customer.approved.value) ? JSON.parse(customer.approved.value) : false

            this.setMappedCustomer(customer);

            (this.$nuxt.$cmwStore.isB2b && approved) ? this.setB2bLogin() : this.$nuxt.$cookies.remove('b2b-approved')
          } else {
            this.$nuxt.$cookieHelpers.onLogout()
            await SweetAlertToast.fire({ text: this.$nuxt.app.i18n.t('common.feedback.KO.login') })
          }
        })
        .catch(() => {
          this.$nuxt.$cookieHelpers.onLogout()
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
        userType: themeConfig[this.$nuxt.$cmwStore.settings.store]?.customerType,
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

      this.removeCookies()
      this.$nuxt.$graphql.default.setHeader('authorization', '')
      this.$nuxt.$cmw.setHeader('X-Shopify-Customer-Access-Token', undefined)
      window.google_tag_manager && window.google_tag_manager[this.$nuxt.app.$config.gtm.id] && window.google_tag_manager[this.$nuxt.app.$config.gtm.id].dataLayer.reset()
      await this.$nuxt.app.router?.push(this.$nuxt.app.localePath('/'))
    },

    async customerUpdateData(customer = {}, feedbackOk = '', feedbackKo = '') {
      await this.$nuxt.$cmwRepo.customer.customerUpdate(customer)
        .then(({ customerUpdate: { customer, customerAccessToken, customerUserErrors } }: any) => {
          if (customer && customer.id) {
            this.setMappedCustomer(customer)

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

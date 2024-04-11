import getCart from '@/graphql/queries/getCart'
import getCheckoutById from '@/graphql/queries/getCheckoutById'
import getCustomer from '@/graphql/queries/getCustomer'
import customerUpdate from '~/graphql/mutations/customer/customerUpdate'
import { SweetAlertToast } from '~/utilities/Swal'

export default ctx => ({
  async getCustomer() {
    try {
      const { customer } = await ctx.$graphql.default.request(getCustomer, {
        lang: ctx.i18n.locale.toUpperCase(),
        customerAccessToken: ctx.$cookieHelpers.getToken(),
      })

      return { customer }
    } catch (e) {
      SweetAlertToast.fire({
        icon: 'error',
        text: e.response?.errors[0]?.message || ctx.i18n.t('common.feedback.KO.unknown').toString(),
      })
      return { customer: null }
    }
  },

  // TODO: Move this to the right repository (CartRepository)
  async getCart(id) {
    try {
      const { cart } = await ctx.$graphql.default.request(getCart, {
        lang: ctx.i18n.locale.toUpperCase(),
        id,
      })

      return { cart }
    } catch (e) {
      SweetAlertToast.fire({
        icon: 'error',
        text: e.response?.errors[0]?.message || ctx.i18n.t('common.feedback.KO.unknown').toString(),
      })
      return { cart: null }
    }
  },

  async getCheckout(id) {
    try {
      const { node } = await ctx.$graphql.default.request(getCheckoutById, {
        lang: ctx.i18n.locale.toUpperCase(),
        id,
      })

      return { node }
    } catch (e) {
      SweetAlertToast.fire({
        icon: 'error',
        text: e.response?.errors[0]?.message || ctx.i18n.t('common.feedback.KO.unknown').toString(),
      })
      return { node: null }
    }
  },

  customerUpdate(customer) {
    return ctx.$graphql.default.request(customerUpdate, {
      lang: ctx.i18n.locale.toUpperCase(),
      customerAccessToken: ctx.$cookieHelpers.getToken(),
      customer,
    })
  },
})

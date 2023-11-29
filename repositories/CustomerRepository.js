import getCustomer from '@/graphql/queries/getCustomer'
import getCart from '@/graphql/queries/getCart'
import customerUpdate from '@/graphql/mutations/customerUpdate'
import getCheckoutById from '@/graphql/queries/getCheckoutById'

export default ctx => ({
  async getCustomer() {
    try {
      const { customer } = await ctx.$graphql.default.request(getCustomer, {
        lang: ctx.i18n.locale.toUpperCase(),
        customerAccessToken: ctx.$cookieHelpers.getToken(),
      })

      return { customer }
    } catch (e) {
      // TODO: maybe implement sentry in the future
      throw new Error(ctx.$i18n.t('feedback.KO.unknown').toString())
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
      throw new Error(ctx.$i18n.t('feedback.KO.unknown').toString())
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
      throw new Error(ctx.$i18n.t('feedback.KO.unknown').toString())
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

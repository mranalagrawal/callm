import getCustomer from '@/graphql/queries/getCustomer'
import customerUpdate from '@/graphql/mutations/customerUpdate'

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

  customerUpdate(customer) {
    return ctx.$graphql.default.request(customerUpdate, {
      lang: ctx.i18n.locale.toUpperCase(),
      customerAccessToken: ctx.$cookieHelpers.getToken(),
      customer,
    })
  },
})

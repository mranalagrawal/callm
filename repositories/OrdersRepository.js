import getCustomerOrders from '@/graphql/queries/getCustomerOrders'

// export default $graphql => resources => ({
export default ctx => ({
  getAll(query) {
    return ctx.$graphql.default.request(getCustomerOrders, {
      lang: ctx.i18n.locale.toUpperCase(),
      customerAccessToken: ctx.$cookieHelpers.getToken(),
      query,
    })
  },

  requestAssistance(formData) {
    return ctx.$http.$post('send-email', formData)
  },

})

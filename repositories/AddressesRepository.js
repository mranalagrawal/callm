import getCustomerAddresses from '@/graphql/queries/getCustomerAddresses'
import customerDefaultAddressUpdate from '~/graphql/mutations/customerDefaultAddressUpdate'

export default ctx => ({
  async getCustomerAddresses() {
    try {
      const { customer: { defaultAddress, addresses } } = await ctx.$graphql.default.request(getCustomerAddresses, {
        lang: ctx.i18n.locale.toUpperCase(),
        customerAccessToken: ctx.$cookieHelpers.getToken(),
      })

      return { defaultAddress, addresses: addresses.nodes }
    } catch (e) {
      // TODO: maybe implement sentry in the future
      throw new Error(ctx.i18n.t('common.feedback.KO.unknown').toString())
    }
  },
  async setAddressAsDefault(addressId) {
    try {
      const { customerDefaultAddressUpdate: { customer, customerUserErrors } } = await ctx.$graphql.default.request(customerDefaultAddressUpdate, {
        lang: ctx.i18n.locale.toUpperCase(),
        customerAccessToken: ctx.$cookieHelpers.getToken(),
        addressId,
      })

      return { customer, customerUserErrors }
    } catch (e) {
      throw new Error(ctx.i18n.t('common.feedback.KO.unknown').toString())
    }
  },
})

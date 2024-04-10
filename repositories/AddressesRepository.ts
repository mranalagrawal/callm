import type { Context } from '@nuxt/types'

import customerDefaultAddressUpdate from '~/graphql/mutations/customerDefaultAddressUpdate.graphql'
import getCustomerAddresses from '~/graphql/queries/getCustomerAddresses.graphql'
import type { IMailingAddress } from '~/types/mailingAddress'

export default (ctx: Context) => ({
  async getCustomerAddresses(): Promise<{ defaultAddress: IMailingAddress; addresses: IMailingAddress[] }> {
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
  async setAddressAsDefault(addressId: IMailingAddress['id']) {
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

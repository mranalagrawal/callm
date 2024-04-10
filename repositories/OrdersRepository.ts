import type { Context } from '@nuxt/types'

import getCustomerOrders from '@/graphql/queries/getCustomerOrders.graphql'
import type { IShopifyCustomer } from '~/types/customer'

export default (ctx: Context) => ({
  async getAll(query: string): Promise<IShopifyCustomer | null> {
    // TODO: Type repositories.ts when the other branches are merged
    try {
      const { customer } = await ctx.$graphql.default.request(getCustomerOrders, {
        lang: ctx.i18n.locale.toUpperCase(),
        customerAccessToken: ctx.$cookieHelpers.getToken(),
        query,
      })

      return customer || []
    } catch (err) {
      ctx.$handleApiErrors(`Catch on getOrders from Shopify: query: ${query} error: ${err}`)
      return null
    }
  },

  requestAssistance(formData: any) {
    return ctx.$http.$post('send-email', formData)
  },

})

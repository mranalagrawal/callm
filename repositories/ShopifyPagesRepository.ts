import type { Context } from '@nuxt/types'

import getPage from '@/graphql/queries/getPage.graphql'
import { initialShopifyPageData } from '~/config/shopifyConfig'
import type { IShopifyPage } from '~/types/shopifyPage'

export default ({ $graphql, i18n, $handleApiErrors }: Context) => ({
  async getPageByHandle(handle = ''): Promise<IShopifyPage> {
    try {
      const { page } = await $graphql.default.request(getPage, {
        lang: i18n.locale.toUpperCase(),
        handle,
      })

      return page
    } catch (err) {
      $handleApiErrors(`Catch getting getPageByHandle (${handle}) from Shopify: ${err}`)
      return initialShopifyPageData
    }
  },
})

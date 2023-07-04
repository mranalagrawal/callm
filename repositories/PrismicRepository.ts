import type { Context } from '@nuxt/types'
import prismicConfig from '~/config/prismicConfig'
import type { TISO639, TStores } from '~/config/themeConfig'
import type { IPrismicPageData } from '~/types/prismic'
import { initialPageData } from '~/types/prismic'

export default ({ $config, $prismic, i18n, $handleApiErrors }: Context) => ({
  async getSingle({ page = '' }): Promise<IPrismicPageData> {
    try {
      const store = $config.STORE as TStores || 'CMW_UK'
      const locale = i18n.locale as TISO639

      const { data } = await $prismic.api.getSingle(page, {
        lang: prismicConfig[store]?.isoCode[locale],
      })

      return data
    } catch (err) {
      $handleApiErrors(`Catch getting page (${page}) from Shopify: ${err}`)
      return initialPageData
    }
  },
})

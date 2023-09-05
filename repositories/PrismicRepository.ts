import type { Context } from '@nuxt/types'
import { initialPageData } from '~/config/prismicConfig'
import type { TISO639 } from '~/config/themeConfig'
import type { IPrismicPageData, IPrismicPageParams } from '~/types/prismic'

export default ({ $prismic, $cmwStore, i18n, $handleApiErrors }: Context) => ({
  async getSingle(page = ''): Promise<IPrismicPageData> {
    try {
      const locale = i18n.locale as TISO639

      const { data } = await $prismic.api.getSingle(page, {
        lang: $cmwStore.prismicSettings.isoCode[locale],
      })

      console.warn('PrismicRepository: getSingle', data)
      return data
    } catch (err) {
      $handleApiErrors(`Catch getting page (${page}) from Prismic: ${err}`)
      return initialPageData
    }
  },
  async getByUID({ page = '', uid }: IPrismicPageParams): Promise<any> {
    try {
      const locale = i18n.locale as TISO639

      const { data } = await $prismic.api.getByUID(page, uid, {
        lang: $cmwStore.prismicSettings.isoCode[locale],
      })

      return data
    } catch (err) {
      $handleApiErrors(`Catch getting page (${page}) with uid (${uid}) from Prismic: ${err}`)
      return initialPageData
    }
  },
})

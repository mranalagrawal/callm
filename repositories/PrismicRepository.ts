import type { Context } from '@nuxt/types'
import { initialPageData } from '~/config/prismicConfig'
import type { TISO639 } from '~/config/themeConfig'
import type { IPrismicPageData, IPrismicPageParams, TPrismicIsoCodes } from '~/types/prismic'

export default ({ $prismic, $cmwStore, i18n, $handleApiErrors }: Context) => ({
  async getSinglePage(page = ''): Promise<Record<string, any>> {
    try {
      const locale = i18n.locale as TISO639

      const { data } = await $prismic.api.getSingle(page, {
        lang: $cmwStore.prismicSettings.isoCode[locale],
      })

      return data
    } catch (err) {
      $handleApiErrors(`Catch getting page (${page}) from Prismic: ${err}`)
      return {}
    }
  },
  async getSingle(page = '', lang?: TPrismicIsoCodes): Promise<IPrismicPageData> {
    try {
      const locale = i18n.locale as TISO639

      const { data } = await $prismic.api.getSingle(page, {
        lang: lang || $cmwStore.prismicSettings.isoCode[locale],
      })

      return data
    } catch (err) {
      $handleApiErrors(`Catch getting page (${page}) from Prismic: ${err}`)
      return initialPageData
    }
  },
  async getPageByUID({ page = '', uid }: IPrismicPageParams): Promise<any> {
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

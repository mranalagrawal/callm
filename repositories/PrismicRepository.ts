import type { Context } from '@nuxt/types'

import type { IPrismicPageData, IPrismicPageParams, TPrismicIsoCodes } from '~/types/prismic'
import type { TISO639 } from '~/config/themeConfig'

import { initialPageData } from '~/config/prismicConfig'

export default ({ $prismic, $cmwStore, i18n, $handleApiErrors }: Context) => ({
  async getSinglePage(page = ''): Promise<Record<string, any>> {
    try {
      const locale = i18n.locale as TISO639

      const { data } = await $prismic.api.getSingle(page, {
        lang: $cmwStore.prismicSettings.isoCode[locale],
      })

      return data
    } catch (err) {
      if (err !== 'TypeError: Network request failed') {
        $handleApiErrors(`Catch on getSinglePage (${page}) from Prismic: ${err}`)
      }
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
      if (err !== 'TypeError: Network request failed') {
        $handleApiErrors(`Catch on getSingle (${page}) from Prismic: ${err}`)
      }
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
      if (err !== 'TypeError: Network request failed') {
        $handleApiErrors(`Catch on getPageByUID (${page}) with uid (${uid}) from Prismic: ${err}`)
      }
      return initialPageData
    }
  },
})

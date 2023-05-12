<script lang="ts">
import { defineComponent, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import { generateHeadHreflang } from '@/utilities/arrays'
import type { TISO639, TStores } from '~/config/themeConfig'
import themeConfig from '~/config/themeConfig'
import { initialPageData } from '~/types/prismic'
import type { IPrismicPageData } from '~/types/prismic'

export default defineComponent({
  layout({ $config }) {
    return $config.STORE
  },
  setup() {
    const { app, $cmwGtmUtils } = useContext()

    const hrefLang = {
      'it': 'https://www.callmewine.com/spedizioni.html',
      'en': 'https://www.callmewine.com/en/shipping.html',
      'fr': 'https://www.callmewine.fr/livraisons.html',
      'de': 'https://www.callmewine.de/lieferung.html',
      'en-gb': 'https://callmewine.co.uk/shipping',
    }

    const pageData = ref<IPrismicPageData>(initialPageData)

    useFetch(async ({ $config, $i18n, $handleApiErrors }) => {
      const store: TStores = $config.STORE || 'CMW_UK'
      const locale: TISO639 = $i18n.locale as TISO639

      await app.$prismic.api.getSingle(
        themeConfig[store]?.prismic.components.shippingPage,
        { lang: themeConfig[store]?.prismic.isoCode[locale] },
      )
        .then(({ data }: Record<string, any>) => {
          pageData.value = data
        })
        .catch((err: Error) => {
          $handleApiErrors(`Catch getting contact us data from prismic: ${err}`)
        })
    })

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    useMeta(() => ({
      link: generateHeadHreflang(hrefLang),
    }))

    return { pageData }
  },
  head: {},
})
</script>

<template>
  <div v-if="pageData.title" class="cmw-max-w-screen-xl cmw-mx-auto cmw-p-4 cmw-mt-5">
    <h1 v-text="pageData.title" />
    <LoadingImage
      v-if="pageData.image"
      :thumbnail="{
        url: pageData.image.url ? `${pageData.image.url}?&width=20&height=12` : 'https://picsum.photos/id/75/20/12',
        width: 20,
        height: 12,
        altText: pageData.image.alt,
      }"
      :source="{
        url: pageData.image.url
          ? `${pageData.image.url}?&width=${pageData.image.dimensions.width}&height=${pageData.image.dimensions.height}`
          : 'https://picsum.photos/id/75/265/164',
        width: pageData.image.dimensions.width,
        height: pageData.image.dimensions.height,
        altText: pageData.image.alt,
      }"
    />
    <div v-for="(section, i) in pageData.section" :key="i" class="cmw-mt-5">
      <PrismicRichText :field="[section]" />
    </div>
  </div>
</template>

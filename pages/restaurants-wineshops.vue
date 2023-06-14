<script lang="ts">
import { defineComponent, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import { generateHeadHreflang } from '@/utilities/arrays'
import prismicConfig from '~/config/prismicConfig'
import type { TStores } from '~/config/themeConfig'
import { initialPageData } from '~/types/prismic'
import type { IPrismicPageData } from '~/types/prismic'

export default defineComponent({
  layout({ $config }) {
    return $config.STORE
  },
  setup() {
    const { $cmwGtmUtils } = useContext()

    const hrefLang = {
      'it': 'https://www.callmewine.com/enoteche-ristoranti.html',
      'en': 'https://www.callmewine.com/en/restaurants-Wineshops.html',
      'fr': 'https://www.callmewine.fr/cave-%C3%A0-vins-ou-restaurants.html',
      'de': 'https://www.callmewine.de/%C3%96nothek-Restaurants.html',
      'en-gb': 'https://callmewine.co.uk/restaurants-wineshops',
    }

    const pageData = ref<IPrismicPageData>(initialPageData)

    useFetch(async ({ $config, $cmwRepo, $handleApiErrors }) => {
      await $cmwRepo.prismic.getSingle({ page: prismicConfig[$config.STORE as TStores]?.components.wineShops })
        .then(({ data }: Record<string, any>) => {
          pageData.value = data
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting contact us data from prismic: ${err}`))
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
  <div v-if="pageData.title" class="max-w-screen-xl mx-auto p-4 mt-5">
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
    <div v-for="(section, i) in pageData.section" :key="i" class="mt-5">
      <PrismicRichText :field="[section]" />
    </div>
  </div>
</template>

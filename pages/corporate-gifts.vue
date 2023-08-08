<script lang="ts">
import { defineComponent, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import { generateHeadHreflang } from '@/utilities/arrays'
import type { IPrismicPageData } from '~/types/prismic'
import { initialPageData } from '~/config/prismicConfig'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  middleware({ $cmwStore, localeRoute, redirect }) {
    if (!$cmwStore.isIt)
      return redirect(localeRoute('/') as unknown as string)
  },
  setup() {
    const { $cmwGtmUtils } = useContext()

    const hrefLang = {
      'it': 'https://www.callmewine.com/regali-aziendali.html',
      'en': 'https://www.callmewine.com/en/business-gifts.html',
      'fr': 'https://callmewine.fr/corporate-gifts',
      'de': 'https://callmewine.de/corporate-gifts',
      'en-gb': 'https://callmewine.co.uk/corporate-gifts',
    }

    const pageData = ref<IPrismicPageData>(initialPageData)

    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      pageData.value = await $cmwRepo.prismic.getByUID({
        page: 'static-page',
        uid: 'corporate-gifts',
      })
    })

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    useMeta(() => ({
      link: generateHeadHreflang(hrefLang),
    }))

    return {
      fetch,
      pageData,
    }
  },
  head: {},
  methods: { generateKey },
})
</script>

<template>
  <div v-if="pageData.title" class="max-w-screen-xl mx-auto mt-5 p-4">
    <PrismicRichText v-if="pageData.title" :field="pageData.title" />
    <LoadingImage
      v-if="pageData.main_banner"
      :thumbnail="{
        url: pageData.main_banner.url ? `${pageData.main_banner.url}?&width=20&height=12` : 'https://picsum.photos/id/75/20/12',
        width: 20,
        height: 12,
        altText: pageData.main_banner.alt,
      }"
      :source="{
        url: pageData.main_banner.url
          ? `${pageData.main_banner.url}?&width=${pageData.main_banner.dimensions.width}&height=${pageData.main_banner.dimensions.height}`
          : 'https://picsum.photos/id/75/265/164',
        width: pageData.main_banner.dimensions.width,
        height: pageData.main_banner.dimensions.height,
        altText: pageData.main_banner.alt,
      }"
    />
    <PrismicRichText :field="pageData.content" />
  </div>
</template>

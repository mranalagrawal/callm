<script lang="ts">
import { defineComponent, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'

import { initialPageData } from '~/config/prismicConfig'
import type { IPrismicPageData } from '~/types/prismic'
import { generateHeadHreflang } from '~/utilities/arrays'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  setup() {
    const { $cmwGtmUtils } = useContext()

    const hrefLang = {
      'it': 'https://www.callmewine.com/en/servizio-clienti.html',
      'en': 'https://www.callmewine.com/en/customer-service.html',
      'fr': 'https://callmewine.fr/customer-service',
      'de': 'https://callmewine.de/customer-service',
      'en-gb': 'https://callmewine.co.uk/customer-service',
    }

    const pageData = ref<IPrismicPageData>(initialPageData)

    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      pageData.value = await $cmwRepo.prismic.getPageByUID({
        page: 'static-page',
        uid: 'customer-service',
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
  <div v-if="pageData.title" class="prose max-w-screen-xl mx-auto mt-5 p-4">
    <PrismicRichText v-if="pageData.title" :field="pageData.title" />
    <LoadingImage
      v-if="pageData.main_banner?.url"
      img-classes="w-full"
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

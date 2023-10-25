<script lang="ts">
import { defineComponent, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import { generateHeadHreflang } from '~/utilities/arrays'
import { initialPageData } from '~/config/prismicConfig'
import type { IPrismicPageData } from '~/types/prismic'

export default defineComponent({
  setup() {
    const { $cmwGtmUtils } = useContext()

    const hrefLang = {
      'it': 'https://www.callmewine.com/privacy.html',
      'en': 'https://www.callmewine.com/en/privacy.html',
      'fr': 'https://www.callmewine.fr/politique-de-confidentialite.html',
      'de': 'https://www.callmewine.de/privacy.html',
      'en-gb': 'https://callmewine.co.uk/privacy',
    }

    const pageData = ref<IPrismicPageData>(initialPageData)

    useFetch(async ({ $cmwRepo }) => {
      pageData.value = await $cmwRepo.prismic.getSingle('privacy-policy')
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
  <div v-if="pageData.title" class="prose max-w-screen-xl mx-auto p-4 mt-5">
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

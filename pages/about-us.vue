<script lang="ts">
import { defineComponent, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import { generateHeadHreflang } from '~/utilities/arrays'
import { initialPageData } from '~/config/prismicConfig'
import type { IPrismicPageData } from '~/types/prismic'

export default defineComponent({
  setup() {
    const { $cmwGtmUtils } = useContext()

    const hrefLang = {
      'it': 'https://www.callmewine.com/chi-siamo.html',
      'en': 'https://www.callmewine.com/en/about-us.html',
      'fr': 'https://www.callmewine.fr/qui-nous-sommes.html',
      'de': 'https://www.callmewine.de/uber-uns.html',
      'en-gb': 'https://callmewine.co.uk/about-us',
    }

    const pageData = ref<IPrismicPageData>(initialPageData)
    const sectionContent = ref({ section: [] })

    const { fetch } = useFetch(async ({ $cmwRepo, $handleApiErrors }) => {
      await $cmwRepo.prismic.getSingle('about_us')
        .then((data) => {
          pageData.value = data
          sectionContent.value = data.section[0] ? data.section[0].section_content : []
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting about us data from prismic: ${err}`))
    })

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    useMeta(() => ({
      link: generateHeadHreflang(hrefLang),
    }))

    return { fetch, pageData, sectionContent }
  },
  head: {},
})
</script>

<template>
  <div v-if="pageData.title" class="max-w-screen-xl mx-auto mt-5 p-4">
    <h1 v-text="pageData.title" />
    <LoadingImage
      v-if="pageData.image"
      img-classes="w-full"
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
    <div v-for="(section, i) in sectionContent" :key="i" class="mt-5">
      <PrismicRichText :field="[section]" />
    </div>
  </div>
</template>

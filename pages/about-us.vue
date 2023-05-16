<script lang="ts">
import { defineComponent, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import { generateHeadHreflang } from '@/utilities/arrays'
import prismicConfig from '~/config/prismicConfig'
import type { TStores } from '~/config/themeConfig'
import type { IPrismicPageData } from '~/types/prismic'
import { initialPageData } from '~/types/prismic'

export default defineComponent({
  layout(context) {
    return context.$config.STORE
  },
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

    const { fetch } = useFetch(async ({ $config, $cmwRepo, $handleApiErrors }) => {
      await $cmwRepo.prismic.getSingle({ page: prismicConfig[$config.STORE as TStores]?.components.aboutUs })
        .then(({ data }) => {
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
    <div v-for="(section, i) in sectionContent" :key="i" class="cmw-mt-5">
      <PrismicRichText :field="[section]" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import { generateHeadHreflang } from '@/utilities/arrays'
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
    const sectionContent = ref<IPrismicPageData['section']>({ section: [] })

    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      await $cmwRepo.prismic.getSingle('cookie-policy')
        .then((data) => {
          pageData.value = data
          sectionContent.value = data.section[0] ? data.section : []
        })
    })

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    useMeta(() => ({
      link: generateHeadHreflang(hrefLang),
      /* script: {
        id: 'CookieDeclaration',
        src: 'https://consent.cookiebot.com/55bb6862-88ec-43e6-bd22-95823a1ed6ad/cd.js',
        hid: 'cookie-declaration',
        async: true,
      }, */
    }))

    return { fetch, pageData, sectionContent }
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
    <div v-for="(section, i) in sectionContent" :key="i" class="mt-5">
      <PrismicRichText :field="[section]" />
    </div>
    <script id="CookieDeclaration" src="https://consent.cookiebot.com/55bb6862-88ec-43e6-bd22-95823a1ed6ad/cd.js" async />
  </div>
</template>

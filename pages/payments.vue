<script lang="ts">
import { defineComponent, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import useGtm from '~/components/composables/useGtm'
import { generateHeadHreflang } from '@/utilities/arrays'
import { initialPageData } from '~/types/prismic'
import type { IPrismicPageData } from '~/types/prismic'

export default defineComponent({
  layout({ $config }) {
    return $config.STORE
  },
  setup() {
    const { app } = useContext()
    const { gtmPushPage } = useGtm()

    const hrefLang = {
      'it': 'https://www.callmewine.com/pagamenti.html',
      'en': 'https://www.callmewine.com/en/payments.html',
      'fr': 'https://www.callmewine.fr/paiements.html',
      'de': 'https://www.callmewine.de/zahlungen.html',
      'en-gb': 'https://callmewine.co.uk/payments',
    }

    const pageData = ref<IPrismicPageData>(initialPageData)

    useFetch(async ({ $i18n, handleApiErrors }) => {
      await app.$prismic.api.getSingle(
        'payments',
        { lang: $i18n.localeProperties.iso?.toLowerCase() },
      )
        .then(({ data }: Record<string, any>) => {
          pageData.value = data
        })
        .catch((err: Error) => {
          handleApiErrors(`Catch getting contact us data from prismic: ${err}`)
        })
    })

    onMounted(() => {
      process.browser && gtmPushPage('page')
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

<script lang="ts">
import { defineComponent, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import { generateHeadHreflang } from '~/utilities/arrays'
import type { IPrismicPageData } from '~/types/prismic'
import { initialPageData } from '~/config/prismicConfig'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  middleware({ $cmwStore, localeRoute, redirect }) {
    if (!($cmwStore.isIt || $cmwStore.isB2b)) { return redirect(localeRoute('/') as unknown as string) }
  },
  setup() {
    const { $cmwGtmUtils } = useContext()

    const hrefLang = {
      'it': 'https://www.callmewine.com/guida-vini.html',
      'en': 'https://www.callmewine.com/en/guida-vini.html',
      'fr': 'https://callmewine.fr/guide-to-our-wines',
      'de': 'https://callmewine.de/guide-to-our-wines',
      'en-gb': 'https://callmewine.co.uk/guide-to-our-wines',
    }

    const pageData = ref<IPrismicPageData>(initialPageData)
    const midParagraph = ref({
      primary: {},
      items: [],
      id: '',
      slice_type: '',
      slice_label: null,
    })

    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      await $cmwRepo.prismic.getPageByUID({
        page: 'static-page',
        uid: 'guide-to-our-wines',
      })
        .then((data) => {
          pageData.value = data
          midParagraph.value = data.body?.find((item: { slice_type: string }) => item.slice_type === 'paragraph')
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
      midParagraph,
    }
  },
  head: {},
  methods: { generateKey },
})
</script>

<template>
  <div v-if="pageData.title" class="max-w-screen-xl mx-auto mt-5 p-4">
    <PrismicRichText v-if="pageData.title" :field="pageData.title" />
    <PrismicRichText :field="pageData.content" />
    <div v-if="pageData.body?.[0]?.items" class="w-[min(100%,_62rem)] m-inline-auto py-12 grid gap-8 md:grid-cols-[100px_auto]">
      <template v-for="({ image, description }) in pageData.body?.[0].items">
        <PrismicImage :key="generateKey(image.url)" class="mx-auto" :field="image" width="100" height="100" />
        <PrismicRichText :key="generateKey(description[0]?.text)" :field="description" />
      </template>
    </div>
    <PrismicRichText v-if="!!midParagraph.items.length" :field="midParagraph.items[0].paragraph" />
    <div v-if="pageData.body?.[2]?.items" class="w-[min(100%,_62rem)] m-inline-auto py-12 grid gap-8 md:grid-cols-[100px_auto]">
      <template v-for="({ image, description }) in pageData.body?.[2].items">
        <PrismicImage :key="generateKey(image.url)" class="mx-auto" :field="image" width="100" height="100" />
        <PrismicRichText :key="generateKey(description[0]?.text)" :field="description" />
      </template>
    </div>
    <!-- Todo: Use Slice Machine properly -->
    <!--    <slice-zone :components="components" :slices="pageData.data.slices" /> -->
  </div>
</template>

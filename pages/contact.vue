<script lang="ts">
import { defineComponent, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { generateHeadHreflang } from '~/utilities/arrays'
import { initialPageData } from '~/config/prismicConfig'
import { useCustomer } from '~/store/customer'
import { useCustomerOrders } from '~/store/customerOrders'
import type { IPrismicPageData } from '~/types/prismic'

export default defineComponent({
  setup() {
    const customerStore = useCustomer()
    const { customer } = storeToRefs(customerStore)
    const customerOrders = useCustomerOrders()
    const { $cmwGtmUtils } = useContext()

    const hrefLang = {
      'it': 'https://www.callmewine.com/contatti.html',
      'en': 'https://www.callmewine.com/en/contatti.html',
      'fr': 'https://www.callmewine.fr/contatti.html',
      'de': 'https://www.callmewine.de/contatti.html',
      'en-gb': 'https://callmewine.co.uk/contact',
    }

    const pageData = ref<IPrismicPageData>(initialPageData)

    useFetch(async ({ $cmwRepo }) => {
      if (customer.value?.id) {
        await customerOrders.getOrders('processed_at:>2010-01-01')
      }
      pageData.value = await $cmwRepo.prismic.getSingle('contact_us')
    })

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    useMeta(() => ({
      link: generateHeadHreflang(hrefLang),
    }))

    return { customer, pageData }
  },
  head: {},
})
</script>

<template>
  <div v-if="pageData.title" class="prose max-w-screen-xl mx-auto p-4 mt-5">
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
    <div v-for="(section, i) in pageData.section" :key="i" class="mt-5">
      <PrismicRichText :field="[section]" />
    </div>
    <ContactForm />
  </div>
</template>

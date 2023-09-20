<script lang="ts">
import {
  computed, defineComponent,
  onMounted,
  ref,
  useContext,
  useMeta,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'

export default defineComponent({
  // middleware: 'url-checker',
  setup() {
    const { req } = useContext()
    const route = useRoute()
    const { $cmwGtmUtils } = useContext()

    const filtersObj = (key: string): string => ({
      V: 'winelists',
      C: 'categories',
      R: 'regions',
      D: 'dosagecontents',
      B: 'brands',
      N: 'countries',
      M: 'macros',
      A: 'vintages',
      F: 'sizes',
      null: 'selections',
    })[key] || ''

    const canonicalUrl = ref('')
    const {
      filter_key_1,
      filter_key_2,
      filter_key_3,
      filter_id_1,
      filter_id_2,
      filter_id_3,
    } = route.value.params

    /* Merge all url parameters */
    const inputParameters = computed<Record<string, any>>(() => ({
      ...route.value.query,
      ...((filter_key_1 && filter_id_1) && { [filtersObj(filter_key_1)]: filter_id_1 }),
      ...((filter_key_2 && filter_id_2) && { [filtersObj(filter_key_2)]: filter_id_2 }),
      ...((filter_key_3 && filter_id_3) && { [filtersObj(filter_key_3)]: filter_id_3 }),
    }))

    const isSearchPage = computed(() => Object.keys(inputParameters.value).includes('search'))

    if (process.server && req?.headers && req?.url) {
      const urlSearchParams = new URLSearchParams(req.url.slice(req.url.indexOf('?')))
      urlSearchParams.delete('page')

      const encodedPath = req?.url.split('?')[0] || ''
      // const encodedSearch = urlSearchParams.toString()

      // Add the question mark only if there are other query parameters left
      // const questionMark = encodedSearch ? '?' : ''
      canonicalUrl.value = `https://${req.headers.host}${encodedPath}`
    }

    if (process.client && typeof window !== 'undefined') {
      const {
        origin,
        pathname,
        search,
      } = window.location

      const urlSearchParams = new URLSearchParams(search)
      urlSearchParams.delete('page')

      const encodedPath = pathname || ''
      // const encodedSearch = urlSearchParams.toString()

      // Add the question mark only if there are other query parameters left
      // const questionMark = encodedSearch ? '?' : ''
      canonicalUrl.value = `${origin}${encodedPath}`
    }

    useMeta(() => ({
      link: !canonicalUrl.value
        ? []
        : [{
            rel: 'canonical',
            href: canonicalUrl.value,
          }],
    }))

    watch(() => inputParameters.value, () => {
      process.browser && $cmwGtmUtils.pushPage(isSearchPage.value ? 'searchresult' : 'list')
    })
    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage(isSearchPage.value ? 'searchresult' : 'list')
    })

    return {
      canonicalUrl,
      filtersObj,
      inputParameters,
    }
  },
  head: {},
})
</script>

<template>
  <SearchFilter :input-parameters="inputParameters" />
</template>

<script lang="ts">
import {
  computed, defineComponent,
  onMounted,
  ref,
  useContext,
  useFetch,
  useMeta,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'

export default defineComponent({
  layout({ $config }) {
    return $config.STORE
  },
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
      null: 'selections',
    })[key] || ''

    const canonicalUrl = ref('')
    const { filter_key_1, filter_key_2, filter_id_1, filter_id_2 } = route.value.params

    /* Merge all url parameters */
    const inputParameters = computed<Record<string, any>>(() => ({
      ...route.value.query,
      ...((filter_key_1 && filter_id_1) && { [filtersObj(filter_key_1)]: filter_id_1 }),
      ...((filter_key_2 && filter_id_2) && { [filtersObj(filter_key_2)]: filter_id_2 }),
    }))

    const isSearchPage = computed(() => Object.keys(inputParameters.value).includes('search'))

    useFetch(() => {
      if (process.server && req?.headers && req?.url)
        canonicalUrl.value = `https://${req.headers.host}${encodeURIComponent(req.url)}`

      if (process.client && typeof window !== 'undefined') {
        const { origin, pathname, search } = window.location
        const encodedPath = pathname ? encodeURIComponent(pathname) : ''
        const encodedSearch = search ? encodeURIComponent(search) : ''
        canonicalUrl.value = `${origin}${encodedPath}${encodedSearch}`
      }
    })

    useMeta(() => ({
      link: [{
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

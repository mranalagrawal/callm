<script lang="ts">
import {
  defineComponent,
  inject, onBeforeMount, provide, readonly,
  ref, useContext,
  useRoute,
  useRouter, watch,
} from '@nuxtjs/composition-api'
import chevronLeftIcon from 'assets/svg/chevron-left.svg'
import chevronRightIcon from 'assets/svg/chevron-right.svg'
import filterIcon from 'assets/svg/filter.svg'
import type { RawLocation } from 'vue-router'
import Loader from '~/components/UI/Loader.vue'
import { initialShopifyPageData } from '~/config/shopifyConfig'
import { shopifyRichTextToHTML } from '~/utilities/shopify'

interface IQuery {
  [key: string]: string | undefined
}

export default defineComponent({
  components: { Loader },
  setup() {
    // https://callmewine-api-staging.dojo.sh/api/products/search?stores=4&locale=de

    const { localeLocation, $cmwRepo, $cmwStore, $elastic, i18n } = useContext()
    const router = useRouter()
    const route = useRoute()
    const pageData = ref({})
    const inputParameters = ref({})
    const currentPage = ref({})
    const shortDescription = ref('')
    const results = ref([])
    const total = ref(0)
    const fetchState = ref({ pending: true, error: null })
    const aggregationsRef = ref({})
    const cmwActiveSelect = ref('')
    const isDesktop = inject('isDesktop')
    const showMobileFilters = ref(false)
    provide('showMobileFilters', showMobileFilters)
    provide('total', readonly(total))

    const handleUpdateTrigger = (key: string) => {
      cmwActiveSelect.value = cmwActiveSelect.value === key ? '' : key
    }

    const handleUpdateValueSelections = (id: string | number) => {
      cmwActiveSelect.value = ''
      // this.showMobileFilters = false
      const query: IQuery = { ...inputParameters.value, ...route.value.query }

      if (`${query[id]}` === 'true')
        delete query[id]
      else
        query[id] = 'true'

      // if (id !== this.active)
      if (id !== route.value.query[id])
        query.page = '1'

      router.push({
        path: '/catalog',
        query,
      })
    }

    const handleUpdateValue = (val: string) => {
      cmwActiveSelect.value = ''
      // this.showMobileFilters = false
      const { id, keyword } = JSON.parse(val)
      const query: IQuery = { ...inputParameters.value, ...route.value.query }

      if (`${query[keyword]}` === id.toString())
        delete query[keyword]
      else
        query[keyword] = id.toString()

      router.push({
        path: '/catalog',
        query,
      })
    }

    const handleOnFooterClick = ({ price_from = '', price_to = '' }) => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      router.push(localeLocation({
        path: '/catalog',
        query: {
          ...route.value.query,
          price_from,
          price_to,
          page: '1',
        },
      }) as RawLocation)
    }

    const sortBy = (field: any, direction: any) => {
      const query = {
        ...inputParameters.value,
        sort: field,
        direction,
      }

      router.push({
        path: '/catalog',
        query,
      })
    }

    const handleUpdateSortValue = (value: string) => {
      const { field, direction } = JSON.parse(value)
      sortBy(field, direction)
    }

    // Fixme: There's something redirecting the API calls on SSR, so these pages will load data on client
    /* const { fetch } = useFetch(async ({ $config, $elastic, $cmwRepo, $handleApiErrors, $route, $i18n }) => {
      await $cmwRepo.shopifyPages.getPageByHandle({ handle: $route.params.handle })
        .then(({ page }) => {
          if (!page || !Object.keys(page).length)
            return

          pageData.value = page
          inputParameters.value = page?.filters?.value && JSON.parse(page.filters.value)

          shortDescription.value = shopifyRichTextToHTML(page.shortDescription.value)
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting getPageByHandle from shopify: ${err}`))

      const mergedInputParameters = {
        ...inputParameters.value,
        ...route.value.query,
      }

      const store = $config.STORE as TStores
      const storeConfigId = themeConfig[store]?.id
      const urlSearchParams = new URLSearchParams(mergedInputParameters)
      urlSearchParams.set('stores', storeConfigId?.toString() || '')
      urlSearchParams.set('locale', $i18n.locale || '')
      const searchParams = urlSearchParams.toString()

      await $elastic.$get('/products/search', { searchParams })
        .then((data) => {
          const { hits, aggregations } = data as Record<string, any>
          results.value = hits.hits
          total.value = hits.total.value

          if (Object.keys(aggregations).length)
            aggregationsRef.value = aggregations
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting results.value = hits.hits from elastic: ${err}`))
    }) */

    async function fetchData() {
      fetchState.value = { pending: true, error: null }

      try {
        const shopifyPage = await $cmwRepo.shopifyPages.getPageByHandle(route.value.params.handle)

        inputParameters.value = shopifyPage?.filters?.value && JSON.parse(shopifyPage.filters.value)

        const mergedInputParameters = {
          ...inputParameters.value,
          ...route.value.query,
        }

        const urlSearchParams = new URLSearchParams(mergedInputParameters)
        urlSearchParams.set('stores', $cmwStore.settings.id.toString())
        urlSearchParams.set('locale', i18n.locale || '')
        const searchParams = urlSearchParams.toString()

        const productsSearch = await $elastic.$get('/products/search', { searchParams })
        fetchState.value.pending = false

        return { shopifyPage, productsSearch }
      } catch (error: any) {
        fetchState.value.pending = false
        fetchState.value.error = error

        return { shopifyPage: initialShopifyPageData, productsSearch: {}, links: null }
      }
    }

    async function fetchDataWithFetchState() {
      const { shopifyPage, productsSearch } = await fetchData()

      if (!shopifyPage || !Object.keys(shopifyPage).length)
        return

      pageData.value = shopifyPage
      shortDescription.value = shopifyRichTextToHTML(shopifyPage.shortDescription.value)

      const { hits, aggregations } = productsSearch as Record<string, any>
      results.value = hits.hits
      total.value = hits.total.value

      if (Object.keys(aggregations).length)
        aggregationsRef.value = aggregations
    }

    onBeforeMount(fetchDataWithFetchState)

    watch(() => route.value?.query, () => fetchDataWithFetchState())

    return {
      aggregationsRef,
      chevronLeftIcon,
      chevronRightIcon,
      cmwActiveSelect,
      currentPage,
      fetchState,
      filterIcon,
      handleOnFooterClick,
      handleUpdateSortValue,
      handleUpdateTrigger,
      handleUpdateValue,
      handleUpdateValueSelections,
      inputParameters,
      isDesktop,
      pageData,
      results,
      shortDescription,
      showMobileFilters,
      total,
    }
  },
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto py-4 px-4 mt-4">
    <template v-if="!!results.length && pageData && Object.keys(pageData).length">
      <h1 class="h3" v-text="pageData.title" />
      <CategoriesMainFilters
        v-if="Object.keys(inputParameters).length && Object.keys(aggregationsRef).length"
        :aggregations="aggregationsRef" :input-parameters="inputParameters"
        @item-clicked="handleUpdateValue"
      />

      <div v-if="isDesktop">
        <!-- Filter Components -->
        <CategoriesFiltersComponents
          v-if="Object.keys(inputParameters).length && Object.keys(aggregationsRef).length"
          :aggregations="aggregationsRef" :input-parameters="inputParameters"
          @update-value-selections="handleUpdateValueSelections"
          @update-value="handleUpdateValue"
          @handle-on-footer-click="handleOnFooterClick"
        />
      </div>
      <div v-html="shortDescription" />
      <ProductsResultsList :results="results" :total="total" @update-sort-value="handleUpdateSortValue" />
      <CategoriesPagination :total-pages="Math.ceil(total / 48)" :input-parameters="inputParameters" :base-path="`/pages/${$route.params.handle}`" />
      <div class="py-12" v-html="pageData?.body" />
      <div v-if="!isDesktop" class="sticky bottom-8 w-[min(100%,_14rem)] m-inline-auto">
        <Button @click.native="showMobileFilters = !showMobileFilters">
          <VueSvgIcon width="28" height="28" :data="filterIcon" />
          <span class="ml-2">{{ $t('search.showFilters') }}</span>
        </Button>
      </div>
      <CategoriesFiltersComponentsMobile
        v-if="!isDesktop && showMobileFilters && Object.keys(inputParameters).length && Object.keys(aggregationsRef).length"
        :aggregations="aggregationsRef" :input-parameters="inputParameters"
        @update-value-selections="handleUpdateValueSelections"
        @update-value="handleUpdateValue"
      />
    </template>
    <template v-else-if="!fetchState.pending">
      <p class="text-lg font-light mt-5">
        {{ $t('search.noResultsAlert') }}
      </p>
      <div v-html="$t('search.noResultsMessage')" />
    </template>
    <div class="fixed bottom-4 left-4">
      <pre>{{ fetchState }}</pre>
    </div>
    <Loader v-if="fetchState.pending" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject, provide, readonly,
  ref, useContext, useFetch, useMeta,
  useRoute,
  useRouter, watch,
} from '@nuxtjs/composition-api'
import chevronLeftIcon from 'assets/svg/chevron-left.svg'
import chevronRightIcon from 'assets/svg/chevron-right.svg'
import filterIcon from 'assets/svg/filter.svg'
import Loader from '~/components/UI/Loader.vue'
import type { IShopifyPage } from '~/types/shopifyPage'
import { shopifyRichTextToHTML } from '~/utilities/shopify'

interface IQuery {
  [key: string]: string | undefined
}

export default defineComponent({
  components: { Loader },
  setup() {
    const { localePath } = useContext()
    const router = useRouter()
    const route = useRoute()
    const pageData = ref<Record<string, any>>({})
    const inputParameters = ref({})
    const currentPage = ref({})
    const shortDescription = ref('')
    const results = ref([])
    const total = ref(0)
    const aggregationsRef = ref({})
    const cmwActiveSelect = ref('')
    const isDesktop = inject('isDesktop')
    const showMobileFilters = ref(false)
    const pageSeo = ref<IShopifyPage['seo']>({
      title: '',
      description: '',
    })
    provide('showMobileFilters', showMobileFilters)
    provide('total', readonly(total))

    const handleUpdateTrigger = (key: string) => {
      cmwActiveSelect.value = cmwActiveSelect.value === key ? '' : key
    }

    const handleUpdateValueSelections = (id: string | number) => {
      cmwActiveSelect.value = ''
      // this.showMobileFilters = false
      const query: IQuery = { ...inputParameters.value, ...route.value.query }

      if (`${query[id]}` === 'true') { delete query[id] } else { query[id] = 'true' }

      // if (id !== this.active)
      if (id !== route.value.query[id]) { query.page = '1' }

      router.push(localePath({
        name: 'catalog',
        query,
      }))
    }

    const handleUpdateValue = (val: string) => {
      cmwActiveSelect.value = ''
      // this.showMobileFilters = false
      const { id, keyword } = JSON.parse(val)
      const query: IQuery = { ...inputParameters.value, ...route.value.query }

      if (`${query[keyword]}` === id.toString()) { delete query[keyword] } else { query[keyword] = id.toString() }

      router.push(localePath({
        name: 'catalog',
        query,
      }))
    }

    const handleOnFooterClick = ({ price_from = '', price_to = '' }) => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      const query = { ...inputParameters.value, ...route.value.query }

      router.push(localePath({
        name: 'catalog',
        query: {
          ...query,
          price_from,
          price_to,
          page: '1',
        },
      }))
    }

    const resetFilter = () => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      router.push(localePath({
        name: 'catalog',
      }))
    }

    const sortBy = (field: any, direction: any) => {
      const query = {
        ...inputParameters.value,
        sort: field,
        direction,
      }

      router.push(localePath({
        name: 'catalog',
        query,
      }))
    }

    const handleUpdateSortValue = (value: string) => {
      const { field, direction } = JSON.parse(value)
      sortBy(field, direction)
    }

    const { fetch, fetchState } = useFetch(async ({ $cmwStore, $elastic, $cmwRepo, $handleApiErrors, $route, $i18n }) => {
      await $cmwRepo.shopifyPages.getPageByHandle($route.params.handle)
        .then((shopifyPage) => {
          if (!shopifyPage || !Object.keys(shopifyPage).length) { return }

          pageData.value = shopifyPage
          pageSeo.value = { ...shopifyPage.seo }
          inputParameters.value = shopifyPage?.filters?.value && JSON.parse(shopifyPage.filters.value)

          shortDescription.value = shopifyRichTextToHTML(shopifyPage.shortDescription.value)
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting getPageByHandle from shopify: ${err}`))

      const mergedInputParameters = {
        ...inputParameters.value,
        ...route.value.query,
      }

      const urlSearchParams = new URLSearchParams(mergedInputParameters)
      urlSearchParams.set('stores', $cmwStore.settings.id?.toString() || '')
      urlSearchParams.set('locale', $i18n.locale || '')
      const searchParams = urlSearchParams.toString()

      await $elastic.$get('/products/search', { searchParams })
        .then((data) => {
          const { hits, aggregations } = data as Record<string, any>
          results.value = hits.hits
          total.value = hits.total.value

          if (Object.keys(aggregations).length) { aggregationsRef.value = aggregations }
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting results.value = hits.hits from elastic: ${err}`))
    })

    useMeta(() => ({
      title: pageSeo.value.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: pageSeo.value.description,
        },
      ],
    }))

    watch(() => route.value?.query, () => fetch())

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
      pageSeo,
      resetFilter,
      results,
      shortDescription,
      showMobileFilters,
      total,
    }
  },
  head: {},
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
      <div class="prose my-4 <md:hidden" v-html="shortDescription" />
      <ProductsResultsList :results="results" :total="total" @update-sort-value="handleUpdateSortValue" />
      <CategoriesPagination :total-pages="Math.ceil(total / 48)" :input-parameters="inputParameters" :base-path="$route.path" />
      <div class="prose mt-8 sm:hidden" v-html="shortDescription" />
      <div class="py-12" v-html="pageData?.body" />
      <div v-if="!isDesktop" class="sticky bottom-8 w-[min(100%,_14rem)] m-inline-auto">
        <CmwButton @click.native="showMobileFilters = !showMobileFilters">
          <VueSvgIcon width="28" height="28" :data="filterIcon" />
          <span class="ml-2">{{ $t('search.showFilters') }}</span>
        </CmwButton>
      </div>
      <CategoriesFiltersComponentsMobile
        v-if="!isDesktop && showMobileFilters && Object.keys(inputParameters).length && Object.keys(aggregationsRef).length"
        :aggregations="aggregationsRef" :input-parameters="inputParameters"
        @update-value-selections="handleUpdateValueSelections"
        @update-value="handleUpdateValue"
        @reset-filter="resetFilter"
      />
    </template>
    <template v-else-if="!fetchState.pending">
      <p class="text-lg cmw-font-light mt-5">
        {{ $t('search.noResultsAlert') }}
      </p>
      <div v-html="$t('search.noResultsMessage')" />
    </template>
    <Loader v-if="fetchState.pending" />
  </div>
</template>

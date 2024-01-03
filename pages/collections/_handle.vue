<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  provide,
  readonly,
  ref, useContext,
  useFetch,
  useRoute,
  useRouter,
  watch,
} from '@nuxtjs/composition-api'
import chevronLeftIcon from 'assets/svg/chevron-left.svg'
import chevronRightIcon from 'assets/svg/chevron-right.svg'
import filterIcon from 'assets/svg/filter.svg'
import type { TranslateResult } from 'vue-i18n'
import type { RawLocation } from 'vue-router'
import type { TStores } from '~/config/themeConfig'
import themeConfig from '~/config/themeConfig'
import type { ICollection } from '~/types/collection'
import { initialCollectionData } from '~/types/collection'

interface IQuery {
  [key: string]: string | undefined | (string | null)[]
}

interface IInputParameters {
  [key: string]: string
  selection: string
}

interface IView {
  [key: string]: {
    key: string
    name: TranslateResult
    field: string
  } | null
}

interface AggregationsRefType {
  [key: string]: {
    [key: string]: {
      result: { buckets: any }
      buckets: { key: string; key_as_string: string; doc_count: any }[]
    }
  }
}

export default defineComponent({
  setup() {
    const { localePath } = useContext()
    const router = useRouter()
    const route = useRoute()
    const pageData = ref({})
    const currentPage = ref({})
    const shortDescription = ref('')
    const results = ref([])
    const total = ref(0)
    const aggregationsRef = ref<AggregationsRefType>({})
    const cmwActiveSelect = ref('')
    const isDesktop = inject('isDesktop')
    const showMobileFilters = ref(false)
    const collectionRef = ref<ICollection>(initialCollectionData)
    provide('showMobileFilters', showMobileFilters)
    provide('total', readonly(total))

    const belong_filters = [
      'areas',
      'brands',
      'regions',
      'countries',
      'vintages',
      'sizes',
      'boxes',
      'dosagecontents',
      'bodystyles',
    ]

    const relation_filters = [
      'awards',
      'agings',
      'categories',
      'philosophies',
      'winelists',
      'pairings',
    ]

    const inputParameters = computed<IInputParameters>(() => ({
      ...route.value.query,
      selection: route.value.params.handle,
    }))

    const handleUpdateTrigger = (key: string) => {
      cmwActiveSelect.value = cmwActiveSelect.value === key ? '' : key
    }

    const handleUpdateValueSelections = (id: string | number) => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      const query: IQuery = { ...inputParameters.value, ...route.value.query }

      if (`${query[id]}` === 'true') { delete query[id] } else { query[id] = 'true' }

      // if (id !== this.active)
      if (id !== route.value.query[id]) { query.page = '1' }

      delete query.selection

      router.push(localePath({
        path: `/collections/${route.value.params.handle}`,
        query,
      }) as RawLocation)
    }

    const handleUpdateValue = (val: string) => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      const { id, keyword } = JSON.parse(val)
      const query: IQuery = { ...inputParameters.value, ...route.value.query }

      if (`${query[keyword]}` === id.toString()) { delete query[keyword] } else { query[keyword] = id.toString() }

      delete query.selection

      router.push(localePath({
        path: `/collections/${route.value.params.handle}`,
        query,
      }) as RawLocation)
    }

    const sortBy = (field: any, direction: any) => {
      const query = {
        ...inputParameters.value,
        sort: field,
        direction,
      }

      router.push(localePath({
        path: `/collections/${route.value.params.handle}`,
        query,
      }) as RawLocation)
    }

    const handleUpdateSortValue = (value: string) => {
      const { field, direction } = JSON.parse(value)
      sortBy(field, direction)
    }

    const handleOnFooterClick = ({ price_from = '', price_to = '' }) => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      const query = { ...inputParameters.value, ...route.value.query }

      router.push(localePath({
        name: 'catalog',
        query: {
          ...query,
          price_from, // : this.minPrice,
          price_to, // : this.maxPrice,
          page: '1',
        },
      }))
    }

    const resetFilter = () => {
      cmwActiveSelect.value = ''
      // showMobileFilters.value = false
      // this.minPrice = this.minPriceTotal
      // this.maxPrice = this.maxPriceTotal
      router.push(localePath({
        path: `/collections/${route.value.params.handle}`,
        query: {},
      }) as RawLocation)
    }

    const removeSelectionFromQuery = (selection: any) => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      // this.minPrice = this.minPriceTotal
      // this.maxPrice = this.maxPriceTotal
      const query = Object.assign({}, inputParameters.value)

      if ('selection' in query) { Reflect.deleteProperty(query, 'selection') }

      if (selection in query) { Reflect.deleteProperty(query, selection) }

      router.push(localePath({
        path: `/collections/${route.value.params.handle}`,
        query: {
          ...query,
          page: '1',
        },
      }) as RawLocation)
    }

    const query = computed(() => new URLSearchParams(inputParameters.value).toString())
    const view = computed<IView>(() => {
      const views: IView = {}

      if (!aggregationsRef.value || !Object.keys(aggregationsRef.value).length) { return {} }

      belong_filters.forEach((el) => {
        let buckets: { key: string[]; key_as_string: string; doc_count: any }[]
          = aggregationsRef.value[`agg-${el}`][`agg-${el}`].buckets.map((x) => {
            return {
              key: x.key.split('|'),
              key_as_string: x.key,
              doc_count: x.doc_count,
            }
          })

        buckets = buckets.filter(bucket => !bucket.key.includes('not specified'))
        buckets = buckets.filter(bucket => !bucket.key.includes('non specificato'))
        buckets = buckets.filter(bucket => !bucket.key.includes('nicht angegeben'))
        buckets = buckets.filter(bucket => !bucket.key.includes('non spécifié'))

        const filterId = inputParameters.value[el]

        views[el] = (inputParameters.value[el] && !!Object.keys(buckets).length)
          ? {
              key: filterId!,
              name: buckets.find(x => `${x.key[0]}` === `${filterId}`)?.key[1] || '',
              field: el,
            }
          : null
      })

      relation_filters.forEach((el) => {
        const buckets: { key: string[]; key_as_string: string; doc_count: any }[]
          = aggregationsRef.value[`agg-${el}`].inner.result.buckets.map((x: { key: any; name: { buckets: { key: any }[] }; doc_count: any }) => {
            return {
              key: [x.key, x.name.buckets[0].key],
              key_as_string: `${x.key}|${x.name.buckets[0].key}`,
              doc_count: x.doc_count,
            }
          })

        const filterId = inputParameters.value[el]

        views[el] = (inputParameters.value[el] && !!Object.keys(buckets).length)
          ? {
              key: filterId!,
              name: buckets.find(x => `${x.key[0]}` === `${filterId}`)?.key[1] || '',
              field: el,
            }
          : null
      })

      return views
    })

    const { fetch } = useFetch(async ({ $config, $elastic, $cmwRepo, $i18n }) => {
      const store = $config.STORE as TStores || 'CMW_UK'
      const storeConfigId = themeConfig[store]?.id || 2

      collectionRef.value = await $cmwRepo.products.getCollectionsByHandle({ handle: route.value.params.handle })

      await $elastic.$get(`/products/search?stores=${storeConfigId}&locale=${$i18n.locale}&${query.value}`)
        .then((data) => {
          const { hits, aggregations } = data as Record<string, any>
          results.value = hits.hits
          total.value = hits.total.value

          if (Object.keys(aggregations).length) { aggregationsRef.value = aggregations }

          const priceFrom = inputParameters.value.price_from
          const priceTo = inputParameters.value.price_to

          view.value.priceFrom = priceFrom
            ? {
                key: 'priceFrom',
                name: $i18n.t('search.priceFrom', { from: priceFrom }),
                field: 'price_from',
              }
            : null
          view.value.priceTo = priceTo
            ? {
                key: 'priceTo',
                name: $i18n.t('search.priceTo', { to: priceTo }),
                field: 'price_to',
              }
            : null
          //
          // this.maxPriceTotal = Math.round(+search.aggregations.max_price['agg-max-price'].value)
          // this.maxPrice
          //   = priceTo
          //   || Math.round(+search.aggregations.max_price['agg-max-price'].value)
          // this.minPriceTotal = Math.round(+search.aggregations.min_price['agg-min-price'].value)
          // this.minPrice
          //   = priceFrom
          //   || Math.round(+search.aggregations.min_price['agg-min-price'].value)
        })
    })

    watch(() => route.value.query, () => fetch(), { deep: true })

    return {
      aggregationsRef,
      chevronLeftIcon,
      chevronRightIcon,
      cmwActiveSelect,
      collectionRef,
      currentPage,
      filterIcon,
      handleOnFooterClick,
      handleUpdateSortValue,
      handleUpdateTrigger,
      handleUpdateValue,
      handleUpdateValueSelections,
      inputParameters,
      isDesktop,
      pageData,
      removeSelectionFromQuery,
      resetFilter,
      results,
      shortDescription,
      showMobileFilters,
      total,
      view,
    }
  },
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto py-4 px-4 mt-4">
    <h1 class="h3" v-text="collectionRef.title" />
    <LoadingImage
      v-if="collectionRef.image?.url"
      img-classes="w-full"
      :thumbnail="{
        url: `${collectionRef.image.url}?&width=20&height=12`,
        width: 20,
        height: 12,
        altText: collectionRef.image.altText || 'missing',
      }"
      :source="{
        url: `${collectionRef.image.url}?&width=${collectionRef.image.width}&height=${collectionRef.image.height}`,
        width: collectionRef.image.width,
        height: collectionRef.image.height,
        altText: collectionRef.image.altText || 'missing',
      }"
    />
    <div v-html="collectionRef.descriptionHtml" />

    <div v-if="isDesktop">
      <!-- Filter Components -->
      <CategoriesFiltersComponents
        v-if="Object.keys(inputParameters).length && Object.keys(aggregationsRef).length"
        :aggregations="aggregationsRef" :input-parameters="inputParameters"
        @update-value-selections="handleUpdateValueSelections"
        @update-value="handleUpdateValue"
        @handle-on-footer-click="handleOnFooterClick"
      />
      <CategoriesActiveSelections
        :input-parameters="inputParameters" :view="view"
        @remove-selection-from-query="removeSelectionFromQuery" @reset-filter="resetFilter"
      />
    </div>
    <div v-html="shortDescription" />
    <ProductsResultsList :results="results" :total="total" @update-sort-value="handleUpdateSortValue" />
    <CategoriesPagination :total-pages="Math.ceil(total / 48)" :input-parameters="inputParameters" :base-path="$route.path" />
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
      @handle-on-footer-click="handleOnFooterClick"
      @reset-filter="resetFilter"
    />
  </div>
</template>

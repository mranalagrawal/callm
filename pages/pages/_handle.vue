<script lang="ts">
import {
  defineComponent,
  inject, provide, readonly,
  ref,
  useFetch,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import chevronLeftIcon from 'assets/svg/chevron-left.svg'
import chevronRightIcon from 'assets/svg/chevron-right.svg'
import filterIcon from 'assets/svg/filter.svg'
import type { TStores } from '~/config/themeConfig'
import themeConfig from '~/config/themeConfig'
import { shopifyRichTexttoHTML } from '~/utilities/shopify'

interface IQuery {
  [key: string]: string | undefined
}

export default defineComponent({
  layout({ $config }) {
    return $config.STORE
  },
  setup() {
    // const { i18n } = useContext()
    const router = useRouter()
    const route = useRoute()
    const pageData = ref({})
    const inputParameters = ref({})
    const currentPage = ref({})
    const shortDescription = ref('')
    const results = ref([])
    const total = ref(0)
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

    const { fetch } = useFetch(async ({ $config, $cmw, $cmwRepo, $handleApiErrors, $route, $i18n }) => {
      await $cmwRepo.shopifyPages.getPageByHandle({ handle: $route.params.handle })
        .then(async ({ page }) => {
          if (!Object.keys(page).length)
            return

          const store = $config.STORE as TStores || 'CMW_UK'
          const storeConfigId = themeConfig[store]?.id || 2
          pageData.value = page
          inputParameters.value = page?.filters?.value && JSON.parse(page.filters.value)

          shortDescription.value = shopifyRichTexttoHTML(page.shortDescription.value)

          const query = new URLSearchParams(inputParameters.value).toString()

          await $cmw.$get(`${$config.ELASTIC_URL}products/search?stores=${storeConfigId}&locale=${$i18n.locale}&${query}`)
            .then((data) => {
              const { hits, aggregations } = data as Record<string, any>
              results.value = hits.hits
              total.value = hits.total.value

              if (Object.keys(aggregations).length)
                aggregationsRef.value = aggregations
            })

          // We don't wanna know ...🫣
          /* const changedCategories = [1, 2, 3, 4, 54, 57, 64, 66, 75, 78, 87, 95, 97, 99, 104, 106, 109]

          if (changedCategories.some(n => query.includes(`categories=${n}`))) {
            const matched = changedCategories.find(n => query.includes(`categories=${n}`))
            return redirect(301, localeLocation(`${$route.fullPath.replaceAll(`-C${matched}`, `-M${matched}`)}`))
          } */
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting pageData from shopify: ${err}`))
    })

    return {
      aggregationsRef,
      chevronLeftIcon,
      chevronRightIcon,
      cmwActiveSelect,
      currentPage,
      fetch,
      filterIcon,
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
  <div v-if="Object.keys(pageData).length" class="max-w-screen-xl mx-auto py-4 px-4 mt-4">
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
      />
    </div>
    <div v-html="shortDescription" />
    <ProductsResultsList :results="results" :total="total" @update-sort-value="handleUpdateSortValue" />
    <CategoriesPagination :total-pages="Math.ceil(total / 48)" :input-parameters="inputParameters" />
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
    />
  </div>
</template>

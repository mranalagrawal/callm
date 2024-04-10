<script>
import {
  computed,
  defineComponent,
  inject,
  provide,
  ref,
  useContext,
  useFetch,
  useMeta,
  useRoute,
  useRouter,
  watch,
  watchEffect,
} from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useFilters } from '~/store/filters.ts'

import chevronDownIcon from '~/assets/svg/chevron-down.svg'
import closeIcon from '~/assets/svg/close.svg'

import Loader from '~/components/UI/Loader.vue'
import { pick } from '~/utilities/arrays.ts'
import { getCurrencySymbol, getLocaleFromCurrencyCode } from '~/utilities/currency'

export default defineComponent({
  components: { Loader },
  scrollToTop: true,
  props: ['inputParameters'],
  setup(props) {
    const { redirect, i18n, localePath, $cmwStore } = useContext()
    const route = useRoute()
    const router = useRouter()
    const filtersStore = useFilters()
    const { selectedLayout } = storeToRefs(filtersStore)
    const isDesktop = inject('isDesktop')
    const showPageFullDescription = ref(false)
    const showMoreFilters = ref(false)
    const showMobileFilters = ref(false)
    const aggregations = ref(null)
    const results = ref([])
    const total = ref(0)
    const loading = ref(false)
    const activeSelections = ref([])
    const canonicalUrl = ref('')
    const h1MacroName = ref('')
    const search = ref('')
    const cmwActiveSelect = ref('')
    const minPrice = ref(0)
    const maxPrice = ref(0)
    const maxPriceTotal = ref(0)
    const minPriceTotal = ref(0)
    const currentPage = ref(1)
    const pagination = ref({
      prevPage: 0,
      nextPage: 0,
      currentPage: 1,
      pageNumbers: [],
      totalPages: 0,
    })
    const view = ref({
      exclusive: null,
      categories: null,
      winelists: null,
      regions: null,
      brands: null,
      vintages: null,
      sizes: null,
      dosagecontents: null,
      bodystyles: null,
      areas: null,
      pairings: null,
      agings: null,
      philosophies: null,
      countries: null,
      awards: null,
      priceFrom: null,
      priceTo: null,
    })
    const filters = ref({
      winelists: [],
      pairings: [],
      dosagecontents: [],
      bodystyles: [],
      boxes: [],
      areas: [],
      provenience: [],
      awards: [],
      agings: [],
      philosophies: [],
    })
    const maindata = ref({})
    // const seoTitleReplace = ref('')

    const allSelections = [
      'artisanal',
      'exclusive',
      'favourite',
      'foreveryday',
      'inpromotion',
      'isnew',
      'organic',
      'rarewine',
      'togift',
      'topsale',
      'unusualvariety',
    ]

    const seoData = ref({
      pageTitle: null,
      pageDescription: null,
      seoTitle: null,
      seoDescription: null,
      pageFullDescription: '',
      mainFilters: [],
    })

    /* const hrefLang = {
      'it': 'https://www.callmewine.com/catalog',
      'en': 'https://www.callmewine.com/en/catalog',
      'fr': 'https://callmewine.fr/catalog',
      'de': 'https://callmewine.de/catalog',
      'en-gb': 'https://callmewine.co.uk/catalog',
    } */

    const searchedTerm = ref('')

    const { fetch } = useFetch(async ({ $elastic }) => {
      if (process.client) { window.scrollTo(0, 0) }

      loading.value = true

      currentPage.value = props.inputParameters.page
        ? props.inputParameters.page
        : 1

      searchedTerm.value = props.inputParameters.search
        ? props.inputParameters.search
        : ''

      const urlSearchParams = new URLSearchParams(props.inputParameters)
      const queryToString = urlSearchParams.toString()

      let sel = '&'

      if (props.inputParameters.sel) {
        sel += props.inputParameters.sel
          .split(',')
          .map(el => `${el}=true`)
          .join('&')
      }

      const elastic_url = `/products/search?stores=${$cmwStore.settings.id}&locale=${i18n.locale}&`

      $elastic.setHeader('Accept-Encoding', 'gzip')
      const searchResult = await $elastic.$get(`${elastic_url}${queryToString}${sel}`)
      const seo = await $elastic.$get(`/product-list/seo?stores=${$cmwStore.settings.id}&locale=${i18n.locale}&${queryToString}${sel}`)

      if (seo) {
        const pickedSeo = pick(seo, ['pageTitle', 'pageDescription', 'seoTitle', 'seoDescription', 'pageFullDescription'])

        if (!Object.values(pickedSeo).every(item => !item)) { seoData.value = pickedSeo }
      } else {
        this.$sentry.captureException(new Error('Something went wrong on SEO API on listing page'))
      }

      search.value = searchResult
      aggregations.value = search?.value.aggregations || {}
      results.value = search.value.hits.hits

      total.value = search.value.hits.total.value

      // h1 macro name - is not filter
      if (props.inputParameters?.macros && search.value.aggregations['agg-macros']) {
        const currentMacrosVal = props.inputParameters?.macros
        const macrosBucket = search.value.aggregations['agg-macros'].inner.result.buckets.find(b => b.key === parseInt(currentMacrosVal))
        h1MacroName.value = macrosBucket?.name.buckets[0].key
      }

      if (total.value === 0) {
        loading.value = false
        return
      }

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

      belong_filters.forEach((el) => {
        if (!search.value.aggregations[`agg-${el}`]) { return }

        let buckets = search.value.aggregations[`agg-${el}`][`agg-${el}`].buckets.map(
          (x) => {
            return {
              key: x.key.split('|'),
              key_as_string: x.key,
              doc_count: x.doc_count,
            }
          },
        )

        buckets = buckets.filter(bucket => !bucket.key.includes('not specified'))
        buckets = buckets.filter(bucket => !bucket.key.includes('non specificato'))
        buckets = buckets.filter(bucket => !bucket.key.includes('nicht angegeben'))
        buckets = buckets.filter(bucket => !bucket.key.includes('non spécifié'))

        maindata.value = { ...maindata.value, [`${el}`]: buckets }

        const filterId = props.inputParameters[el]

        view.value[el] = filterId
          ? {
              key: filterId,
              name: buckets.length > 0 ? buckets.find(x => `${x.key[0]}` === `${filterId}`).key[1] : null,
              field: el,
            }
          : null
      })

      const relation_filters = [
        'awards',
        'agings',
        'categories',
        'philosophies',
        'winelists',
        'pairings',
      ]

      relation_filters.forEach((el) => {
        if (!search.value.aggregations[`agg-${el}`]) { return }

        const data = search.value.aggregations[`agg-${el}`] && search.value.aggregations[`agg-${el}`].inner.result.buckets.map((el) => {
          return {
            key: [el.key, el.name.buckets[0].key],
            key_as_string: `${el.key}|${el.name.buckets[0].key}`,
            doc_count: el.doc_count,
          }
        })
        maindata[el] = data

        const filterId = props.inputParameters[el]
        view.value[el] = filterId
          ? {
              key: filterId,
              name: data.length > 0 ? data.find(x => `${x.key[0]}` === `${filterId}`).key[1] : null,
              field: el,
            }
          : null
      })

      relation_filters.forEach((el) => {
        if (!search.value.aggregations[`agg-${el}`]) { return }

        const data = search.value.aggregations[`agg-${el}`] && search.value.aggregations[`agg-${el}`].inner.result.buckets.map((aggregation) => {
          return {
            value: JSON.stringify({ id: aggregation.key, keyword: el }),
            label: `${aggregation.name.buckets[0].key} <span class="cmw-font-light text-gray">(${aggregation.doc_count})</span>`,
            simpleLabel: aggregation.name.buckets[0].key,
            selected: props.inputParameters && props.inputParameters[el] && props.inputParameters[el] === `${aggregation.key}`,
          }
        })

        filters.value = {
          ...filters.value,
          [el]: data,
        }
      })

      belong_filters.forEach((el) => {
        if (!search.value.aggregations[`agg-${el}`]) { return }

        let buckets = search.value.aggregations[`agg-${el}`] && search.value.aggregations[`agg-${el}`][`agg-${el}`].buckets.map(
          (aggregation) => {
            return {
              key: aggregation.key.split('|'),
              value: JSON.stringify({ id: aggregation.key.split('|')[0], keyword: el }),
              label: `${aggregation.key.split('|')[1]} <span class="cmw-font-light text-gray">(${aggregation.doc_count})</span>`,
              selected: props.inputParameters && props.inputParameters[el] && props.inputParameters[el] === `${aggregation.key}`,
            }
          },
        )

        buckets = buckets.filter(bucket => !bucket.key.includes('not specified'))
        buckets = buckets.filter(bucket => !bucket.key.includes('non specificato'))
        buckets = buckets.filter(bucket => !bucket.key.includes('nicht angegeben'))
        buckets = buckets.filter(bucket => !bucket.key.includes('non spécifié'))

        filters.value = {
          ...filters.value,
          [el]: buckets,
        }
      })

      const priceFrom = props.inputParameters.price_from
      const priceTo = props.inputParameters.price_to

      const allSelections = [
        'artisanal',
        'exclusive',
        'favourite',
        'foreveryday',
        'inpromotion',
        'isnew',
        'organic',
        'rarewine',
        'togift',
        'topsale',
        'unusualvariety',
      ]

      activeSelections.value = Object.keys(props.inputParameters).filter(el =>
        allSelections.includes(el),
      )

      if (priceFrom) {
        const priceFromLabel = $cmwStore.isUk
          ? `${getCurrencySymbol('GBP')} ${i18n.n(Number(priceFrom), { style: 'decimal' })}`
          : `${i18n.n(Number(priceFrom), { style: 'decimal' })} ${getCurrencySymbol('EUR')}`

        view.value.priceFrom = {
          key: 'priceFrom',
          name: i18n.t('search.priceFrom', { from: priceFromLabel }),
          field: 'price_from',
        }
      } else {
        view.value.priceFrom = null
      }

      if (priceTo) {
        const priceToLabel = $cmwStore.isUk
          ? `${getCurrencySymbol('GBP')} ${i18n.n(Number(priceTo), { style: 'decimal' })}`
          : `${i18n.n(Number(priceTo), { style: 'decimal' })} ${getCurrencySymbol('EUR')}`

        view.value.priceTo = {
          key: 'priceTo',
          name: i18n.t('search.priceTo', { to: priceToLabel }),
          field: 'price_to',
        }
      } else {
        view.value.priceTo = null
      }

      maxPriceTotal.value = Math.round(+search.value.aggregations.max_price['agg-max-price'].value)
      maxPrice.value
        = priceTo
        || Math.round(+search.value.aggregations.max_price['agg-max-price'].value)
      minPriceTotal.value = Math.round(+search.value.aggregations.min_price['agg-min-price'].value)
      minPrice.value
        = priceFrom
        || Math.round(+search.value.aggregations.min_price['agg-min-price'].value)

      const hasBrand = urlSearchParams.has('brands')

      if (hasBrand) {
        const brandId = `B${urlSearchParams.get('brands')}`

        if (process.client && typeof window !== 'undefined') {
          const { origin, search } = window.location
          const searchParams = new URLSearchParams(search)
          searchParams.delete('page')

          const encodedPath = `${encodeURIComponent(view.value.brands.name.replace(' ', '-'))}-${brandId}.htm`
          const encodedSearch = searchParams.toString() ? `?${searchParams.toString()}` : ''
          canonicalUrl.value = `${origin}/${encodedPath}${encodedSearch}`
        }
      }

      loading.value = false
    })

    const seoTitleReplace = computed(() => {
      let h1Words = []

      const priceFrom = view.value.priceFrom ? view.value.priceFrom.name : ''
      const priceTo = view.value.priceTo ? view.value.priceTo.name : ''

      if (priceFrom && priceTo) {
        h1Words = Object.values(view.value)
          .filter(v => v !== null && v.field !== 'price_from' && v.field !== 'price_to')
          .map(v => v.name || '')

        const fromParam = Number(props.inputParameters.price_from || 0)
        const toParam = Number(props.inputParameters.price_to || 0)

        const from = $cmwStore.isUk
          ? `${getCurrencySymbol('GBP')} ${i18n.n(Number(fromParam), { style: 'decimal' })}`
          : `${i18n.n(Number(fromParam), { style: 'decimal' })} ${getCurrencySymbol('EUR')}`

        const to = $cmwStore.isUk
          ? `${getCurrencySymbol('GBP')} ${i18n.n(Number(toParam), { style: 'decimal' })}`
          : `${i18n.n(Number(toParam), { style: 'decimal' })} ${getCurrencySymbol('EUR')}`

        h1Words.push(i18n.t('search.priceFromTo', { from, to }))
      } else {
        h1Words = Object.values(view.value)
          .filter(v => v !== null)
          .map(v => v.name || '')
      }

      return h1Words.join(' - ')
    })

    const filterCategories = computed(() => {
      return Object.entries(filters.value).slice(0, !(showMoreFilters.value || !isDesktop.value) ? 4 : undefined).reduce((acc, [k, v]) => {
        if (v.length) { acc[k] = v }

        return acc
      }, {})
    })

    const selections = computed(() => {
      if (!search.value?.aggregations) { return [] }

      const aggregations = JSON.parse(JSON.stringify(search.value.aggregations))

      const selectionsListMapped = []
      allSelections.forEach((el) => {
        if (!aggregations[`agg-${el}`]) { return }

        const tmp = aggregations[`agg-${el}`][`agg-${el}`].buckets.find(
          el => el.key === 1,
        )

        if (tmp) {
          tmp.key = [Boolean(tmp.key), el]
          tmp.key_as_string = el
          tmp.value = el
          tmp.label = i18n.t(`common.features.${el}`)
          tmp.icon = el // `selections/${el}.svg`
          tmp.selected = route.fullPath?.toLowerCase().includes(el)
          selectionsListMapped.push(tmp)
        }
      })

      return selectionsListMapped
    })

    // METHODS
    const handleOnFooterClick = ({ price_from = '', price_to = '' }) => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      const query = { ...props.inputParameters, ...route.value.query }

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

    const handleUpdateTrigger = (key) => {
      cmwActiveSelect.value = cmwActiveSelect.value === key ? '' : key
    }

    const handleUpdateRangeValues = ({ minValue, maxValue }) => {
      minPrice.value = Number(minValue)
      maxPrice.value = Number(maxValue)
    }

    const handleUpdateValue = (val) => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      const { id, keyword } = JSON.parse(val)
      const query = { ...props.inputParameters, ...route.value.query }

      if (`${query[keyword]}` === id.toString()) {
        delete query[keyword]
      } else { query[keyword] = id }

      /* if (id !== this.active)
        query.page = 1 */

      router.push(localePath({
        name: 'catalog',
        query,
      }))
    }

    const handleUpdateValueSelections = (id) => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      const query = { ...props.inputParameters, ...route.value.query }

      if (`${query[id]}` === 'true') {
        delete query[id]
      } else { query[id] = 'true' }

      if (id !== route.value.query[id]) { query.page = 1 }

      router.push(localePath({
        name: 'catalog',
        query,
      }))
    }

    const resetFilter = () => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      minPrice.value = minPriceTotal.value
      maxPrice.value = maxPriceTotal.value
      router.push(localePath({
        name: 'catalog',
        query: null,
      }))
    }

    const removeSelectionFromQuery = (selection) => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      minPrice.value = minPriceTotal.value
      maxPrice.value = maxPriceTotal.value
      const query = Object.assign({}, props.inputParameters)

      delete query[selection]

      router.push(localePath({
        name: 'catalog',
        query: {
          ...query,
          page: 1,
        },
      }))
    }

    const sortBy = (field, direction) => {
      const query = Object.assign({}, props.inputParameters)
      query.sort = field
      query.direction = direction
      router.push(localePath({
        name: 'catalog',
        query,
      }))
    }

    const handleUpdateSortValue = (value) => {
      const { field, direction } = JSON.parse(value)
      sortBy(field, direction)
    }

    // WATCHERS
    watch(() => route.value.query, () => fetch())
    watchEffect(() => {
      if (process.browser && document.body) { document.body.classList.toggle('lock-scroll', showMobileFilters.value && !isDesktop.value) }
    })

    useMeta(() => {
      let link = []
      const href = canonicalUrl.value ? canonicalUrl.value : ''

      if (href) {
        link = [{
          rel: 'canonical',
          href,
        }]
      }

      const fullHrefLang = [] // generateHeadHreflang(hrefLang)

      // Note: I don't think this is necessary
      /* if (process.client && typeof window !== 'undefined') {
        const { search } = window.location
        const searchParams = new URLSearchParams(search)
        searchParams.delete('page')

        fullHrefLang = fullHrefLang.map(el => ({
          ...el,
          href: `${el.href}?${searchParams.toString()}`,
        }))
      } */

      link = [...link, ...fullHrefLang]

      return {
        title: seoData.value?.seoTitle || seoTitleReplace.value,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: seoData.value?.seoDescription || seoTitleReplace.value,
          },
        ],
        link,
      }
    })

    provide('showMobileFilters', showMobileFilters)
    provide('total', total)

    return {
      activeSelections,
      aggregations,
      allSelections,
      canonicalUrl,
      chevronDownIcon,
      closeIcon,
      cmwActiveSelect,
      currentPage,
      fetch,
      filterCategories,
      handleOnFooterClick,
      handleUpdateRangeValues,
      handleUpdateSortValue,
      handleUpdateTrigger,
      handleUpdateValue,
      handleUpdateValueSelections,
      // hrefLang,
      isDesktop,
      loading,
      maxPrice,
      maxPriceTotal,
      minPrice,
      minPriceTotal,
      pagination,
      redirect,
      removeSelectionFromQuery,
      resetFilter,
      results,
      search,
      searchedTerm,
      selectedLayout,
      selections,
      seoData,
      seoTitleReplace,
      showMobileFilters,
      showMoreFilters,
      showPageFullDescription,
      sortBy,
      total,
      view,
    }
  },
  head: {},
  methods: {
    getLocaleFromCurrencyCode,
  },
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto py-4 px-4 mt-4">
    <h1 v-if="total > 0 || searchedTerm" class="h3">
      <template v-if="searchedTerm">
        <span>"{{ searchedTerm }}"</span>
        <p class="h4" v-text="$t('searchResultLabel')" />
      </template>
      <template v-else-if="seoData && seoData?.pageTitle">
        {{ seoData.pageTitle }}
      </template>
      <template v-else>
        {{ seoTitleReplace }}
        <span v-for="selection in activeSelections" :key="selection">
          {{ $t(`common.features.${selection}`) }}
        </span>
      </template>
    </h1>

    <ClientOnly>
      <CategoriesMainFilters
        v-if="total > 0 && Object.keys(aggregations).length && Object.keys(inputParameters).length"
        :aggregations="aggregations" :input-parameters="inputParameters" @item-clicked="handleUpdateValue"
      />
    </ClientOnly>

    <div v-if="total > 0 && isDesktop">
      <!-- Filter Components -->
      <CategoriesFiltersComponents
        v-if="Object.keys(aggregations).length"
        :key="JSON.stringify(inputParameters) || 'categories-filters-components'" :aggregations="aggregations"
        :input-parameters="inputParameters" @update-value-selections="handleUpdateValueSelections"
        @update-value="handleUpdateValue" @handle-on-footer-click="handleOnFooterClick"
      />
      <CategoriesActiveSelections
        :input-parameters="inputParameters" :view="view"
        @remove-selection-from-query="removeSelectionFromQuery" @reset-filter="resetFilter"
      />
    </div>
    <div class="prose my-4 <md:hidden" v-html="seoData.pageDescription" />
    <ProductsResultsList
      :results="results" :total="total" :loading="loading"
      @update-sort-value="handleUpdateSortValue"
    />
    <CategoriesPagination
      v-if="total > 0" :total-pages="Math.ceil(total / 48)" :input-parameters="inputParameters"
      :base-path="$route.path"
    />

    <div class="prose md:hidden" v-html="seoData.pageDescription" />
    <div>
      <div
        class="prose relative overflow-hidden pb-8"
        :class="showPageFullDescription
          ? 'h-full'
          : 'h-[200px] after:(content-DEFAULT absolute w-full h-1/2 bottom-0 left-0 bg-gradient-to-b from-transparent to-white)'"
        v-html="seoData?.pageFullDescription ? seoData.pageFullDescription : ''"
      />
      <CmwButton
        v-if="!showPageFullDescription" class="justify-end pb-8" variant="text"
        @click.native="showPageFullDescription = true"
      >
        <span v-if="seoData?.pageFullDescription" class="mr-2">{{ $t('common.cta.readMore') }}</span>
        <VueSvgIcon
          v-if="seoData?.pageFullDescription" width="18" height="18"
          :data="require(`@/assets/svg/chevron-down.svg`)"
        />
      </CmwButton>
    </div>
    <Loader v-if="loading" />

    <div v-if="total > 0 && !isDesktop" class="sticky bottom-8 w-[min(100%,_14rem)] m-inline-auto">
      <CmwButton @click.native="showMobileFilters = !showMobileFilters">
        <VueSvgIcon width="28" height="28" :data="require(`@/assets/svg/filter.svg`)" />
        <span class="ml-2">{{ $t('search.showFilters') }}</span>
      </CmwButton>
    </div>

    <ClientOnly>
      <CategoriesFiltersComponentsMobile
        v-if="total > 0 && !isDesktop"
        :aggregations="aggregations" :input-parameters="inputParameters"
        @update-value-selections="handleUpdateValueSelections"
        @update-value="handleUpdateValue"
        @handle-on-footer-click="handleOnFooterClick"
        @reset-filter="resetFilter"
      />
    </ClientOnly>
  </div>
</template>

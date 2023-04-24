<script>
import { nextTick, onMounted, onUnmounted, ref, watchEffect } from '@nuxtjs/composition-api'
// import { getMappedProducts } from '@/utilities/mappedProduct'
import closeIcon from 'assets/svg/close.svg'
import debounce from 'lodash.debounce'
import { storeToRefs } from 'pinia'
import Loader from '../components/UI/Loader.vue'
import { pick } from '@/utilities/arrays'
import { useFilters } from '~/store/filters'
import { getLocaleFromCurrencyCode } from '@/utilities/currency'
import themeConfig from '~/config/themeConfig'

export default {
  components: { Loader },
  scrollToTop: true,
  props: ['inputParameters'],
  setup() {
    const filtersStore = useFilters()
    const { selectedLayout, availableLayouts } = storeToRefs(filtersStore)
    const isDesktop = ref(false)
    const showMoreFilters = ref(false)
    const showMobileFilters = ref(false)

    const resizeListener = debounce(() => {
      isDesktop.value = window.innerWidth > 991
    }, 400)

    onMounted(() => {
      // Todo: Move this to a global composable when we implement VueUse
      window.addEventListener('resize', resizeListener)
      nextTick(() => {
        resizeListener()
      })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', resizeListener)
    })

    watchEffect(() => {
      if (process.browser && document.body)
        document.body.classList.toggle('lock-scroll', showMobileFilters.value && !isDesktop.value)
    })

    return {
      isDesktop,
      showMoreFilters,
      showMobileFilters,
      availableLayouts,
      selectedLayout,
      closeIcon,
    }
  },
  data() {
    return {
      cmwActiveSelect: '',
      minPrice: 0,
      maxPrice: 0,
      minPriceTotal: null,
      maxPriceTotal: null,
      searchedTerm: '',
      loading: null,
      brands: null,
      search: null,
      regions: null,
      pairings: null,
      philosophies: null,
      sizes: null,
      dosagecontents: null,
      bodystyles: null,
      boxes: null,
      categories: null,
      countries: null,
      winelists: null,
      awards: null,
      vintages: null,
      results: null,
      activeSelections: [],
      total: 0,
      seoData: {
        pageTitle: null,
        pageDescription: null,
        seoTitle: null,
        seoDescription: null,
        mainFilters: [],
      },
      filters: {
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
      },
      pagination: {
        prevPage: 0,
        nextPage: 0,
        currentPage: 1,
        pageNumbers: [],
        totalPages: 0,
      },
      view: {
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
        categories: null,
        winelists: null,
        awards: null,
        priceFrom: null,
        priceTo: null,
      },
    }
  },
  async fetch() {
    if (process.client)
      window.scrollTo(0, 0)

    /* console.log(this.inputParameters, "this.inputParameters"); */

    this.loading = true
    // const route = this.$route
    /* console.log(route.fullPath.split("search?")[1], "SSSS"); */

    this.currentPage = this.inputParameters.page
      ? this.inputParameters.page
      : 1

    this.searchedTerm = this.inputParameters.search
      ? this.inputParameters.search
      : ''

    if (!this.inputParameters.search)
      delete this.inputParameters.search

    const query = new URLSearchParams(this.inputParameters).toString()

    let sel = '&'

    if (this.inputParameters.sel) {
      sel += this.inputParameters.sel
        .split(',')
        .map(el => `${el}=true`)
        .join('&')
    }

    const elastic_url
      = `${this.$config.ELASTIC_URL
    }products/search?stores=${themeConfig[this.$config.STORE].id}&locale=${
      this.$i18n.locale
    }&`

    const searchResult = await fetch(`${elastic_url}${query}${sel}`)
    let seo = await fetch(`${this.$config.ELASTIC_URL}product-list/seo?stores=${activeStoreID}&locale=${this.$i18n.locale}&${query}${sel}`)
    seo = await seo.json()

    if (seo) {
      const pickedSeo = pick(seo, ['pageTitle', 'pageDescription', 'seoTitle', 'seoDescription'])

      if (Object.values(pickedSeo).every(item => !item)) {
        this.$sentry.captureException(new Error('Missing ALL SEO on listing page'))
      } else {
        Object.entries(pickedSeo).forEach(([k, v]) => {
          if (!v)
            this.$sentry.captureException(new Error(`Missing ${k} SEO on listing page`))
        })

        this.seoData = pickedSeo
      }
    } else {
      this.$sentry.captureException(new Error('Something went wrong on SEO API on listing page'))
    }

    // const allFields = await fetch(elastic_url)
    //
    // const allFieldsJSON = await allFields.json()

    const search = await searchResult.json()

    this.search = search
    this.results = search.hits.hits

    const total = search.hits.total.value
    this.total = total

    if (total === 0)
      this.loading = false

    this.setPages(Math.ceil(total / 48))

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
      let buckets = search.aggregations[`agg-${el}`][`agg-${el}`].buckets.map(
        (x) => {
          return {
            key: x.key.split('|'),
            key_as_string: x.key,
            doc_count: x.doc_count,
          }
        },
      )

      buckets = buckets.filter(bucket => !bucket.key.includes('not specified'))

      this[`${el}`] = buckets

      const filterId = this.inputParameters[el]

      this.view[el] = filterId
        ? {
            key: filterId,
            name: buckets.find(x => `${x.key[0]}` === `${filterId}`).key[1],
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
      const data = search.aggregations[`agg-${el}`].inner.result.buckets.map((el) => {
        return {
          key: [el.key, el.name.buckets[0].key],
          key_as_string: `${el.key}|${el.name.buckets[0].key}`,
          doc_count: el.doc_count,
        }
      })
      this[el] = data

      const filterId = this.inputParameters[el]
      this.view[el] = filterId
        ? {
            key: filterId,
            name: data.find(x => `${x.key[0]}` === `${filterId}`).key[1],
            field: el,
          }
        : null
    })

    relation_filters.forEach((el) => {
      const data = search.aggregations[`agg-${el}`].inner.result.buckets.map((aggregation) => {
        return {
          value: JSON.stringify({ id: aggregation.key, keyword: el }),
          label: `${aggregation.name.buckets[0].key} <span class="cmw-font-light cmw-text-gray">(${aggregation.doc_count})</span>`,
          simpleLabel: aggregation.name.buckets[0].key,
          selected: this.inputParameters && this.inputParameters[el] && this.inputParameters[el] === `${aggregation.key}`,
        }
      })

      this.filters = {
        ...this.filters,
        [el]: data,
      }
    })

    belong_filters.forEach((el) => {
      let buckets = search.aggregations[`agg-${el}`][`agg-${el}`].buckets.map(
        (aggregation) => {
          return {
            key: aggregation.key.split('|'),
            value: JSON.stringify({ id: aggregation.key.split('|')[0], keyword: el }),
            label: `${aggregation.key.split('|')[1]} <span class="cmw-font-light cmw-text-gray">(${aggregation.doc_count})</span>`,
            selected: this.inputParameters && this.inputParameters[el] && this.inputParameters[el] === `${aggregation.key}`,
          }
        },
      )

      buckets = buckets.filter(bucket => !bucket.key.includes('not specified'))

      this.filters = {
        ...this.filters,
        [el]: buckets,
      }
    })

    const priceFrom = this.inputParameters.price_from
    const priceTo = this.inputParameters.price_to

    const allSelections = [
      'favourite',
      'artisanal',
      'isnew',
      'inpromotion',
      'topsale',
      'foreveryday',
      'organic',
      'togift',
      'unusualvariety',
      'rarewine',
    ]

    this.activeSelections = Object.keys(this.inputParameters).filter(el =>
      allSelections.includes(el),
    )

    this.view.priceFrom = priceFrom
      ? {
          key: 'priceFrom',
          name: `From ${priceFrom}`,
          field: 'price_from',
        }
      : null
    this.view.priceTo = priceTo
      ? {
          key: 'priceTo',
          name: `To ${priceTo}`,
          field: 'price_to',
        }
      : null

    this.maxPriceTotal = Math.round(+search.aggregations.max_price['agg-max-price'].value)
    this.maxPrice
      = priceTo
      || Math.round(+search.aggregations.max_price['agg-max-price'].value)
    this.minPriceTotal = Math.round(+search.aggregations.min_price['agg-min-price'].value)
    this.minPrice
      = priceFrom
      || Math.round(+search.aggregations.min_price['agg-min-price'].value)

    this.loading = false
  },
  head() {
    return {
      title: this.seoData?.seoDescription,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.seoData?.seoDescription,
        },
      ],
    }
  },
  allSelections: [
    'favourite',
    'artisanal',
    'isnew',
    'inpromotion',
    'topsale',
    'foreveryday',
    'organic',
    'togift',
    'unusualvariety',
    'rarewine',
  ],
  searchableFilters: ['winelists', 'pairings', 'regions', 'areas', 'brands'],
  computed: {
    filterCategories() {
      return Object.entries(this.filters).slice(0, !(this.showMoreFilters || !this.isDesktop) ? 4 : undefined).reduce((acc, [k, v]) => {
        if (v.length)
          acc[k] = v

        return acc
      }, {})
    },
    aggMacros() {
      if (!this.search?.aggregations)
        return []

      return this.search.aggregations['agg-macros'].inner.result.buckets.map(item => ({
        doc_count: item.doc_count,
        name: item.name.buckets[0].key,
        key: item.key,
        keyword: 'macros',
      }))
    },
    aggCategories() {
      if (!this.search?.aggregations)
        return []

      return this.search.aggregations['agg-categories'].inner.result.buckets.map(item => ({
        doc_count: item.doc_count,
        name: item.name.buckets[0].key,
        key: item.key,
        keyword: 'categories',
      }))
    },
    hasMacrosSelected() {
      return Object.keys(this.inputParameters).includes('macros')
    },
    hasCategorySelected() {
      return Object.keys(this.inputParameters).includes('categories')
    },
    mainFilters() {
      if (!this.hasMacrosSelected && !this.hasCategorySelected)
        return this.aggMacros
      else if (this.hasMacrosSelected && !this.hasCategorySelected)
        return this.aggCategories
      else
        return this.aggCategories.filter(item => `${item.key}` !== `${this.inputParameters.categories}`)
    },
    selections() {
      if (!this.search?.aggregations)
        return []

      const aggregations = JSON.parse(JSON.stringify(this.search.aggregations))

      const selectionsListMapped = []
      this.$options.allSelections.forEach((el) => {
        const tmp = aggregations[`agg-${el}`][`agg-${el}`].buckets.find(
          el => el.key === 1,
        )

        if (tmp) {
          tmp.key = [Boolean(tmp.key), el]
          tmp.key_as_string = el
          tmp.value = el
          tmp.label = this.$i18n.t(`selections.${el}`)
          tmp.icon = el // `selections/${el}.svg`
          tmp.selected = this.$route.fullPath?.toLowerCase().includes(el)
          selectionsListMapped.push(tmp)
        }
      })

      return selectionsListMapped
    },
    /* mappedProducts() {
      // TODO: merge productBox and productBoxElastic
      return this.results && getMappedProducts(this.results, this.$i18n.locale, true)
    }, */
  },
  watch: {
    '$route.query': '$fetch',
    '$i18n.locale': '$fetch',
  },

  methods: {
    getLocaleFromCurrencyCode,
    handleOnFooterClick() {
      this.cmwActiveSelect = ''
      this.showMobileFilters = false
      this.$router.push({
        path: 'catalog',
        query: {
          ...this.$route.query,
          price_from: this.minPrice,
          price_to: this.maxPrice,
          page: 1,
        },
      })
    },

    handleUpdateTrigger(key) {
      this.cmwActiveSelect = this.cmwActiveSelect === key ? '' : key
    },

    handleUpdateRangeValues({ minValue, maxValue }) {
      this.minPrice = Number(minValue)
      this.maxPrice = Number(maxValue)
    },
    handleUpdateValue(val) {
      this.cmwActiveSelect = ''
      this.showMobileFilters = false
      const { id, keyword } = JSON.parse(val)
      const query = { ...this.inputParameters, ...this.$route.query }

      if (`${query[keyword]}` === id.toString())
        delete query[keyword]
      else query[keyword] = id

      if (id !== this.active)
        query.page = 1

      this.$router.push({
        path: 'catalog',
        query,
      })
    },
    handleUpdateValueSelections(id) {
      this.cmwActiveSelect = ''
      this.showMobileFilters = false
      const query = { ...this.inputParameters, ...this.$route.query }

      if (`${query[id]}` === 'true')
        delete query[id]
      else
        query[id] = 'true'

      // if (id !== this.active)
      if (id !== this.$route.query[id])
        query.page = 1

      this.$router.push({
        path: 'catalog',
        query,
      })
    },
    setPages(totalPages) {
      const { page } = this.$route.query

      this.pagination.totalPages = totalPages
      this.pagination.currentPage = Number(page?.value ?? 1)
      this.pagination.prevPage = this.pagination.currentPage > 1 ? this.pagination.currentPage - 1 : null
      this.pagination.nextPage = totalPages ? (this.pagination.currentPage < totalPages.value ? this.pagination.currentPage + 1 : null) : this.pagination.currentPage + 1
      this.pagination.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(page => Math.abs(page - this.pagination.currentPage) < 4)
    },
    changePage(page) {
      const query = Object.assign({}, this.inputParameters)
      query.page = page

      this.$router.push({
        path: 'catalog',
        query,
      })
    },
    resetFilter() {
      this.cmwActiveSelect = ''
      this.showMobileFilters = false
      this.minPrice = this.minPriceTotal
      this.maxPrice = this.maxPriceTotal
      this.$router.push({
        path: 'catalog',
        query: null,
      })
    },
    removeSelectionFromQuery(selection) {
      this.cmwActiveSelect = ''
      this.showMobileFilters = false
      this.minPrice = this.minPriceTotal
      this.maxPrice = this.maxPriceTotal
      const query = Object.assign({}, this.inputParameters)

      delete query[selection]

      this.$router.push({
        path: 'catalog',
        query,
      })
    },
    sortBy(field, direction) {
      const query = Object.assign({}, this.inputParameters)
      query.sort = field
      query.direction = direction
      this.$router.push({
        path: 'catalog',
        query,
      })
    },
  },
}
</script>

<template>
  <div class="cmw-max-w-screen-xl cmw-mx-auto cmw-py-4 cmw-px-4 cmw-mt-4">
    <div class="row">
      <div class="col-12">
        <div v-if="searchedTerm" class="">
          <h2 class="font-weight-bold">
            "{{ searchedTerm }}"
          </h2>
          <p class="h3">
            I risultati della tua ricerca
          </p>
        </div>
        <div v-if="seoData.pageTitle" class="cmw-h3">
          {{ seoData.pageTitle }}
        </div>
        <div v-else class="cmw-h3">
          {{ view.regions?.name }} {{ view.vintages?.name }}
          {{ view.pairings?.name }} {{ view.brands?.name }}
          {{ view.agings?.name }} {{ view.philosophies?.name }}
          {{ view.sizes?.name }} {{ view.dosagecontents?.name }}
          {{ view.categories?.name }}
          {{ view.winelists?.name }}
          {{ view.awards?.name }}
          <span v-for="selection in activeSelections" :key="selection">
            {{ $t(`selections.${selection}`) }}
          </span>
        </div>
      </div>
    </div>

    <div class="c-scrollbar cmw-flex cmw-overflow-auto cmw-gap-4 cmw-my-8 md:(cmw-flex-wrap)">
      <Button
        v-for="({ key, name, keyword }) in mainFilters" :key="key" variant="ghost" size="sm" class="cmw-flex-shrink-0 cmw-w-max"
        @click.native="handleUpdateValue(JSON.stringify({ id: key, keyword }))"
      >
        {{ name }}
      </Button>
    </div>

    <div v-if="isDesktop">
      <!--      <div class="cmw-text-sm cmw-font-bold" v-text="$t('common.filters.by')" /> -->
      <div
        class="cmw-grid cmw-grid-cols-[auto_200px] cmw-items-start cmw-border-y cmw-border-gray-light cmw-py-1 cmw-transition-all"
      >
        <!-- Filter Components -->
        <div class="cmw-flex cmw-flex-wrap">
          <CmwDropdown
            key="our-selections"
            size="sm"
            :active="cmwActiveSelect === 'our-selections'"
            @update-trigger="handleUpdateTrigger"
          >
            <template #default>
              <span>{{ $t('search.selections') }}</span>
            </template>
            <template #children>
              <CmwSelect
                size="sm"
                :options="selections"
                @update-value="handleUpdateValueSelections"
              />
            </template>
          </CmwDropdown>
          <!-- Note: we can also have an array :use-search-field="$options.searchableFilters.includes(key)" -->
          <CmwDropdown
            v-for="(value, key) in filterCategories"
            :key="key"
            size="sm"
            :active="cmwActiveSelect === key"
            @update-trigger="handleUpdateTrigger"
          >
            <template #default>
              <span>{{ $t(`search.${key}`) }}</span>
            </template>
            <template #children>
              <CmwSelect
                size="sm"
                :options="value"
                @update-value="handleUpdateValue"
              />
            </template>
          </CmwDropdown>
          <CmwDropdown
            key="prize"
            size="sm"
            :footer-label="$t('common.cta.apply')"
            :on-footer-click="handleOnFooterClick"
            :active="cmwActiveSelect === 'prize'"
            @update-trigger="handleUpdateTrigger"
          >
            <template #default>
              {{ $t('search.price') }}
            </template>
            <template #children>
              <div class="cmw-px-4 cmw-pb-4">
                <CmwRangeSlider
                  :min="minPrice" :max="maxPrice" :min-value-total="minPriceTotal" :max-value-total="maxPriceTotal"
                  @update-values="handleUpdateRangeValues"
                />
              </div>
            </template>
          </CmwDropdown>
        </div>
        <button
          class="cmw-flex cmw-items-center cmw-ml-auto cmw-pt-3 cmw-text-xs hover:(cmw-text-primary)"
          @click="showMoreFilters = !showMoreFilters"
        >
          <span
            class="cmw-overline-1 cmw-font-normal cmw-uppercase cmw-text-xs"
            v-text="!showMoreFilters ? 'Show more' : 'Show less'"
          />
          <VueSvgIcon
            :data="require(`@/assets/svg/plus.svg`)" class="cmw-ml-2" color="#d94965" width="16"
            height="auto"
          />
        </button>
      </div>
      <!-- selectedFilters -->
      <div class="cmw-flex cmw-justify-between cmw-items-center">
        <div>
          <div
            v-if="(activeSelections && activeSelections.length > 0) || Object.values(view).filter((el) => el != null).length > 0"
          >
            <div v-if="!!activeSelections.length || !!Object.keys(view).length" class="cmw-my-4 cmw-flex cmw-gap-2">
              <!-- selections -->
              <template v-if="!!activeSelections?.length">
                <CmwChip
                  v-for="item in activeSelections" :key="item" size="xs"
                  :label="$t(`selections.${item}`)" :on-delete="() => removeSelectionFromQuery(item)"
                />
              </template>
              <!-- other filters -->

              <template v-if="!!Object.keys(view).length">
                <CmwChip
                  v-for="(item) in Object.entries(view).filter(
                    (el) => el[1] !== null,
                  )" :key="item[1].name" size="xs"
                  :label="item[1].name" :on-delete="() => removeSelectionFromQuery(item[1].field)"
                />
              </template>
            </div>
          </div>
        </div>
        <div v-if="!!activeSelections.length || Object.values(view).some(v => v !== null)">
          <Button
            variant="text"
            size="sm"
            class=""
            @click.native="resetFilter"
          >
            <span class="cmw-text-body cmw-flex cmw-items-center cmw-gap-1">
              <VueSvgIcon :data="require(`@/assets/svg/close.svg`)" width="14" height="14" />
              {{ $t('search.removeAll') }}</span>
          </Button>
        </div>
      </div>
      <p v-html="seoData.pageDescription" />
    </div>
    <div v-if="results" class="cmw-mt-2">
      <div v-if="results.length > 0" class="">
        <div class="cmw-flex cmw-gap-2 cmw-items-center cmw-justify-between cmw-mb-8">
          <div>
            <strong>{{ total }}</strong> <span>{{ $t('search.results') }}</span>
          </div>
          <div class="cmw-hidden cmw-items-center cmw-mr-auto cmw-gap-2 lg:cmw-flex">
            <div
              v-for="layout in availableLayouts"
              :key="layout"
              class="cmw-relative"
            >
              <input
                :id="layout"
                v-model="selectedLayout"
                :aria-label="`select ${layout}`"
                class="peer cmw-appearance-none cmw-absolute cmw-w-full cmw-h-full cmw-z-dante"
                type="radio"
                name="layout"
                :value="layout"
              >
              <label
                :for="layout"
                class="
              cmw-flex cmw-rounded-sm cmw-shadow cmw-p-[0.40rem] cmw-mb-0 cmw-bg-white cmw-cursor-pointer
              peer-checked:(cmw-bg-gray-lightest cmw-shadow-none)"
              >
                <VueSvgIcon
                  class="cmw-m-auto"
                  :data="require(`@/assets/svg/layout-${layout}.svg`)"
                  width="20"
                  height="20"
                  color="#992545"
                />
              </label>
            </div>
          </div>
          <div class="d-none d-md-block col-4" />
          <div class="">
            <div>
              <!-- {{ this.$router }} -->
              <b-dropdown id="sorting" variant="null" right class="" no-caret>
                <template #button-content>
                  {{ $t('search.sortBy') }}
                  <i class="fal fa-chevron-down text-light-secondary ml-3" />
                </template>
                <div class="shadow br-10" style="width: 300px">
                  <button
                    class="btn py-3 btn-sort-by w-100 text-left d-block"
                    @click="sortBy('price', 'desc')"
                  >
                    {{ $t('search.highestPrice') }}
                  </button>
                  <button
                    class="btn py-3 btn-sort-by w-100 text-left d-block"
                    @click="sortBy('price', 'asc')"
                  >
                    {{ $t('search.lowestPrice') }}
                  </button>
                  <button
                    class="btn py-3 btn-sort-by w-100 text-left d-block"
                    @click="sortBy('awardcount', 'desc')"
                  >
                    {{ $t('search.mostAwarded') }}
                  </button>
                  <button
                    class="btn py-3 btn-sort-by w-100 text-left d-block"
                    @click="sortBy('brandname', 'asc')"
                  >
                    Brand (A-Z)
                  </button>
                  <button
                    class="btn py-3 btn-sort-by w-100 text-left d-block"
                    @click="sortBy('brandname', 'desc')"
                  >
                    Brand (Z-A)
                  </button>
                </div>
              </b-dropdown>
            </div>
          </div>
        </div>
        <div v-if="selectedLayout === 'list' && isDesktop">
          <div
            v-for="result in results"
            :key="result._id"
            class="cmw-mb-4"
          >
            <ProductBoxHorizontalElastic :product="result" :horizontal="true" />
          </div>
        </div>
        <div
          v-else class="cmw-grid cmw-grid-cols-1 cmw-gap-4 phone-md:(cmw-grid-cols-2 cmw-gap-2)
         sm:(cmw-grid-cols-2 cmw-gap-3) lg:(cmw-grid-cols-3 cmw-gap-4) desktop-wide:cmw-grid-cols-4"
        >
          <div
            v-for="result in results"
            :key="`desktop${result._id}`"
          >
            <ProductBoxVerticalElastic :product="result" />
          </div>
        </div>
      </div>
      <div v-else class="col-12">
        <p class="lead mt-5">
          {{ $t('search.noResultsAlert') }}
        </p>
        <div v-html="$t('search.noResultsMessage')" />
      </div>
    </div>

    <!-- Pagination -->
    <!-- Todo: Implement pagination as a component -->
    <!--    <div class="cmw-grid cmw-grid-cols-[auto_auto_auto] cmw-items-center cmw-justify-center cmw-mt-8">
      <SearchPagination :total-pages="total" :current-page="Number($route.query.page ?? 1)" />
    </div> -->
    <div class="cmw-grid cmw-grid-cols-[auto_auto_auto] cmw-items-center cmw-justify-center cmw-mt-8">
      <div class="">
        <Button
          class="cmw-uppercase"
          :aria-label="$t('common.cta.prevPage')"
          :disabled="pagination.currentPage.toString() === '1'"
          type="button" variant="text" @click.native="changePage(pagination.prevPage)"
        >
          <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/chevron-left.svg`)" />
          <span class="<md:cmw-hidden">{{ $t('common.cta.prevPage') }}</span>
        </Button>
      </div>
      <div class="cmw-flex">
        <div v-for="n in pagination.pageNumbers" :key="n" class="cl">
          <Button
            :label="`${n}`" variant="text"
            class="cmw-relative cmw-text-base cmw-px-3"
            :class="{ 'cmw-text-primary cmw-font-bold after:(cmw-content-DEFAULT cmw-absolute cmw-bottom-0 cmw-h-1 cmw-bg-primary cmw-w-full)': pagination.currentPage === n }"
            @click.native="changePage(n)"
          />
        </div>
      </div>
      <div class="">
        <Button
          class="cmw-uppercase"
          :disabled="+pagination.currentPage >= pagination.totalPages"
          :aria-label="$t('common.cta.nextPage')"
          type="button" variant="text" @click.native="changePage(pagination.nextPage)"
        >
          <span class="<md:cmw-hidden">{{ $t('common.cta.nextPage') }}</span>
          <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/chevron-right.svg`)" />
        </Button>
      </div>
    </div>

    <Loader v-if="loading" />

    <div v-if="!isDesktop" class="cmw-sticky cmw-bottom-8 cmw-w-[min(100%,_14rem)] cmw-m-inline-auto">
      <Button @click.native="showMobileFilters = !showMobileFilters">
        <VueSvgIcon width="28" height="28" :data="require(`@/assets/svg/filter.svg`)" />
        <span class="cmw-ml-2">{{ $t('search.showFilters') }}</span>
      </Button>
    </div>

    <div v-if="!isDesktop">
      <transition>
        <div
          v-show="showMobileFilters"
          class="cmw-fixed cmw-w-screen cmw-h-screen cmw-top-0 cmw-left-0 cmw-bg-white cmw-z-amenadiel cmw-grid cmw-grid-rows-[60px_auto_90px]"
        >
          <!-- splash-header -->
          <div
            class="cmw-sticky cmw-grid cmw-grid-cols-[100px_auto_100px] cmw-justify-between cmw-items-center cmw-px-4 cmw-shadow"
          >
            <div class="cmw-text-center cmw-w-max cmw-text-xs cmw-font-bold" v-text="$t('common.filters.by')" />
            <div>
              <Button
                v-if="!!activeSelections.length || Object.values(view).some(v => v !== null)"
                variant="text" size="sm" :label="$t('search.removeFilters')" @click.native="resetFilter"
              />
            </div>
            <ButtonIcon
              class="cmw-justify-self-end" :icon="closeIcon" variant="icon" :size="20"
              @click.native="showMobileFilters = false"
            />
          </div>
          <!-- splash-body -->
          <div class="cmw-px-2 cmw-max-h-screen cmw-overflow-auto">
            <CmwAccordion
              key="mobile-our-selections"
              size="sm"
              :has-item="!!activeSelections?.length"
              :active="cmwActiveSelect === 'mobile-our-selections'"
              @update-trigger="handleUpdateTrigger"
            >
              <template #default>
                <span class="cmw-block">
                  <span class="cmw-block cmw-text-left" :class="{ 'cmw-font-bold': !!activeSelections?.length }">{{ $t('search.selections') }}</span>
                  <small v-if="!!activeSelections?.length" class="cmw-block cmw-text-primary cmw-text-left cmw-text-xs">
                    <span
                      v-for="selection in activeSelections"
                      :key="selection"
                      data-before="∙ "
                      class="before:(cmw-content-[attr(data-before)] cmw-text-primary cmw-text-xs) first:before:(cmw-content-DEFAULT)"
                    >
                      {{ $t(`selections.${selection}`) }}
                    </span>
                  </small>
                </span>
              </template>
              <template #children>
                <CmwSelect
                  size="sm"
                  :options="selections"
                  is-full-width
                  @update-value="handleUpdateValueSelections"
                />
              </template>
            </CmwAccordion>
            <CmwAccordion
              v-for="(value, key) in filterCategories"
              :key="`mobile-${key}`"
              size="sm"
              :has-item="Object.keys(inputParameters).includes(key)"
              :active="cmwActiveSelect === `mobile-${key}`"
              @update-trigger="handleUpdateTrigger"
            >
              <template #default>
                <span class="cmw-block">
                  <span
                    class="cmw-block cmw-text-left"
                    :class="{ 'cmw-font-bold': Object.keys(inputParameters).includes(key) }"
                  >{{ $t(`search.${key}`) }}</span>
                  <small
                    v-if="Object.keys(inputParameters).includes(key)"
                    class="cmw-block cmw-text-primary cmw-text-left cmw-text-xs"
                  >
                    {{ value.find(v => v.selected) && value.find(v => v.selected).simpleLabel }}
                  </small>
                </span>
              </template>
              <template #children>
                <div class="">
                  <CmwSelect
                    size="sm"
                    :options="value"
                    is-full-width
                    @update-value="handleUpdateValue"
                  />
                </div>
              </template>
            </CmwAccordion>
            <CmwAccordion
              key="mobile-prize"
              size="sm"
              :has-item="Object.keys(inputParameters).includes('price_from')"
              :footer-label="$t('common.cta.apply')"
              :on-footer-click="handleOnFooterClick"
              :active="cmwActiveSelect === 'mobile-prize'"
              @update-trigger="handleUpdateTrigger"
            >
              <template #default>
                <span class="cmw-block">
                  <span
                    class="cmw-block cmw-text-left"
                    :class="{ 'cmw-font-bold': Object.keys(inputParameters).includes('price_from') }"
                  >{{ $t('search.price') }}</span>
                  <small
                    v-if="Object.keys(inputParameters).includes('price_from')"
                    class="cmw-block cmw-text-primary cmw-text-left cmw-text-xs"
                  >
                    <i18n
                      path="search.priceFromTo"
                      tag="span"
                    >
                      <i18n-n
                        class="cmw-inline-block" :value="Number(inputParameters.price_from)"
                        :format="{ key: 'currency' }"
                        :locale="getLocaleFromCurrencyCode($config.STORE === 'CMW_UK' ? 'GBP' : 'EUR')"
                      >
                        <template #currency="slotProps">
                          <span class="cmw-text-xs">{{ slotProps.currency }}</span>
                        </template>
                        <template #integer="slotProps">
                          <span class="cmw-text-xs">{{ slotProps.integer }}</span>
                        </template>
                        <template #group="slotProps">
                          <span class="cmw-text-xs">{{ slotProps.group }}</span>
                        </template>
                        <template #fraction="slotProps">
                          <span class="cmw-text-xs">{{ slotProps.fraction }}</span>
                        </template>
                      </i18n-n>
                      <i18n-n
                        class="cmw-inline-block" :value="Number(inputParameters.price_to)" :format="{ key: 'currency' }"
                        :locale="getLocaleFromCurrencyCode($config.STORE === 'CMW_UK' ? 'GBP' : 'EUR')"
                      >
                        <template #currency="slotProps">
                          <span class="cmw-text-xs">{{ slotProps.currency }}</span>
                        </template>
                        <template #integer="slotProps">
                          <span class="cmw-text-xs">{{ slotProps.integer }}</span>
                        </template>
                        <template #group="slotProps">
                          <span class="cmw-text-xs">{{ slotProps.group }}</span>
                        </template>
                        <template #fraction="slotProps">
                          <span class="cmw-text-xs">{{ slotProps.fraction }}</span>
                        </template>
                      </i18n-n>
                    </i18n>
                  </small>
                </span>
              </template>
              <template #children>
                <div class="cmw-px-4 cmw-pb-4">
                  <CmwRangeSlider
                    :min="minPrice" :max="maxPrice" :min-value-total="minPriceTotal" :max-value-total="maxPriceTotal"
                    @update-values="handleUpdateRangeValues"
                  />
                </div>
              </template>
            </CmwAccordion>
          </div>
          <!-- splash-footer -->
          <div
            class="cmw-sticky cmw-flex cmw-bottom-0 cmw-left-0 cmw-w-full cmw-bg-white cmw-z-content cmw-shadow-elevation"
          >
            <div class="cmw-w-[min(100%,_14rem)] cmw-m-inline-auto cmw-place-self-center">
              <Button :label="$t('search.showResults', { count: total })" @click.native="showMobileFilters = false" />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.c-scrollbar::-webkit-scrollbar {
  display:none;
}

.view-results {
  border: 2px solid #d94965;
  border-radius: 12px;
  background-color: #d94965;
  color: white;
}

.btn-sort-by:hover {
  background: #fae4e8;
}

:deep(.dropdown-menu.dropdown-menu-right.show) {
  padding-top: 0;
  padding-bottom: 0;
  border: 0;
}

.badge {
  border-radius: 2rem !important;
  padding: 0.25em 1em;
  font-weight: normal;
  cursor: pointer;
}
</style>

<script>
import { defineComponent, inject, ref, useContext, watchEffect } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import Loader from '@/components/UI/Loader.vue'
import closeIcon from '~/assets/svg/close.svg'
import chevronDownIcon from '~/assets/svg/chevron-down.svg'
import { pick } from '@/utilities/arrays'
import { useFilters } from '~/store/filters'
import { getLocaleFromCurrencyCode } from '@/utilities/currency'
import themeConfig from '~/config/themeConfig'

export default defineComponent({
  components: { Loader },
  scrollToTop: true,
  props: ['inputParameters'],
  setup() {
    const { redirect } = useContext()
    const filtersStore = useFilters()
    const { selectedLayout, availableLayouts } = storeToRefs(filtersStore)
    const isDesktop = inject('isDesktop')
    const showPageFullDescription = ref(false)
    const showMoreFilters = ref(false)
    const showMobileFilters = ref(false)

    watchEffect(() => {
      if (process.browser && document.body)
        document.body.classList.toggle('lock-scroll', showMobileFilters.value && !isDesktop.value)
    })

    return {
      isDesktop,
      showPageFullDescription,
      showMoreFilters,
      showMobileFilters,
      availableLayouts,
      selectedLayout,
      closeIcon,
      chevronDownIcon,
      redirect,
    }
  },
  data() {
    return {
      canonicalUrl: '',
      cmwActiveSelect: '',
      minPrice: 0,
      maxPrice: 0,
      minPriceTotal: null,
      maxPriceTotal: null,
      searchedTerm: '',
      loading: null,
      brands: null,
      search: {},
      aggregations: {},
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
      results: [],
      activeSelections: [],
      total: 0,
      seoData: {
        pageTitle: null,
        pageDescription: null,
        seoTitle: null,
        seoDescription: null,
        pageFullDescription: '',
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

    this.loading = true

    this.currentPage = this.inputParameters.page
      ? this.inputParameters.page
      : 1

    this.searchedTerm = this.inputParameters.search
      ? this.inputParameters.search
      : ''

    const urlSearchParams = new URLSearchParams(this.inputParameters)
    const queryToString = urlSearchParams.toString()

    // We don't wanna know ...🫣
    const changedCategories = ['1', '2', '3', '4', '54', '57', '64', '66', '75', '78', '87', '95', '97', '99', '104', '106', '109']

    if (urlSearchParams.has('categories')) {
      const category = urlSearchParams.get('categories')
      const matched = changedCategories.includes(category)

      if (matched) {
        const newPath = this.$route.fullPath.replaceAll(`-C${category}`, `-M${category}`)
        const newLocation = this.localeLocation(newPath)
        return this.redirect(301, newLocation)
      }
    }

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

    const searchResult = await fetch(`${elastic_url}${queryToString}${sel}`)
    let seo = await fetch(`${this.$config.ELASTIC_URL}product-list/seo?stores=${themeConfig[this.$config.STORE].id}&locale=${this.$i18n.locale}&${queryToString}${sel}`)
    seo = await seo.json()

    if (seo) {
      const pickedSeo = pick(seo, ['pageTitle', 'pageDescription', 'seoTitle', 'seoDescription', 'pageFullDescription'])

      if (!Object.values(pickedSeo).every(item => !item))
        this.seoData = pickedSeo
    } else {
      this.$sentry.captureException(new Error('Something went wrong on SEO API on listing page'))
    }

    const search = await searchResult.json()

    this.search = search
    this.aggregations = search?.aggregations || {}
    this.results = search.hits.hits

    const total = search.hits.total.value
    this.total = total

    if (total === 0)
      this.loading = false

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
          label: `${aggregation.name.buckets[0].key} <span class="font-light text-gray">(${aggregation.doc_count})</span>`,
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
            label: `${aggregation.key.split('|')[1]} <span class="font-light text-gray">(${aggregation.doc_count})</span>`,
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

    const hasBrand = urlSearchParams.has('brands')

    if (hasBrand) {
      const brandId = `B${urlSearchParams.get('brands')}`

      if (process.client && typeof window !== 'undefined') {
        const { origin, search } = window.location
        const encodedPath = `${encodeURIComponent(this.view.brands.name.replace(' ', '-'))}-${brandId}.htm`
        const encodedSearch = search ? encodeURIComponent(search) : ''
        this.canonicalUrl = `${origin}/${encodedPath}${encodedSearch}`
      }
    }

    this.loading = false
  },
  head() {
    return {
      title: this.seoData?.seoTitle || this.seoTitleReplace,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.seoData?.seoDescription || this.seoTitleReplace,
        },
      ],
      link: [{
        rel: 'canonical',
        href: this.canonicalUrl ? this.canonicalUrl : '',
      }],
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
    seoTitleReplace() {
      return this.view.regions?.name
        || this.view.vintages?.name
        || this.view.pairings?.name
        || this.view.brands?.name
        || this.view.agings?.name
        || this.view.philosophies?.name
        || this.view.sizes?.name
        || this.view.dosagecontents?.name
        || this.view.categories?.name
        || this.view.winelists?.name
        || this.view.awards?.name
    },
    filterCategories() {
      return Object.entries(this.filters).slice(0, !(this.showMoreFilters || !this.isDesktop) ? 4 : undefined).reduce((acc, [k, v]) => {
        if (v.length)
          acc[k] = v

        return acc
      }, {})
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
  },
  watch: {
    '$route.query': '$fetch',
    '$i18n.locale': '$fetch',
  },

  methods: {
    getLocaleFromCurrencyCode,
    handleOnFooterClick({ price_from = '', price_to = '' }) {
      this.cmwActiveSelect = ''
      this.showMobileFilters = false
      this.$router.push({
        path: '/catalog',
        query: {
          ...this.$route.query,
          price_from, // : this.minPrice,
          price_to, // : this.maxPrice,
          page: '1',
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
        path: '/catalog',
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

      if (id !== this.$route.query[id])
        query.page = 1

      this.$router.push({
        path: '/catalog',
        query,
      })
    },
    handleUpdateSortValue(value) {
      const { field, direction } = JSON.parse(value)
      this.sortBy(field, direction)
    },
    resetFilter() {
      this.cmwActiveSelect = ''
      this.showMobileFilters = false
      this.minPrice = this.minPriceTotal
      this.maxPrice = this.maxPriceTotal
      this.$router.push({
        path: '/catalog',
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
        query: {
          ...query,
          page: 1,
        },
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
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto py-4 px-4 mt-4">
    <h1 class="h3">
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
          {{ $t(`selections.${selection}`) }}
        </span>
      </template>
    </h1>

    <CategoriesMainFilters
      v-if="Object.keys(aggregations).length && Object.keys(inputParameters).length"
      :aggregations="aggregations" :input-parameters="inputParameters" @item-clicked="handleUpdateValue"
    />

    <div v-if="isDesktop">
      <!-- Filter Components -->
      <CategoriesFiltersComponents
        v-if="Object.keys(aggregations).length"
        :key="JSON.stringify(inputParameters) || 'categories-filters-components'"
        :aggregations="aggregations" :input-parameters="inputParameters"
        @update-value-selections="handleUpdateValueSelections"
        @update-value="handleUpdateValue"
        @handle-on-footer-click="handleOnFooterClick"
      />
      <CategoriesActiveSelections
        :input-parameters="inputParameters" :view="view"
        @remove-selection-from-query="removeSelectionFromQuery" @reset-filter="resetFilter"
      />
      <p v-html="seoData.pageDescription" />
    </div>
    <ProductsResultsList :results="results" :total="total" @update-sort-value="handleUpdateSortValue" />
    <CategoriesPagination :total-pages="Math.ceil(total / 48)" :input-parameters="inputParameters" />

    <ClientOnly>
      <div>
        <div
          class="relative overflow-hidden pb-8"
          :class="showPageFullDescription
            ? 'h-full'
            : 'h-[200px] after:(content-DEFAULT absolute w-full h-1/2 bottom-0 left-0 bg-gradient-to-b from-transparent to-white)'"
          v-html="seoData?.pageFullDescription ? seoData.pageFullDescription : ''"
        />
        <Button
          v-if="!showPageFullDescription" class="justify-end pb-8" variant="text"
          @click.native="showPageFullDescription = true"
        >
          <span class="mr-2">{{ $t('common.cta.readMore') }}</span>
          <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/chevron-down.svg`)" />
        </Button>
      </div>
    </ClientOnly>
    <Loader v-if="loading" />

    <div v-if="!isDesktop" class="sticky bottom-8 w-[min(100%,_14rem)] m-inline-auto">
      <Button @click.native="showMobileFilters = !showMobileFilters">
        <VueSvgIcon width="28" height="28" :data="require(`@/assets/svg/filter.svg`)" />
        <span class="ml-2">{{ $t('search.showFilters') }}</span>
      </Button>
    </div>

    <div v-if="!isDesktop">
      <transition>
        <div
          v-show="showMobileFilters"
          class="fixed w-screen h-screen top-0 left-0 bg-white z-amenadiel grid grid-rows-[60px_auto_90px]"
        >
          <!-- splash-header -->
          <div
            class="sticky grid grid-cols-[100px_auto_100px] justify-between items-center px-4 shadow"
          >
            <div class="text-center w-max text-xs font-bold" v-text="$t('common.filters.by')" />
            <div>
              <Button
                v-if="!!activeSelections.length || Object.values(view).some(v => v !== null)"
                variant="text" size="sm" :label="$t('search.removeFilters')" @click.native="resetFilter"
              />
            </div>
            <ButtonIcon
              class="justify-self-end" :icon="closeIcon" variant="icon" :size="20"
              @click.native="showMobileFilters = false"
            />
          </div>
          <!-- splash-body -->
          <div class="px-2 max-h-screen overflow-auto">
            <CmwAccordion
              key="mobile-our-selections"
              size="sm"
              :has-item="!!activeSelections?.length"
              :active="cmwActiveSelect === 'mobile-our-selections'"
              @update-trigger="handleUpdateTrigger"
            >
              <template #default>
                <span class="block">
                  <span class="block text-left" :class="{ 'font-bold': !!activeSelections?.length }">{{ $t('search.selections') }}</span>
                  <small v-if="!!activeSelections?.length" class="block text-primary text-left text-xs">
                    <span
                      v-for="selection in activeSelections"
                      :key="selection"
                      data-before="∙ "
                      class="before:(content-[attr(data-before)] text-primary text-xs) first:before:(content-DEFAULT)"
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
                <span class="block">
                  <span
                    class="block text-left"
                    :class="{ 'font-bold': Object.keys(inputParameters).includes(key) }"
                  >{{ $t(`search.${key}`) }}</span>
                  <small
                    v-if="Object.keys(inputParameters).includes(key)"
                    class="block text-primary text-left text-xs"
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
                <span class="block">
                  <span
                    class="block text-left"
                    :class="{ 'font-bold': Object.keys(inputParameters).includes('price_from') }"
                  >{{ $t('search.price') }}</span>
                  <small
                    v-if="Object.keys(inputParameters).includes('price_from')"
                    class="block text-primary text-left text-xs"
                  >
                    <i18n
                      path="search.priceFromTo"
                      tag="span"
                    >
                      <i18n-n
                        class="inline-block" :value="Number(inputParameters.price_from)"
                        :format="{ key: 'currency' }"
                        :locale="getLocaleFromCurrencyCode($config.STORE === 'CMW_UK' ? 'GBP' : 'EUR')"
                      >
                        <template #currency="slotProps">
                          <span class="text-xs">{{ slotProps.currency }}</span>
                        </template>
                        <template #integer="slotProps">
                          <span class="text-xs">{{ slotProps.integer }}</span>
                        </template>
                        <template #group="slotProps">
                          <span class="text-xs">{{ slotProps.group }}</span>
                        </template>
                        <template #fraction="slotProps">
                          <span class="text-xs">{{ slotProps.fraction }}</span>
                        </template>
                      </i18n-n>
                      <i18n-n
                        class="inline-block" :value="Number(inputParameters.price_to)" :format="{ key: 'currency' }"
                        :locale="getLocaleFromCurrencyCode($config.STORE === 'CMW_UK' ? 'GBP' : 'EUR')"
                      >
                        <template #currency="slotProps">
                          <span class="text-xs">{{ slotProps.currency }}</span>
                        </template>
                        <template #integer="slotProps">
                          <span class="text-xs">{{ slotProps.integer }}</span>
                        </template>
                        <template #group="slotProps">
                          <span class="text-xs">{{ slotProps.group }}</span>
                        </template>
                        <template #fraction="slotProps">
                          <span class="text-xs">{{ slotProps.fraction }}</span>
                        </template>
                      </i18n-n>
                    </i18n>
                  </small>
                </span>
              </template>
              <template #children>
                <div class="px-4 pb-4">
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
            class="sticky flex bottom-0 left-0 w-full bg-white z-content shadow-elevation"
          >
            <div class="w-[min(100%,_14rem)] m-inline-auto place-self-center">
              <Button :label="$t('search.showResults', { count: total })" @click.native="showMobileFilters = false" />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

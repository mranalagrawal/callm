<script>
import { inject, ref, useContext, watchEffect } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import Loader from '@/components/UI/Loader.vue'
import closeIcon from '~/assets/svg/close.svg'
import chevronDownIcon from '~/assets/svg/chevron-down.svg'
import { pick } from '@/utilities/arrays'
import { useFilters } from '~/store/filters'
import { getLocaleFromCurrencyCode } from '@/utilities/currency'
import themeConfig from '~/config/themeConfig'

export default {
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

    const query = new URLSearchParams(this.inputParameters).toString()

    // We don't wanna know ...🫣
    const changedCategories = [1, 2, 3, 4, 54, 57, 64, 66, 75, 78, 87, 95, 97, 99, 104, 106, 109]

    if (changedCategories.some(n => query.includes(`categories=${n}`))) {
      const matched = changedCategories.find(n => query.includes(`categories=${n}`))
      return this.redirect(301, this.localeLocation(`${this.$route.fullPath.replaceAll(`-C${matched}`, `-M${matched}`)}`))
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

    const searchResult = await fetch(`${elastic_url}${query}${sel}`)
    let seo = await fetch(`${this.$config.ELASTIC_URL}product-list/seo?stores=${themeConfig[this.$config.STORE].id}&locale=${this.$i18n.locale}&${query}${sel}`)
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
      title: this.seoData?.seoTitle || this.seoTitleReplace,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.seoData?.seoDescription || this.seoTitleReplace,
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
    handleOnFooterClick() {
      this.cmwActiveSelect = ''
      this.showMobileFilters = false
      this.$router.push({
        path: '/catalog',
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
}
</script>

<template>
  <div class="cmw-max-w-screen-xl cmw-mx-auto cmw-py-4 cmw-px-4 cmw-mt-4">
    <h1 class="cmw-h3">
      <template v-if="searchedTerm">
        <span>"{{ searchedTerm }}"</span>
        <p class="cmw-h4" v-text="$t('searchResultLabel')" />
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
      />
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
    <ProductsResultsList :results="results" :total="total" @update-sort-value="handleUpdateSortValue" />
    <CategoriesPagination :total-pages="Math.ceil(total / 48)" :input-parameters="inputParameters" />

    <div v-if="seoData.pageFullDescription">
      <div
        class="cmw-relative cmw-overflow-hidden cmw-pb-8"
        :class="showPageFullDescription
          ? 'cmw-h-full'
          : 'cmw-h-[200px] after:(cmw-content-DEFAULT cmw-absolute cmw-w-full cmw-h-1/2 cmw-bottom-0 cmw-left-0 cmw-bg-gradient-to-b cmw-from-transparent cmw-to-white)'"
        v-html="seoData.pageFullDescription"
      />
      <Button v-if="!showPageFullDescription" class="cmw-justify-end cmw-pb-8" variant="text" @click.native="showPageFullDescription = true">
        <span class="cmw-mr-2">{{ $t('common.cta.readMore') }}</span>
        <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/chevron-down.svg`)" />
      </Button>
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

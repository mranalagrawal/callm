<script>
import {
  computed,
  defineComponent,
  inject,
  ref,
  useContext,
  useFetch, useMeta,
  useRoute, useRouter,
  watch,
  watchEffect,
} from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import Loader from '@/components/UI/Loader.vue'
import closeIcon from '~/assets/svg/close.svg'
import chevronDownIcon from '~/assets/svg/chevron-down.svg'
import { useFilters } from '~/store/filters'
import { getLocaleFromCurrencyCode } from '@/utilities/currency'
import { pick } from '~/utilities/arrays'

export default defineComponent({
  components: { Loader },
  scrollToTop: true,
  props: ['inputParameters'],
  setup(props) {
    const { redirect, $config, i18n } = useContext()
    const route = useRoute()
    const router = useRouter()
    const filtersStore = useFilters()
    const { selectedLayout, availableLayouts } = storeToRefs(filtersStore)
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

    const searchedTerm = ref('')

    const { fetch } = useFetch(async ({ $elastic, $cmwStore }) => {
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

      const elastic_url
        = `${$config.ELASTIC_URL
      }products/search?stores=${$cmwStore.settings.id}&locale=${i18n.locale
      }&`

      const searchResult = await $elastic.$get(`${elastic_url}${queryToString}${sel}`)
      const seo = await $elastic.$get(`${$config.ELASTIC_URL}product-list/seo?stores=${$cmwStore.settings.id}&locale=${i18n.locale}&${queryToString}${sel}`)

      if (seo) {
        const pickedSeo = pick(seo, ['pageTitle', 'pageDescription', 'seoTitle', 'seoDescription', 'pageFullDescription'])

        if (!Object.values(pickedSeo).every(item => !item)) { seoData.value = pickedSeo }
      } else {
        this.$sentry.captureException(new Error('Something went wrong on SEO API on listing page'))
      }

      // const search = await searchResult.json()
      search.value = searchResult

      aggregations.value = search?.value.aggregations || {}
      results.value = search.value.hits.hits

      total.value = search.value.hits.total.value

      // h1 macro name - is not filter
      if (props.inputParameters?.macros && search.value.aggregations['agg-macros']) {
        const currentMacrosVal = props.inputParameters?.macros
        const macrosBucket = search.value.aggregations['agg-macros'].inner.result.buckets.find(b => b.key === parseInt(currentMacrosVal))
        h1MacroName.value = macrosBucket.name.buckets[0].key
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

      view.value.priceFrom = priceFrom
        ? {
            key: 'priceFrom',
            name: `From ${priceFrom}`,
            field: 'price_from',
          }
        : null
      view.value.priceTo = priceTo
        ? {
            key: 'priceTo',
            name: `To ${priceTo}`,
            field: 'price_to',
          }
        : null

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

      /* let h1Words = view.value && Object.values(view.value)
        .filter(v => v !== null)
        .map(v => v.name || '')

      if (h1MacroName.value)
        h1Words = [h1MacroName.value, ...h1Words]

      seoTitleReplace.value = h1Words.join(' - ') */

      loading.value = false
    })

    const seoTitleReplace = computed(() => {
      let h1Words = view.value && Object.values(view.value)
        .filter(v => v !== null)
        .map(v => v.name || '')

      if (h1MacroName.value) { h1Words = [h1MacroName.value, ...h1Words] }

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
      router.push({
        path: '/catalog',
        query: {
          ...route.value.query,
          price_from, // : this.minPrice,
          price_to, // : this.maxPrice,
          page: '1',
        },
      })
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
      const query = { ...props.inputParameters.value, ...route.value.query }

      if (`${query[keyword]}` === id.toString()) {
        delete query[keyword]
      } else { query[keyword] = id }

      /* if (id !== this.active)
        query.page = 1 */

      router.push({
        path: '/catalog',
        query,
      })
    }

    const handleUpdateValueSelections = (id) => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      const query = { ...props.inputParameters, ...route.value.query }

      if (`${query[id]}` === 'true') {
        delete query[id]
      } else { query[id] = 'true' }

      if (id !== route.value.query[id]) { query.page = 1 }

      router.push({
        path: '/catalog',
        query,
      })
    }

    const handleUpdateSortValue = (value) => {
      const { field, direction } = JSON.parse(value)
      this.sortBy(field, direction)
    }

    const resetFilter = () => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      minPrice.value = minPriceTotal.value
      maxPrice.value = maxPriceTotal.value
      router.push({
        path: '/catalog',
        query: null,
      })
    }

    const removeSelectionFromQuery = (selection) => {
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
      minPrice.value = minPriceTotal.value
      maxPrice.value = maxPriceTotal.value
      const query = Object.assign({}, props.inputParameters)

      delete query[selection]

      router.push({
        path: 'catalog',
        query: {
          ...query,
          page: 1,
        },
      })
    }

    const sortBy = (field, direction) => {
      const query = Object.assign({}, props.inputParameters)
      query.sort = field
      query.direction = direction
      router.push({
        path: 'catalog',
        query,
      })
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
    return {
      activeSelections,
      aggregations,
      allSelections,
      availableLayouts,
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

    <CategoriesMainFilters
      v-if="total > 0 && Object.keys(aggregations).length && Object.keys(inputParameters).length"
      :aggregations="aggregations" :input-parameters="inputParameters" @item-clicked="handleUpdateValue"
    />

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
    <div class="<md:hidden" v-html="seoData.pageDescription" />
    <ClientOnly>
      <ProductsResultsList
        :results="results" :total="total" :loading="loading"
        @update-sort-value="handleUpdateSortValue"
      />
    </ClientOnly>
    <ClientOnly>
      <CategoriesPagination
        v-if="total > 0" :total-pages="Math.ceil(total / 48)" :input-parameters="inputParameters"
        :base-path="$route.path"
      />
    </ClientOnly>

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
          <span v-if="seoData?.pageFullDescription" class="mr-2">{{ $t('common.cta.readMore') }}</span>
          <VueSvgIcon
            v-if="seoData?.pageFullDescription" width="18" height="18"
            :data="require(`@/assets/svg/chevron-down.svg`)"
          />
        </Button>
      </div>
    </ClientOnly>
    <Loader v-if="loading" />

    <div v-if="total > 0 && !isDesktop" class="sticky bottom-8 w-[min(100%,_14rem)] m-inline-auto">
      <Button @click.native="showMobileFilters = !showMobileFilters">
        <VueSvgIcon width="28" height="28" :data="require(`@/assets/svg/filter.svg`)" />
        <span class="ml-2">{{ $t('search.showFilters') }}</span>
      </Button>
    </div>

    <ClientOnly>
      <div v-if="total > 0 && !isDesktop">
        <transition>
          <div
            v-show="showMobileFilters"
            class="fixed w-screen h-screen top-0 left-0 bg-white z-amenadiel grid grid-rows-[60px_auto_90px]"
          >
            <!-- splash-header -->
            <div class="sticky grid grid-cols-[100px_auto_100px] justify-between items-center px-4 shadow">
              <div class="text-center w-max text-xs cmw-font-bold" v-text="$t('common.filters.by')" />
              <div>
                <Button
                  v-if="!!activeSelections.length || Object.values(view).some(v => v !== null)" variant="text"
                  size="sm" :label="$t('search.removeFilters')" @click.native="resetFilter"
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
                key="mobile-our-selections" size="sm" :has-item="!!activeSelections?.length"
                :active="cmwActiveSelect === 'mobile-our-selections'" @update-trigger="handleUpdateTrigger"
              >
                <template #default>
                  <span class="block">
                    <span class="block text-left" :class="{ 'cmw-font-bold': !!activeSelections?.length }">{{
                      $t('search.selections')
                    }}</span>
                    <small v-if="!!activeSelections?.length" class="block text-primary text-left text-xs">
                      <span
                        v-for="selection in activeSelections" :key="selection" data-before="∙ "
                        class="before:(content-[attr(data-before)] text-primary text-xs) first:before:(content-DEFAULT)"
                      >
                        {{ $t(`common.features.${selection}`) }}
                      </span>
                    </small>
                  </span>
                </template>
                <template #children>
                  <CmwSelect size="sm" :options="selections" is-full-width @update-value="handleUpdateValueSelections" />
                </template>
              </CmwAccordion>
              <CmwAccordion
                v-for="(value, key) in filterCategories" :key="`mobile-${key}`" size="sm"
                :has-item="Object.keys(inputParameters).includes(key)" :active="cmwActiveSelect === `mobile-${key}`"
                @update-trigger="handleUpdateTrigger"
              >
                <template #default>
                  <span class="block">
                    <span
                      class="block text-left"
                      :class="{ 'cmw-font-bold': Object.keys(inputParameters).includes(key) }"
                    >{{
                      $t(`search.${key}`)
                    }}</span>
                    <small v-if="Object.keys(inputParameters).includes(key)" class="block text-primary text-left text-xs">
                      {{ value.find(v => v.selected) && value.find(v => v.selected).simpleLabel }}
                    </small>
                  </span>
                </template>
                <template #children>
                  <div class="">
                    <CmwSelect size="sm" :options="value" is-full-width @update-value="handleUpdateValue" />
                  </div>
                </template>
              </CmwAccordion>
              <CmwAccordion
                key="mobile-prize" size="sm" :has-item="Object.keys(inputParameters).includes('price_from')"
                :footer-label="$t('common.cta.apply')" :on-footer-click="handleOnFooterClick"
                :active="cmwActiveSelect === 'mobile-prize'" @update-trigger="handleUpdateTrigger"
              >
                <template #default>
                  <span class="block">
                    <span
                      class="block text-left"
                      :class="{ 'cmw-font-bold': Object.keys(inputParameters).includes('price_from') }"
                    >{{
                      $t('search.price')
                    }}</span>
                    <small
                      v-if="Object.keys(inputParameters).includes('price_from')"
                      class="block text-primary text-left text-xs"
                    >
                      <i18n path="search.priceFromTo" tag="span">
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
                      :min="minPrice" :max="maxPrice" :min-value-total="minPriceTotal"
                      :max-value-total="maxPriceTotal" @update-values="handleUpdateRangeValues"
                    />
                  </div>
                </template>
              </CmwAccordion>
            </div>
            <!-- splash-footer -->
            <div class="sticky flex bottom-0 left-0 w-full bg-white z-content shadow-elevation">
              <div class="w-[min(100%,_14rem)] m-inline-auto place-self-center">
                <Button :label="$t('search.showResults', { count: total })" @click.native="showMobileFilters = false" />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </ClientOnly>
  </div>
</template>

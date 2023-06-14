<script lang="ts">
import type { PropType, Ref } from '@nuxtjs/composition-api'
import {
  computed,
  defineComponent,
  inject,
  ref,
  useContext,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import plusIcon from 'assets/svg/plus.svg'

interface Query {
  [key: string]: string | undefined
}

interface IFilters {
  winelists: []
  pairings: []
  dosagecontents: []
  bodystyles: []
  boxes: []
  areas: []
  provenience: []
  awards: []
  agings: []
  philosophies: []
}

export default defineComponent({
  props: {
    inputParameters: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    aggregations: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },
  setup(props) {
    const { i18n } = useContext()
    const router = useRouter()
    const route = useRoute()
    const showMoreFilters = ref(false)
    const isDesktop = inject('isDesktop') as Ref<boolean>

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

    const belongFilters = [
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

    const relationFilters = [
      'awards',
      'agings',
      'categories',
      'philosophies',
      'winelists',
      'pairings',
    ]

    const cmwActiveSelect = ref('')
    const minPrice = ref(0)
    const maxPrice = ref(0)
    const minPriceTotal = ref(0)
    const maxPriceTotal = ref(0)

    const handleUpdateTrigger = (key: string) => {
      cmwActiveSelect.value = cmwActiveSelect.value === key ? '' : key
    }

    const handleUpdateValueSelections = (id: string | number) => {
      cmwActiveSelect.value = ''
      // this.showMobileFilters = false
      const query: Query = { ...props.inputParameters.value, ...route.value.query }

      if (`${query[id]}` === 'true')
        delete query[id]
      else
        query[id] = 'true'

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
      const query = { ...props.inputParameters, ...route.value.query }

      if (`${query[keyword]}` === id.toString())
        delete query[keyword]
      else query[keyword] = id

      // if (id !== this.active)
      //   query.page = 1

      router.push({
        path: '/catalog',
        query,
      })
    }

    const handleOnFooterClick = () => {
      cmwActiveSelect.value = ''
      // this.showMobileFilters = false
      router.push({
        path: '/catalog',
        query: {
          ...route.value.query,
          price_from: minPrice.value.toString(),
          price_to: maxPrice.value.toString(),
          page: '1',
        },
      })
    }

    const handleUpdateRangeValues = ({ minValue, maxValue }: { minValue: number | string; maxValue: number | string }) => {
      minPrice.value = Number(minValue)
      maxPrice.value = Number(maxValue)
    }

    const selections = computed(() => {
      if (!props.aggregations || !Object.keys(props.aggregations).length)
        return []

      const aggregationsParsed = JSON.parse(JSON.stringify(props.aggregations))

      const selectionsListMapped: any[] = []
      allSelections.forEach((el) => {
        const tmp = aggregationsParsed[`agg-${el}`][`agg-${el}`].buckets.find(
          (el: { key: number }) => el.key === 1,
        )

        if (tmp) {
          tmp.key = [Boolean(tmp.key), el]
          tmp.key_as_string = el
          tmp.value = el
          tmp.label = i18n.t(`selections.${el}`)
          tmp.icon = el // `selections/${el}.svg`
          tmp.selected = route.value.fullPath?.toLowerCase().includes(el)
          selectionsListMapped.push(tmp)
        }
      })

      return selectionsListMapped
    })

    const computedFilters = computed<IFilters>(() => {
      let filters: any = {}

      belongFilters.forEach((el) => {
        let data = props.aggregations[`agg-${el}`][`agg-${el}`].buckets.map(
          (aggregation: any) => {
            return {
              key: aggregation.key.split('|'),
              key_as_string: aggregation.key,
              doc_count: aggregation.doc_count,
              value: JSON.stringify({ id: aggregation.key.split('|')[0], keyword: el }),
              label: `${aggregation.key.split('|')[1]} <span class="cmw-font-light cmw-text-gray">(${aggregation.doc_count})</span>`,
              selected: props.inputParameters && props.inputParameters[el] && props.inputParameters[el] === `${aggregation.key}`,
            }
          },
        )

        data = data.filter((bucket: { key: string | string[] }) => !bucket.key.includes('not specified'))

        filters = {
          ...filters,
          [el]: data,
        }
      })

      relationFilters.forEach((el) => {
        const data = props.aggregations[`agg-${el}`].inner.result.buckets.map(
          (aggregation: any) => {
            return {
              key: [aggregation.key, aggregation.name.buckets[0].key],
              key_as_string: `${aggregation.key}|${aggregation.name.buckets[0].key}`,
              doc_count: aggregation.doc_count,
              value: JSON.stringify({ id: aggregation.key, keyword: el }),
              label: `${aggregation.name.buckets[0].key} <span class="cmw-font-light cmw-text-gray">(${aggregation.doc_count})</span>`,
              simpleLabel: aggregation.name.buckets[0].key,
              selected: props.inputParameters && props.inputParameters[el] && props.inputParameters[el] === `${aggregation.key}`,
            }
          })

        filters = {
          ...filters,
          [el]: data,
        }
      })

      const priceFrom = props.inputParameters.price_from
      const priceTo = props.inputParameters.price_to

      /* this.view.priceFrom = priceFrom
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
        : null */

      maxPriceTotal.value = Math.round(+props.aggregations.max_price['agg-max-price'].value)
      maxPrice.value = priceTo || Math.round(+props.aggregations.max_price['agg-max-price'].value)

      minPriceTotal.value = Math.round(+props.aggregations.min_price['agg-min-price'].value)
      minPrice.value = priceFrom || Math.round(+props.aggregations.min_price['agg-min-price'].value)

      return filters
    })

    const filteredCategories = computed(() => {
      return Object.entries(computedFilters.value)
        .slice(0, !(showMoreFilters.value || !isDesktop.value) ? 4 : undefined)
        .reduce((acc: { [key: string]: any[] }, [k, v]) => {
          if (v.length)
            acc[k] = v

          return acc
        }, {})
    })

    return {
      cmwActiveSelect,
      computedFilters,
      filteredCategories,
      handleOnFooterClick,
      handleUpdateRangeValues,
      handleUpdateTrigger,
      handleUpdateValue,
      handleUpdateValueSelections,
      isDesktop,
      maxPrice,
      maxPriceTotal,
      minPrice,
      minPriceTotal,
      plusIcon,
      selections,
      showMoreFilters,
    }
  },
})
</script>

<template>
  <div
    class="cmw-grid cmw-grid-cols-[auto_200px] cmw-items-start cmw-border-y cmw-border-gray-light cmw-py-1 cmw-transition-all"
  >
    <div class="cmw-flex cmw-flex-wrap cmw-min-h-[42px]">
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
        v-for="(value, key) in filteredCategories"
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
      <VueSvgIcon :data="plusIcon" class="cmw-ml-2" color="#d94965" width="16" height="auto" />
    </button>
  </div>
</template>

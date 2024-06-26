<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  ref,
  useContext,
  useRoute,
} from '@nuxtjs/composition-api'
import type { PropType, Ref } from '@nuxtjs/composition-api'

import plusIcon from '~/assets/svg/plus.svg'

import { orderByArray } from '~/utilities/arrays'

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
  emits: ['update-value-selections', 'update-value', 'handle-on-footer-click'],
  setup(props, { emit }) {
    const { i18n } = useContext()
    // const router = useRouter()
    const route = useRoute()
    const showMoreFilters = ref(false)
    const isDesktop = inject('isDesktop') as Ref<boolean>

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
      emit('update-value-selections', id)
    }

    const handleUpdateValue = (val: string) => {
      cmwActiveSelect.value = ''
      emit('update-value', val)
    }

    const handleOnFooterClick = () => {
      cmwActiveSelect.value = ''
      emit('handle-on-footer-click', {
        price_from: minPrice.value.toString(),
        price_to: maxPrice.value.toString(),
      })
    }

    const handleUpdateRangeValues = ({ minValue, maxValue }: { minValue: number | string; maxValue: number | string }) => {
      minPrice.value = Number(minValue)
      maxPrice.value = Number(maxValue)
    }

    const selections = computed(() => {
      if (!props.aggregations || !Object.keys(props.aggregations).length) { return [] }

      const aggregationsParsed = JSON.parse(JSON.stringify(props.aggregations))

      const selectionsListMapped: any[] = []
      allSelections.forEach((el) => {
        const tmp = aggregationsParsed[`agg-${el}`] && aggregationsParsed[`agg-${el}`][`agg-${el}`].buckets.find(
          (el: { key: number }) => el.key === 1,
        )

        if (tmp) {
          tmp.key = [Boolean(tmp.key), el]
          tmp.key_as_string = el
          tmp.value = el
          tmp.label = `${i18n.t(`common.features.${el}`)} <span class="cmw-font-light text-gray">(${tmp.doc_count})</span>`
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
              label: `${aggregation.key.split('|')[1]} <span class="cmw-font-light text-gray">(${aggregation.doc_count})</span>`,
              selected: props.inputParameters && props.inputParameters[el] && props.inputParameters[el] === `${aggregation.key}`,
            }
          },
        )

        data = data.filter((bucket: { key: string | string[] }) => !bucket.key.includes('not specified'))
        data = data.filter((bucket: { key: string | string[] }) => !bucket.key.includes('non specificato'))
        data = data.filter((bucket: { key: string | string[] }) => !bucket.key.includes('nicht angegeben'))
        data = data.filter((bucket: { key: string | string[] }) => !bucket.key.includes('non spécifié'))

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
              label: `${aggregation.name.buckets[0].key} <span class="cmw-font-light text-gray">(${aggregation.doc_count})</span>`,
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

      maxPriceTotal.value = Math.round(+props.aggregations.max_price['agg-max-price'].value)
      maxPrice.value = priceTo || Math.round(+props.aggregations.max_price['agg-max-price'].value)

      minPriceTotal.value = Math.round(+props.aggregations.min_price['agg-min-price'].value)
      minPrice.value = priceFrom || Math.round(+props.aggregations.min_price['agg-min-price'].value)

      // Use the orderByArray function to reorder the filters
      filters = orderByArray(filters)
      return filters
    })

    const filteredCategories = computed(() => {
      return Object.entries(computedFilters.value)
        .slice(0, !(showMoreFilters.value || !isDesktop.value) ? 6 : undefined)
        .reduce((acc: { [key: string]: any[] }, [k, v]) => {
          if (v.length) { acc[k] = v }

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
    class="grid grid-cols-[auto_200px] items-start border-y border-gray-light py-1 transition-all js-select-filter-list"
  >
    <div class="flex flex-wrap min-h-[42px]">
      <CmwDropdown
        v-if="!!selections.length"
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
          <div class="px-4 pb-4">
            <CmwRangeSlider
              :min="minPrice" :max="maxPrice" :min-value-total="minPriceTotal" :max-value-total="maxPriceTotal"
              @update-values="handleUpdateRangeValues"
            />
          </div>
        </template>
      </CmwDropdown>
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
    </div>
    <button
      class="flex items-center ml-auto pt-3 text-xs hover:(text-primary)"
      @click="showMoreFilters = !showMoreFilters"
    >
      <span
        class="overline-1 font-normal uppercase text-xs"
        v-text="!showMoreFilters ? $t('search.showMore') : $t('search.showLess')"
      />
      <VueSvgIcon :data="plusIcon" class="ml-2" color="#d94965" width="16" height="auto" />
    </button>
  </div>
</template>

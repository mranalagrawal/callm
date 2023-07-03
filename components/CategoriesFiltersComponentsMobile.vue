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
import closeIcon from '~/assets/svg/close.svg'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'

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
    const isDesktop = inject('isDesktop') as Ref<boolean>
    const showMobileFilters = inject('showMobileFilters') as Ref<boolean>
    const total = inject('total') as Ref<number>
    const showMoreFilters = ref(false)
    const activeSelections = ref<string[]>([])

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
    const view = ref<Record<string, any>>({})
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
      console.log('HERE?')
      cmwActiveSelect.value = ''
      showMobileFilters.value = false
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

    const resetFilter = () => {
      cmwActiveSelect.value = ''
      // this.showMobileFilters = false
      // this.minPrice = this.minPriceTotal
      // this.maxPrice = this.maxPriceTotal
      // this.$router.push({
      //   path: '/catalog',
      //   query: null,
      // })
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

    activeSelections.value = Object.keys(props.inputParameters).filter(el =>
      allSelections.includes(el),
    )

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
              label: `${aggregation.key.split('|')[1]} <span class="font-light text-gray">(${aggregation.doc_count})</span>`,
              selected: props.inputParameters && props.inputParameters[el] && props.inputParameters[el] === `${aggregation.key}`,
            }
          },
        )

        data = data.filter((bucket: { key: string | string[] }) => !bucket.key.includes('not specified'))

        // this[`${el}`] = buckets

        const filterId = props.inputParameters[el]

        view.value[el] = filterId
          ? {
              key: filterId,
              name: data.find((x: { key: any[] }) => `${x.key[0]}` === `${filterId}`).key[1],
              field: el,
            }
          : null

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
              label: `${aggregation.name.buckets[0].key} <span class="font-light text-gray">(${aggregation.doc_count})</span>`,
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
      activeSelections,
      closeIcon,
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
      resetFilter,
      selections,
      showMobileFilters,
      showMoreFilters,
      total,
      view,
    }
  },
  methods: { getLocaleFromCurrencyCode },
})
</script>

<template>
  <div v-if="!isDesktop" class="relative">
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
            v-for="(value, key) in filteredCategories"
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
</template>
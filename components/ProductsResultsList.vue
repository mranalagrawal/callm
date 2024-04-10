<script lang="ts">
import { defineComponent, inject, ref, useContext, useMeta, useRoute, watch, watchEffect } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useFilters } from '~/store/filters'

import type { IProductMapped } from '~/types/product'
import type { ObjType } from '~/types/types'
import { stripHtml } from '~/utilities/strings'

export default defineComponent({
  props: {
    results: {
      type: Array as PropType<ObjType<KeyType>[]>,
      required: true,
    },
    total: {
      type: [String, Number],
      required: true,
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update-sort-value'],
  setup(props, { emit }) {
    const { $config, $productMapping, $cmwGtmUtils, i18n, localePath, req } = useContext()
    const route = useRoute()
    const { selectedLayout, availableLayouts } = storeToRefs(useFilters())
    const isDesktop = inject('isDesktop')
    const mappedProductListRef = ref<IProductMapped[]>([])

    const originUrl = ref('')
    const sorting = ref(false)

    if (process.server && req?.headers && req?.url) {
      originUrl.value = `https://${req.headers.host}`
    }

    if (process.client && typeof window !== 'undefined') {
      const {
        origin,
      } = window.location
      originUrl.value = `${origin}`
    }

    const selectedSort = ref(i18n.t('common.filters.sort.by'))

    const sortOptions = [{
      label: i18n.t('common.filters.sort.popularity.most'),
      value: JSON.stringify({
        field: 'popularity',
        direction: 'desc',
        label: i18n.t('common.filters.sort.popularity.most'),
      }),
    },
    {
      label: i18n.t('common.filters.sort.price.highest'),
      value: JSON.stringify({
        field: 'price',
        direction: 'desc',
        label: i18n.t('common.filters.sort.price.highest'),
      }),
    },
    {
      label: i18n.t('common.filters.sort.price.lowest'),
      value: JSON.stringify({
        field: 'price',
        direction: 'asc',
        label: i18n.t('common.filters.sort.price.lowest'),
      }),
    },
    {
      label: i18n.t('common.filters.sort.awarded.most'),
      value: JSON.stringify({
        field: 'awardcount',
        direction: 'desc',
        label: i18n.t('common.filters.sort.awarded.most'),
      }),
    },
    {
      label: i18n.t('common.filters.sort.novelty'),
      value: JSON.stringify({
        field: 'isnew',
        direction: 'desc',
        label: i18n.t('common.filters.sort.novelty'),
      }),
    },
    ]

    const handleUpdateSortValue = (val: string) => {
      emit('update-sort-value', val)
      sorting.value = false
    }

    const handleUpdateSortTrigger = () => {
      sorting.value = !sorting.value
    }

    const pushProductListView = () => {
      if (!mappedProductListRef.value?.length) { return }

      const impressions = mappedProductListRef.value.map((product, i) => {
        // eslint-disable-next-line unused-imports/no-unused-vars
        const { quantity, ...rest } = product.gtmProductData
        return {
          ...rest,
          position: i + 1,
        }
      })

      $cmwGtmUtils.pushPage($cmwGtmUtils.getActionField(route.value), {
        event: 'productListView',
        ecommerce: {
          currencyCode: $config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          actionField: { list: $cmwGtmUtils.getActionField(route.value) },
          impressions,
        },
      })
    }

    const setItemListSchema = () => {
      if (!mappedProductListRef.value?.length) { return [] }

      return mappedProductListRef.value.map((product, i) => {
        const { title } = product

        return {
          '@type': 'ListItem',
          'position': i + 1,
          'name': title,
          'url': `${originUrl.value}${localePath(product.url)}`,
          'image': product.image?.source.url,
          'description': stripHtml(product.tbd.description),
        }
      })
    }

    useMeta(() => ({
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          'itemListElement': setItemListSchema(),
        }),
      }],
      __dangerouslyDisableSanitizers: ['script'],
    }))

    watch(() => props.results, () => {
      if (props.results?.length) {
        mappedProductListRef.value = $productMapping.fromElastic(props.results)
        process.browser && pushProductListView()
      }
    },
    { immediate: true, deep: true })

    watchEffect(() => {
      const sortQuery = route.value.query?.sort
      const directionQuery = route.value.query?.direction

      const defaultSortLabel = i18n.t('common.filters.sort.by')

      if (sortQuery && directionQuery) {
        const matchingSort = sortOptions.find(option =>
          option.value.includes(`"${sortQuery}"`) && option.value.includes(`"${directionQuery}"`),
        )

        if (matchingSort) {
          selectedSort.value = matchingSort.label
          return
        }
      }

      selectedSort.value = defaultSortLabel
    })

    return {
      availableLayouts,
      handleUpdateSortTrigger,
      handleUpdateSortValue,
      isDesktop,
      mappedProductListRef,
      selectedLayout,
      selectedSort,
      sortOptions,
      sorting,
    }
  },
  head: {},
})
</script>

<template>
  <div class="mt-2">
    <div v-if="mappedProductListRef?.length > 0" class="">
      <div class="flex gap-2 items-center justify-between mb-8">
        <div>
          <strong>{{ total }}</strong> <span>{{ $tc('search.results', Number(total)) }}</span>
        </div>
        <div class="flex items-center mr-auto gap-2">
          <div
            v-for="({ icon, key }) in availableLayouts"
            :key="key"
            class="relative"
          >
            <input
              :id="key"
              v-model="selectedLayout"
              :aria-label="`select ${key}`"
              class="peer appearance-none absolute w-full h-full z-dante"
              type="radio"
              name="layout"
              :value="key"
            >
            <label
              :for="key"
              class="
              flex rounded-sm shadow p-[0.40rem] mb-0 bg-white cursor-pointer
              peer-checked:(bg-gray-lightest shadow-none)"
            >
              <VueSvgIcon
                class="m-auto"
                :data="icon"
                width="20"
                height="20"
                color="#992545"
              />
            </label>
          </div>
        </div>
        <CmwDropdown
          key="sort-by"
          size="sm"
          :active="sorting"
          position="right"
          @update-trigger="handleUpdateSortTrigger"
        >
          <template #default>
            <span>{{ selectedSort }}</span>
          </template>
          <template #children>
            <CmwSelect
              position="right"
              :options="sortOptions"
              @update-value="handleUpdateSortValue"
            />
          </template>
        </CmwDropdown>
      </div>
      <div v-if="selectedLayout === 'list'">
        <div
          v-for="(result, idx) in mappedProductListRef"
          :key="result.shopify_product_id"
          class="mb-4"
        >
          <ProductBoxHorizontal :product="result" :position="idx + 1" />
        </div>
      </div>
      <div
        v-else class="products-grid"
      >
        <div
          v-for="(result, idx) in mappedProductListRef"
          :key="`desktop${result.shopify_product_id}`"
        >
          <ProductBoxVertical :product="result" :position="idx + 1" />
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="!loading">
        <p class="text-lg cmw-font-light mt-5">
          {{ $t('search.noResultsAlert') }}
        </p>
        <div v-html="$t('search.noResultsMessage')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent, inject, ref, useContext, useRoute } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import type { ObjType } from '~/types/types'
import { useFilters } from '~/store/filters'
import type { IProductMapped } from '~/types/product'
import gridIcon from '~/assets/svg/layout-grid.svg'
import listIcon from '~/assets/svg/layout-list.svg'

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
    const { $config, $productMapping, $cmwGtmUtils } = useContext()
    const route = useRoute()
    const { selectedLayout, availableLayouts } = storeToRefs(useFilters())
    const isDesktop = inject('isDesktop')

    const sorting = ref(false)
    const handleUpdateSortValue = (val: string) => {
      emit('update-sort-value', val)
      sorting.value = false
    }

    const handleUpdateSortTrigger = () => {
      sorting.value = !sorting.value
    }

    const mappedProducts = computed<IProductMapped[]>(() => {
      let mappedProducts: IProductMapped[] = []

      if (props.results?.length) {
        mappedProducts = $productMapping.fromElastic(props.results)
        // mappedProducts.sort((a, b) => Number(b.availableForSale) - Number(a.availableForSale))
      }

      if (process.browser) {
        const impressions = mappedProducts.map((product, i) => {
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

      return mappedProducts
    })

    const getLayoutIcon = (layout: 'grid' | 'list') => ({
      grid: gridIcon,
      list: listIcon,
    }[layout] || gridIcon)

    return {
      availableLayouts,
      getLayoutIcon,
      handleUpdateSortTrigger,
      handleUpdateSortValue,
      isDesktop,
      mappedProducts,
      selectedLayout,
      sorting,
    }
  },
})
</script>

<template>
  <div class="mt-2">
    <div v-if="mappedProducts?.length > 0" class="">
      <div class="flex gap-2 items-center justify-between mb-8">
        <div>
          <strong>{{ total }}</strong> <span>{{ $t('search.results') }}</span>
        </div>
        <div class="hidden items-center mr-auto gap-2 lg:flex">
          <div
            v-for="layout in availableLayouts"
            :key="layout"
            class="relative"
          >
            <input
              :id="layout"
              v-model="selectedLayout"
              :aria-label="`select ${layout}`"
              class="peer appearance-none absolute w-full h-full z-dante"
              type="radio"
              name="layout"
              :value="layout"
            >
            <label
              :for="layout"
              class="
              flex rounded-sm shadow p-[0.40rem] mb-0 bg-white cursor-pointer
              peer-checked:(bg-gray-lightest shadow-none)"
            >
              <VueSvgIcon
                class="m-auto"
                :data="getLayoutIcon(layout)"
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
            <span>{{ $t('common.filters.sort.by') }}</span>
          </template>
          <template #children>
            <CmwSelect
              position="right"
              :options="[{
                           label: $t('common.filters.sort.popularity.most'),
                           value: JSON.stringify({ field: 'popularity', direction: 'desc' }),
                         },
                         {
                           label: $t('common.filters.sort.price.highest'),
                           value: JSON.stringify({ field: 'price', direction: 'desc' }),
                         },
                         {
                           label: $t('common.filters.sort.price.lowest'),
                           value: JSON.stringify({ field: 'price', direction: 'asc' }),
                         },
                         {
                           label: $t('common.filters.sort.awarded.most'),
                           value: JSON.stringify({ field: 'awardcount', direction: 'desc' }),
                         },
                         {
                           label: $t('common.filters.sort.novelty'),
                           value: JSON.stringify({ field: 'isnew', direction: 'desc' }),
                         },
              ]"
              @update-value="handleUpdateSortValue"
            />
          </template>
        </CmwDropdown>
      </div>
      <div v-if="selectedLayout === 'list' && isDesktop">
        <div
          v-for="(result, idx) in mappedProducts"
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
          v-for="(result, idx) in mappedProducts"
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

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent, inject, ref, useContext, useRoute } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import type { ObjType } from '~/plugins/product-mapping'
import { useFilters } from '~/store/filters'
import type { IProductMapped } from '~/types/product'

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
  },
  emits: ['update-sort-value'],
  setup(props, { emit }) {
    const { $config, $productMapping, $cmwGtmUtils } = useContext()
    const route = useRoute()
    const filtersStore = useFilters()
    const { selectedLayout, availableLayouts } = storeToRefs(filtersStore)
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

      if (props.results.length) {
        mappedProducts = $productMapping.fromElastic(props.results)
        mappedProducts.sort((a, b) => Number(b.availableForSale) - Number(a.availableForSale))
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

    return {
      availableLayouts,
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
    <div v-if="mappedProducts.length > 0" class="">
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
                :data="require(`@/assets/svg/layout-${layout}.svg`)"
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
            <span>{{ $t('search.sortBy') }}</span>
          </template>
          <template #children>
            <CmwSelect
              position="right"
              :options="[{
                           label: $t('search.highestPrice'),
                           value: JSON.stringify({ field: 'price', direction: 'desc' }),
                         },
                         {
                           label: $t('search.lowestPrice'),
                           value: JSON.stringify({ field: 'price', direction: 'asc' }),
                         },
                         {
                           label: $t('search.mostAwarded'),
                           value: JSON.stringify({ field: 'awardcount', direction: 'desc' }),
                         },
                         {
                           label: $t('search.brandAsc'),
                           value: JSON.stringify({ field: 'brandname', direction: 'asc' }),
                         },
                         {
                           label: $t('search.brandDesc'),
                           value: JSON.stringify({ field: 'brandname', direction: 'desc' }),
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
        v-else class="grid grid-cols-1 gap-4 phone-md:(grid-cols-2 gap-2)
         sm:(grid-cols-2 gap-3) lg:(grid-cols-3 gap-4) desktop-wide:grid-cols-4"
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
      <p class="text-lg font-light mt-5">
        {{ $t('search.noResultsAlert') }}
      </p>
      <div v-html="$t('search.noResultsMessage')" />
    </div>
  </div>
</template>

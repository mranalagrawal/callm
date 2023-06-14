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
  <div class="cmw-mt-2">
    <div v-if="mappedProducts.length > 0" class="">
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
          class="cmw-mb-4"
        >
          <ProductBoxHorizontal :product="result" :position="idx + 1" />
        </div>
      </div>
      <div
        v-else class="cmw-grid cmw-grid-cols-1 cmw-gap-4 phone-md:(cmw-grid-cols-2 cmw-gap-2)
         sm:(cmw-grid-cols-2 cmw-gap-3) lg:(cmw-grid-cols-3 cmw-gap-4) desktop-wide:cmw-grid-cols-4"
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
      <p class="cmw-text-lg cmw-font-light cmw-mt-5">
        {{ $t('search.noResultsAlert') }}
      </p>
      <div v-html="$t('search.noResultsMessage')" />
    </div>
  </div>
</template>

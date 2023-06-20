<script lang="ts">
import type { Ref } from '@nuxtjs/composition-api'
import { computed, defineComponent, inject, onMounted, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import type { TranslateResult } from 'vue-i18n'
import { useFilters } from '~/store/filters'
import { useCustomerOrders } from '~/store/customerOrders'

export default defineComponent({
  setup() {
    const { i18n, $cmwGtmUtils, $productMapping } = useContext()
    const customerOrders = useCustomerOrders()
    const { orders } = storeToRefs(customerOrders)
    const isDesktop = inject('isDesktop') as Ref<boolean>

    const filtersStore = useFilters()
    const { selectedLayout, availableLayouts } = storeToRefs(filtersStore)

    const selectedSort = ref('most-recent')
    const sort = ref<{ label: TranslateResult; value: string }[]>([
      {
        label: i18n.t('common.filters.sort.mostRecent'),
        value: 'most-recent',
      },
      {
        label: i18n.t('common.filters.sort.lessRecent'),
        value: '2022-12-01',
        // value: 'lessRecent',
      },
      {
        label: i18n.t('common.filters.sort.lowestPrice'),
        value: 'lowestPrice',
      },
      {
        label: i18n.t('common.filters.sort.highestPrice'),
        value: 'highestPrice',
      },
      {
        label: i18n.t('common.filters.sort.nameAsc'),
        value: 'nameAsc',
      },
      {
        label: i18n.t('common.filters.sort.nameDesc'),
        value: 'nameDesc',
      },
    ]) // processed_at:>2022-12-01
    const selectedLabel = computed(() => {
      const selectedItem = sort.value.find(period => period.value === selectedSort.value)
      return selectedItem?.label
    })

    const filteredSort = computed(() => sort.value.filter(s => s.value !== selectedSort.value))

    useFetch(async () => {
      await customerOrders.getOrders(`processed_at:>${selectedSort.value}`)
    })

    /* const handleUpdateValue = (value) => {
      selectedSort.value = value
      fetch()
    } */

    const customerProducts = computed(() => {
      // Note: there's an annoying warning but the page renders perfectly, https://github.com/nuxt-community/composition-api/issues/19
      if (!orders.value)
        return []

      const uniqueProductIds = new Set()
      const mappedProducts = []

      for (const order of orders.value) {
        for (const lineItem of order.lineItems.nodes) {
          const product = lineItem.variant.product

          if (product.id && !product.isGiftCard && !uniqueProductIds.has(product.id)) {
            uniqueProductIds.add(product.id)
            mappedProducts.push(product)
          }
        }
      }

      return $productMapping.fromShopify(mappedProducts)
    })

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    return {
      // handleUpdateValue,
      availableLayouts,
      customerProducts,
      filteredSort,
      isDesktop,
      orders,
      selectedLabel,
      selectedLayout,
      selectedSort,
      sort,
    }
  },
})
</script>

<template>
  <div>
    <div class="c-filterBar flex items-center justify-between px-4">
      <div>
        <!--        <CmwSelect
          v-model="selectedSort"
          :options="filteredSort"
          @update-value="handleUpdateValue"
        >
          <span>{{ selectedLabel }}</span>
        </CmwSelect> -->
      </div>
      <div class="hidden items-center gap-2 lg:flex">
        <div
          v-for="layout in availableLayouts"
          :key="layout"
          class="relative"
        >
          <input
            :id="layout"
            v-model="selectedLayout"
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
    </div>
    <p v-if="$fetchState.pending" class="px-4">
      {{ $t("loading") }}
    </p>
    <!-- Todo: Handle Error -->
    <!--    <p v-else-if="$graphql.error">
      {{ $t("fetchError") }}
    </p> -->
    <div v-else>
      <div
        v-if="!!customerProducts.length"
        class="p-4"
      >
        <template v-if="selectedLayout === 'list' && isDesktop">
          <div
            v-for="product in customerProducts"
            :key="product.id"
            class="mb-4"
          >
            <ProductBoxHorizontal :product="product" :is-desktop="isDesktop" />
          </div>
        </template>
        <template v-else>
          <div
            class="grid grid-cols-1 gap-4 phone-md:(grid-cols-2 gap-2)
          sm:(grid-cols-2 gap-3) lg:(grid-cols-3 gap-4) desktop-wide:grid-cols-4"
          >
            <ProductBoxVertical
              v-for="product in customerProducts"
              :key="product.id"
              :product="product"
            />
          </div>
        </template>
      </div>
      <div v-else>
        <p class="lead">
          {{ $t("profile.noProducts") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { getMappedProducts } from '@/utilities/mappedProduct'
import { useFilters } from '~/store/filters'
import { getUniqueListBy } from '~/utilities/arrays'
import { useCustomerOrders } from '~/store/customerOrders'

export default {
  props: {
    isDesktop: Boolean,
  },
  setup() {
    const { i18n } = useContext()
    const customerOrders = useCustomerOrders()
    const { orders } = storeToRefs(customerOrders)

    const filtersStore = useFilters()
    const { selectedLayout, availableLayouts } = storeToRefs(filtersStore)

    const selectedSort = ref('most-recent')
    const sort = ref([
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
    const selectedLabel = computed(() => sort.value.find(period => period.value === selectedSort.value).label)
    const filteredSort = computed(() => sort.value.filter(s => s.value !== selectedSort.value))

    const { fetch } = useFetch(async () => {
      await customerOrders.getOrders(`processed_at:>${selectedSort.value}`)
    })

    const handleUpdateValue = (value) => {
      selectedSort.value = value
      fetch()
    }

    const customerProducts = computed(() => {
      // Note: there's an annoying warning but the page renders perfectly, https://github.com/nuxt-community/composition-api/issues/19
      // on Nuxt 3 we will get nodes directly
      if (!orders.value)
        return []

      let arr = orders.value
        .map(el => el.lineItems.edges)
        .flat()
        .map((el) => {
          // Note: we can remove this product from the logic if we fix the wishlist
          // const { __typename, product, ...rest } = el.node.variant
          let result = {}
          if (el.node?.variant?.product) {
            const { __typename, ...rest } = el.node.variant.product
            result = rest
          } else {
            result = {}
          }
          return (result)
        }) || []

      arr = arr.filter(p => p.id)
      arr = getUniqueListBy(arr, 'id')
      arr = getMappedProducts(arr)
      return arr
    })

    return {
      orders,
      availableLayouts,
      selectedLayout,
      sort,
      selectedSort,
      selectedLabel,
      filteredSort,
      customerProducts,
      handleUpdateValue,
    }
  },
}
</script>

<template>
  <div>
    <div class="c-filterBar cmw-flex cmw-items-center cmw-justify-between cmw-px-4">
      <div>
        <!--        <CmwSelect
          v-model="selectedSort"
          :options="filteredSort"
          @update-value="handleUpdateValue"
        >
          <span>{{ selectedLabel }}</span>
        </CmwSelect> -->
      </div>
      <div class="cmw-hidden cmw-items-center cmw-gap-2 lg:cmw-flex">
        <div
          v-for="layout in availableLayouts"
          :key="layout"
          class="cmw-relative"
        >
          <input
            :id="layout"
            v-model="selectedLayout"
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
        class="cmw-p-4"
      >
        <template v-if="selectedLayout === 'list' && isDesktop">
          <div
            v-for="product in customerProducts"
            :key="product.id"
            class="cmw-mb-4"
          >
            <ProductBoxHorizontal :product="product" :is-desktop="isDesktop" />
          </div>
        </template>
        <template v-else>
          <div
            class="cmw-grid cmw-grid-cols-1 cmw-gap-4 phone-md:(cmw-grid-cols-2 cmw-gap-2)
          sm:(cmw-grid-cols-2 cmw-gap-3) lg:(cmw-grid-cols-3 cmw-gap-4) desktop-wide:cmw-grid-cols-4"
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

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import chevronRightIcon from 'assets/svg/chevron-right.svg'
import { useCustomer } from '@/store/customer'
import type { ICollection } from '~/types/collection'
import { initialCollectionData } from '~/types/collection'
import type { IProductMapped } from '~/types/product'
import { sortArrayByName, sortArrayByNumber } from '~/utilities/arrays'
import { useFilters } from '~/store/filters'

export default defineComponent({
  setup() {
    const { params, i18n, $cmwGtmUtils } = useContext()
    const customerStore = useCustomer()
    const { getCustomerType } = storeToRefs(customerStore)

    const sorting = ref(false)
    const filtersStore = useFilters()
    const { selectedLayout, availableLayouts } = storeToRefs(filtersStore)

    const collectionRef = ref<ICollection>(initialCollectionData)
    const sorted = ref<IProductMapped[]>([])
    const selectedFilter = ref(JSON.stringify({ order: 'title', sort: 'asc' }))
    const periods = ref([
      {
        label: i18n.t('common.filters.sort.lowestPrice'),
        value: JSON.stringify({ order: 'sortPrice', sort: 'asc' }),
      },
      {
        label: i18n.t('common.filters.sort.highestPrice'),
        value: JSON.stringify({ order: 'sortPrice', sort: 'desc' }),
      },
      {
        label: i18n.t('common.filters.sort.nameAsc'),
        value: JSON.stringify({ order: 'title', sort: 'asc' }),
      },
      {
        label: i18n.t('common.filters.sort.nameDesc'),
        value: JSON.stringify({ order: 'title', sort: 'desc' }),
      },
    ])

    const selectedLabel = computed(() => periods.value.find(period => period.value === selectedFilter.value)?.label)

    const handleUpdateValue = (value: string) => {
      selectedFilter.value = value

      const { order, sort } = JSON.parse(value)
      sorted.value = (['price', 'sortPrice'].includes(order))
        ? sortArrayByNumber(sorted.value, order, sort)
        : sortArrayByName(sorted.value, order, sort)

      sorted.value = sortArrayByNumber(sorted.value, 'availableForSale', 'desc')

      sorting.value = false
    }

    useFetch(async ({ $cmwStore, $cmwRepo }) => {
      await $cmwRepo.products.getCollectionsByHandle({ handle: params.value.handle })
        .then((collection: ICollection) => {
          collectionRef.value = collection

          sorted.value = collection.products
          sorted.value = sorted.value.map(p => ({
            ...p,
            sortPrice: Number(p.priceLists[$cmwStore.settings.salesChannel][getCustomerType.value]),
          }))
          sorted.value = sortArrayByName(sorted.value, 'title', 'asc')
          sorted.value = sortArrayByNumber(sorted.value, 'availableForSale', 'desc')
        })
    })

    const handleUpdateTrigger = () => sorting.value = !sorting.value

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    return {
      availableLayouts,
      chevronRightIcon,
      collectionRef,
      handleUpdateTrigger,
      handleUpdateValue,
      params,
      periods,
      selectedFilter,
      selectedLabel,
      selectedLayout,
      sorted,
      sorting,
    }
  },
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto py-4 px-4">
    <nav class="flex items-center gap-2 text-sm pt-1.875rem mt-2 mb-6 px-4">
      <NuxtLink
        class="text-primary-400"
        :to="localePath('/')"
      >
        {{ $t('home') }}
      </NuxtLink>
      <VueSvgIcon
        :data="chevronRightIcon"
        width="12"
        height="12"
      />
      <span class="text-gray-dark">{{ params.handle }}</span>
    </nav>

    <h1>{{ collectionRef.title }}</h1>
    <img v-if="collectionRef.image" :src="collectionRef.image.url" :alt="collectionRef.image.altText">
    <div v-html="collectionRef.descriptionHtml" />

    <div v-if="!!sorted?.length">
      <div class="hidden items-center gap-2 lg:flex">
        <!-- Todo: Implement availableLayouts when we can use the newest product box -->
        <!--        <div
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
        </div> -->
        <div class="p-4 ml-auto">
          <CmwDropdown
            key="sort-by"
            size="sm"
            :active="sorting"
            @update-trigger="handleUpdateTrigger"
          >
            <template #default>
              <span><strong>{{ $t('common.filters.sort.prefix') }}</strong>{{ selectedLabel }}</span>
            </template>
            <template #children>
              <CmwSelect
                :options="periods"
                @update-value="handleUpdateValue"
              />
            </template>
          </CmwDropdown>
        </div>
      </div>
      <div
        class="products-grid"
      >
        <!-- Todo: Implement horizontal product box <ProductCardHorizontal :product="product" /> -->
        <ProductBoxVertical v-for="product in sorted" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

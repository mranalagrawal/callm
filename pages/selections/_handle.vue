<script>
import { computed, onMounted, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useCustomer } from '@/store/customer'
import { getMappedProducts } from '~/utilities/mappedProduct'
import { sortArrayByName, sortArrayByNumber } from '~/utilities/arrays'
import getCollection from '~/graphql/queries/getCollection'
import { useFilters } from '~/store/filters'

export default {
  layout({ $config }) {
    return $config.STORE
  },
  setup() {
    const { params, i18n, $cmwGtmUtils } = useContext()
    const customerStore = useCustomer()
    const { getCustomerType } = storeToRefs(customerStore)

    const sorting = ref(false)
    const filtersStore = useFilters()
    const { selectedLayout, availableLayouts } = storeToRefs(filtersStore)

    const collectionRef = ref({
      descriptionHtml: '',
      image: {
        altText: '',
        height: '',
        id: '',
        url: '',
        width: '',
      },
      title: '',
      products: {
        nodes: [],
      },
    })
    const sorted = ref([])
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

    const selectedLabel = computed(() => periods.value.find(period => period.value === selectedFilter.value).label)
    const handleUpdateValue = (value) => {
      selectedFilter.value = value

      const { order, sort } = JSON.parse(value)
      sorted.value = (['price', 'sortPrice'].includes(order))
        ? sortArrayByNumber(sorted.value, order, sort)
        : sortArrayByName(sorted.value, order, sort)

      sorting.value = false
    }

    const { fetch } = useFetch(async ({ $config, $graphql, $handleApiErrors }) => {
      await $graphql.default.request(getCollection, {
        lang: i18n.locale.toUpperCase(),
        handle: params.value.handle,
      })
        .then(({ collection }) => {
          collectionRef.value = collection

          sorted.value = getMappedProducts({
            arr: collection.products.nodes,
            lang: i18n.locale,
            store: $config.STORE,
            sale_channel: $config.SALECHANNEL,
          })
          sorted.value = sorted.value.map(p => ({
            ...p,
            sortPrice: Number(p.priceLists[$config.SALECHANNEL][getCustomerType.value]),
          }))
          sorted.value = sortArrayByName(sorted.value, 'title', 'asc')
        })
        .catch((err) => {
          $handleApiErrors(`Catch getting getCollection Products from Shopify: ${err}`)
        })
    })

    const handleUpdateTrigger = () => sorting.value = !sorting.value

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    return {
      sorting,
      fetch,
      selectedFilter,
      selectedLabel,
      periods,
      params,
      collectionRef,
      sorted,
      selectedLayout,
      availableLayouts,
      handleUpdateTrigger,
      handleUpdateValue,
    }
  },
}
</script>

<template>
  <div class="cmw-max-w-screen-xl cmw-mx-auto cmw-py-4 cmw-px-4">
    <nav class="cmw-flex cmw-items-center cmw-gap-2 cmw-text-sm cmw-pt-1.875rem cmw-mt-2 cmw-mb-6 cmw-px-4">
      <NuxtLink
        class="cmw-text-primary-400"
        :to="localePath('/')"
      >
        {{ $t('home') }}
      </NuxtLink>
      <VueSvgIcon
        :data="require(`@/assets/svg/chevron-right.svg`)"
        width="12"
        height="12"
      />
      <span class="cmw-text-gray-dark">{{ params.handle }}</span>
    </nav>

    <h1>{{ collectionRef.title }}</h1>
    <img v-if="collectionRef.image" :src="collectionRef.image.url" :alt="collectionRef.image.altText">
    <div v-html="collectionRef.descriptionHtml" />

    <div v-if="!!sorted.length">
      <div class="cmw-hidden cmw-items-center cmw-gap-2 lg:cmw-flex">
        <!-- Todo: Implement availableLayouts when we can use the newest product box -->
        <!--        <div
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
        </div> -->
        <div class="cmw-p-4 cmw-ml-auto">
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
        class="cmw-grid cmw-grid-cols-1 cmw-gap-4 phone-md:(cmw-grid-cols-2 cmw-gap-2)
         sm:(cmw-grid-cols-2 cmw-gap-3) lg:(cmw-grid-cols-3 cmw-gap-4) desktop-wide:cmw-grid-cols-4"
      >
        <!-- Todo: Implement horizontal product box <ProductCardHorizontal :product="product" /> -->
        <ProductBoxVertical v-for="product in sorted" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref, useContext, useFetch, watch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useFilters } from '~/store/filters'
import { useCustomer } from '~/store/customer'
import { useCustomerWishlist } from '~/store/customerWishlist'
import { chunkArray } from '~/utilities/arrays'
import type { IProductMapped } from '~/types/product'
import closeIcon from '~/assets/svg/close.svg'

export default {
  props: {
    isDesktop: Boolean,
  },
  setup() {
    const { $cmwGtmUtils, $productMapping, $cmwRepo, i18n } = useContext()
    const customerWishlistStore = useCustomerWishlist()
    const customerStore = useCustomer()
    const { customerWishlistProducts } = storeToRefs(customerStore)
    const { getWishlistProducts } = customerWishlistStore
    const { wishlistArr, customer, customerId } = storeToRefs(useCustomer())
    const { selectedLayout, availableLayouts } = storeToRefs(useFilters())
    const { wishlistProducts, filters, categoriesFilters, subcategoriesFilters, wineListsFilters } = storeToRefs(customerWishlistStore)

    const isReady = ref(false)
    const selectedCategory = ref('')
    const selectedSubcategory = ref('')
    const selectedWineList = ref('')

    const queryParams = ref({
      shopifyCustomerId: customerId.value,
      sortingDirection: 'ASC',
    })
    // This must be a ref that it will be updated by anytime we need to update the query
    const queryUrl = ref(`/wishlists/full?shopifyCustomerId=${customerId.value}&sortingDirection=ASC&sortingField=createdat`)
    const wishlistOtherProducts = ref<IProductMapped[]>([])

    const chunkSize = 12
    const wishListChunks = chunkArray(wishlistArr.value, chunkSize)
    const nextChunkId = ref(1)
    const manualLazyLoading = ref(false)

    // first visible chunk
    const { fetch } = useFetch(async ({ $cmw, $cookieHelpers }) => {
      const customerAccessToken = $cookieHelpers.getToken()
      $cmw.setHeader('X-Shopify-Customer-Access-Token', customerAccessToken)
      $cmw.setHeader('X-Cmw-Locale', i18n.locale)

      if (customerId.value) {
        await $cmw.$get(queryUrl.value)
          .then(({ data, responseCode }: any) => {
            const { elements, filters } = data

            if (responseCode === 0) {
              customerStore.$patch({
                customerWishlistProducts: elements,
              })

              customerWishlistStore.$patch({
                filters,
                wishlistProducts: elements,
              })
            }
          })
      }

      if (wishListChunks.length > 0) {
        await getWishlistProducts({
          query: `${wishListChunks[0].join(' OR ')}`,
          first: wishListChunks[0].length,
        })
      }
    })

    const removeFilterFromQuery = (item: string) => {
      // eslint-disable-next-line no-console
      console.log('HEY', item)
    }

    const resetFilter = () => {
      // eslint-disable-next-line no-console
      console.log('HEY')
    }

    const activeFilters = computed(() => [])

    watch(() => queryUrl.value, () => fetch())
    const customerProducts = computed(() => {
      // Note: there's an annoying warning but the page renders perfectly, https://github.com/nuxt-community/composition-api/issues/19
      if (!wishlistProducts.value || !wishlistProducts.value.length) { return [] }

      return $productMapping.fromShopify(wishlistProducts.value)
    })

    const findRelatedVintage = (productId: string) => {
      if (!customerWishlistProducts?.value?.length) { return null }
      // @ts-expect-error TODO: type this
      const element = customerWishlistProducts.value?.find(product => product.productFeId === productId)
      // @ts-expect-error TODO: type this
      return element?.relatedVintage || null
    }

    const finalProducts = computed(() => [...customerProducts.value, ...wishlistOtherProducts.value].slice(0, nextChunkId.value * chunkSize))

    const trigger = ref(null) // used to get the ref of div that manage the intersection

    const lazyLoadChunkOfProducts = async () => {
      if (nextChunkId.value < wishListChunks.length && nextChunkId.value in wishListChunks) {
        // console.log(`start fetching ${nextChunkId.value} chunk of product...`)
        const nextChunk = wishListChunks[nextChunkId.value]
        const nextProducts = await $cmwRepo.products.getAll({
          query: `${nextChunk.join(' OR ')}`,
          first: chunkSize,
        })
        const mappedProducts = $productMapping.fromShopify(nextProducts.products.nodes)
        wishlistOtherProducts.value = [...wishlistOtherProducts.value, ...mappedProducts]
        nextChunkId.value++
      }
    }

    const handleIntersect = (entries: any[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { lazyLoadChunkOfProducts() }
      })
    }

    const createObserver = () => {
      scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      const observer = new IntersectionObserver(handleIntersect, {
        root: null,
        threshold: 0,
      })
      trigger.value && observer.observe(trigger.value)
    }

    onMounted(() => {
      // resetLazyLoad()
      process.browser && $cmwGtmUtils.pushPage('page')
      if (window.IntersectionObserver) {
        createObserver()
      } else {
        manualLazyLoading.value = true
      }
    })

    const showMore = computed(() => {
      return manualLazyLoading.value && (nextChunkId.value < wishListChunks.length && nextChunkId.value in wishListChunks)
    })

    const handleUpdateTrigger = (key: string) => {
      selectedCategory.value = selectedCategory.value === key ? '' : key
    }

    /* This function is used to update the queryUrl and trigger the fetch, only run on browser */
    const handleUpdateQuery = (jsonString: string) => {
      selectedCategory.value = '' // Reset the selected category

      // console.log(jsonString)
      // console.log(JSON.parse(jsonString))
      queryParams.value = ({
        ...queryParams.value,
        ...JSON.parse(jsonString),
      })

      // Construct updated query parameters string
      const updatedSearchParams = new URLSearchParams()
      Object.entries(queryParams.value).forEach(([key, value]) => {
        updatedSearchParams.set(key, value)
      })

      // Construct the updated query URL by combining base URL with updated query parameters
      queryUrl.value = `/wishlists/full?${updatedSearchParams.toString()}`
    }

    return {
      activeFilters,
      availableLayouts,
      categoriesFilters,
      closeIcon,
      customer,
      customerProducts,
      filters,
      finalProducts,
      findRelatedVintage,
      handleUpdateQuery,
      handleUpdateTrigger,
      isReady,
      lazyLoadChunkOfProducts,
      removeFilterFromQuery,
      resetFilter,
      selectedCategory,
      selectedLayout,
      selectedSubcategory,
      selectedwineList: selectedWineList,
      showMore,
      subcategoriesFilters,
      trigger,
      wineListsFilters,
      wishlistArr,
      wishlistProducts,
    }
  },
}
</script>

<template>
  <div>
    <!-- Todo: Remove this v-if="isReady" when we complete the implementation -->
    <div
      v-if="isReady"
      class="grid grid-cols-[auto_200px] items-start border-y border-gray-light py-1 m-4 transition-all"
    >
      <div class="flex flex-wrap min-h-[42px]">
        <CmwDropdown
          v-if="!!categoriesFilters.length"
          key="categories"
          size="sm"
          :active="selectedCategory === 'categories'"
          @update-trigger="handleUpdateTrigger"
        >
          <template #default>
            <span>{{ $t('common.filters.category') }}</span>
          </template>
          <template #children>
            <CmwSelect :options="categoriesFilters" @update-value="handleUpdateQuery" />
          </template>
        </CmwDropdown>
        <CmwDropdown
          v-if="!!subcategoriesFilters.length"
          key="subcategories"
          size="sm"
          :active="selectedCategory === 'subcategories'"
          @update-trigger="handleUpdateTrigger"
        >
          <template #default>
            <span>{{ $t('common.filters.subcategory') }}</span>
          </template>
          <template #children>
            <!-- Todo: Update query -->
            <CmwSelect :options="subcategoriesFilters" @update-value="handleUpdateQuery" />
          </template>
        </CmwDropdown>
        <CmwDropdown
          v-if="!!wineListsFilters.length"
          key="wineList"
          size="sm"
          :active="selectedCategory === 'wineList'"
          @update-trigger="handleUpdateTrigger"
        >
          <template #default>
            <span>{{ $t('common.filters.wineList') }}</span>
          </template>
          <template #children>
            <!-- Todo: Update query -->
            <CmwSelect :options="wineListsFilters" @update-value="handleUpdateQuery" />
          </template>
        </CmwDropdown>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <div>
        <div
          v-if="activeFilters.length" class="my-4 flex gap-2"
        >
          <CmwChip
            v-for="item in activeFilters" :key="item" size="xs"
            :label="$t(`common.features.${item}`)" :on-delete="() => removeFilterFromQuery(item)"
          />
        </div>
      </div>
      <div v-if="activeFilters.length">
        <CmwButton
          variant="text"
          size="sm"
          class=""
          @click.native="resetFilter"
        >
          <span class="text-body flex items-center gap-1">
            <VueSvgIcon :data="closeIcon" width="14" height="14" />
            {{ $t('search.removeAll') }}</span>
        </CmwButton>
      </div>
    </div>
    <div class="c-filterBar flex items-center justify-between px-4">
      <div>
        <!-- Todo: Implement this later -->
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
    <div v-else>
      <div
        v-if="!!customerProducts.length"
        class="p-4"
      >
        <template v-if="selectedLayout === 'list' && isDesktop">
          <div
            v-for="product in finalProducts"
            :key="product.id"
            class="mb-4"
          >
            <ProductBoxHorizontal :product="product" :is-desktop="isDesktop" :related-vintage="findRelatedVintage(product.id)" />
          </div>
        </template>
        <template v-else>
          <div
            class="products-grid"
          >
            <ProductBoxVertical
              v-for="product in finalProducts"
              :key="product.id"
              :product="product"
              :is-desktop="isDesktop"
              :related-vintage="findRelatedVintage(product.id)"
            />
          </div>
        </template>
      </div>
      <div v-else>
        <p class="lead px-4">
          {{ $t("profile.noFavourite") }}
        </p>
      </div>
    </div>
    <div ref="trigger" class="w-full h-4 text-transparent">
      <!-- Note: lazy load trigger, can't hide this because it loses the observer, v-if="limit < data.length" -->
      lazy-loading-trigger
    </div>
    <div v-if="showMore" class="flex items-center">
      <button class="mx-auto btn-text text-sm uppercase" @click="lazyLoadChunkOfProducts">
        Mostra Altri
      </button>
    </div>
  </div>
</template>

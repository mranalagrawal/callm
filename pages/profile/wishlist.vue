<script lang="ts">
import { computed, onMounted, ref, useContext, useFetch, watch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import type { IOptions } from '~/types/types'
import type { IProductMapped, IShopifyProduct } from '~/types/product'

import { chunkArray } from '~/utilities/arrays'
import closeIcon from '~/assets/svg/close.svg'
import { generateKey } from '~/utilities/strings'
import { useCustomer } from '~/store/customer'
import { useCustomerWishlist } from '~/store/customerWishlist'
import { useFilters } from '~/store/filters'

interface IQueryParams {
  categoryId?: string
  shopifyCustomerId: string
  sortingDirection: 'ASC' | 'DESC'
  sortingField?: 'createdat' | 'name' | 'new'
  subcategoryId?: string
  wineListId?: string
}

export default {
  props: {
    isDesktop: Boolean,
  },
  setup() {
    const { $cmwGtmUtils, $productMapping, $cmwRepo, i18n } = useContext()
    const customerWishlistStore = useCustomerWishlist()
    const { getWishlistProducts } = customerWishlistStore
    const { customer, customerId } = storeToRefs(useCustomer())
    const { selectedLayout, availableLayouts } = storeToRefs(useFilters())
    const {
      wishlistArr, filteredWishlistArr,
      wishlistShopifyProducts, elements,
      filters, filteredCategories, filteredSubcategories, filteredWineLists,
    } = storeToRefs(customerWishlistStore)

    const selectedCategory = ref('')
    const selectedSubcategory = ref('')
    const selectedWineList = ref('')

    const queryParams = ref<IQueryParams>({
      shopifyCustomerId: customerId.value,
      sortingDirection: 'DESC',
      sortingField: 'createdat',
    })

    const mappedFilteredCategories = computed<IOptions[]>(() => {
      if (!filteredCategories.value || !queryParams.value) {
        return []
      }

      return filteredCategories.value.map((category: IOptions) => {
        const parsedCategory = JSON.parse(category.value)

        return ({
          ...category,
          selected: parsedCategory?.categoryId === queryParams.value.categoryId,
        })
      })
    })

    const mappedFilteredSubcategories = computed<IOptions[]>(() => {
      if (!filteredSubcategories.value || !queryParams.value) {
        return []
      }

      if (!queryParams.value?.categoryId) {
        return filteredSubcategories.value.map((subCategory: IOptions) => {
          const parsedSubCategory = JSON.parse(subCategory.value)

          return ({
            ...subCategory,
            selected: parsedSubCategory?.subcategoryId === queryParams.value.subcategoryId,
          })
        })
      } else {
        const allSubcategoryFilters = filteredSubcategories.value.map((subCategory: IOptions) => {
          const parsedSubCategory = JSON.parse(subCategory.value)

          return ({
            ...subCategory,
            selected: parsedSubCategory?.subcategoryId === queryParams.value.subcategoryId,
          })
        })

        return allSubcategoryFilters.filter(subCategory => JSON.parse(subCategory.value).categoryId === queryParams.value?.categoryId)
      }
    })

    const mappedWineListsFilters = computed<IOptions[]>(() => {
      if (!filteredWineLists.value || !queryParams.value) {
        return []
      }

      return filteredWineLists.value.map((wineList: IOptions) => {
        const parsedWineList = JSON.parse(wineList.value)

        return ({
          ...wineList,
          selected: parsedWineList?.wineListId === queryParams.value.wineListId,
        })
      })
    })

    // This must be a ref that it will be updated anytime we need to update the query
    const queryUrl = ref(`/wishlists/full?shopifyCustomerId=${customerId.value}&sortingDirection=DESC&sortingField=createdat`)
    const wishlistOtherProducts = ref<IProductMapped[]>([])

    const chunkSize = 12
    const wishListChunks = computed(() => chunkArray(filteredWishlistArr.value, chunkSize))
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
              customerWishlistStore.$patch({
                filteredElements: elements,
                filters: {
                  /* Can't do anything here, filters.categoriesFilters it is */
                  categories: filters.categoriesFilters,
                  /* Can't do anything here, filters.wineListsFilters it is */
                  wineLists: filters.wineListsFilters,
                },
              })
            }
          })
      }

      if (!wishListChunks.value.length) {
        customerWishlistStore.$patch({
          wishlistShopifyProducts: [],
        })
      } else {
        await getWishlistProducts({
          query: `${wishListChunks.value[0].join(' OR ')}`,
          first: wishListChunks.value[0].length,
        })
      }
    })

    const removeFilterFromQuery = (item: string) => {
      // Construct updated query parameters string
      const updatedSearchParams = new URLSearchParams()
      Object.entries(queryParams.value).forEach(([key, value]) => {
        if (key !== item) {
          updatedSearchParams.set(key, value)
        } else {
          // Delete the specified item directly within the loop
          delete (queryParams.value as { [key: string]: any })[item]
        }
      })

      // Construct the updated query URL by combining base URL with updated query parameters
      queryUrl.value = `/wishlists/full?${updatedSearchParams.toString()}`
    }

    const resetFilter = () => {
      queryParams.value = {
        shopifyCustomerId: customerId.value,
        sortingDirection: 'DESC',
        sortingField: 'createdat',
      }

      queryUrl.value = `/wishlists/full?shopifyCustomerId=${customerId.value}&sortingDirection=ASC&sortingField=createdat`
    }

    watch([
      () => queryUrl.value,
      () => wishListChunks.value,
    ], () => {
      nextChunkId.value = 1
      wishlistOtherProducts.value = []
      fetch()
    })

    const customerProducts = computed<IProductMapped[]>(() => {
      // Note: there's an annoying warning but the page renders perfectly, https://github.com/nuxt-community/composition-api/issues/19
      if (!wishlistShopifyProducts.value.length) { return [] }

      return $productMapping.fromShopify(wishlistShopifyProducts.value.filter(Boolean) as IShopifyProduct[])
    })

    const findRelatedVintage = (productId: string) => {
      if (!elements?.value?.length) { return null }
      const element = elements.value?.find(product => product.productFeId.toString() === productId)
      return element?.relatedVintage || null
    }

    const finalProducts = computed<IProductMapped[]>(() => {
      const mergedProducts = [...customerProducts.value, ...wishlistOtherProducts.value]

      const productMap = new Map()
      mergedProducts.forEach((product) => {
        productMap.set(product.source_id.replace(/'/g, ''), product)
      })

      const orderedProducts = filteredWishlistArr.value?.map((id) => {
        const productId = id.replace(/'/g, '')
        return productMap.get(productId) || null
      })

      return orderedProducts.filter(product => product !== null).slice(0, nextChunkId.value * chunkSize)
    })

    const trigger = ref(null) // used to get the ref of div that manage the intersection

    const lazyLoadChunkOfProducts = async () => {
      if (nextChunkId.value <= wishListChunks.value.length && nextChunkId.value in wishListChunks.value) {
        // start fetching ${nextChunkId.value} chunk of product...
        const nextChunk = wishListChunks.value[nextChunkId.value]
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
      return manualLazyLoading.value && (nextChunkId.value < wishListChunks.value.length && nextChunkId.value in wishListChunks.value)
    })

    const handleUpdateTrigger = (key: string) => {
      selectedCategory.value = selectedCategory.value === key ? '' : key
    }

    /* This function is used to update the queryUrl and trigger the fetch, only run on browser */
    const handleUpdateQuery = (jsonString: string) => {
      selectedCategory.value = '' // Reset the selected category
      customerWishlistStore.$patch({
        wishlistShopifyProducts: [],
        filteredElements: [],
      })

      const parsedJson = JSON.parse(jsonString)

      if (parsedJson?.categoryId) {
        queryParams.value = ({
          shopifyCustomerId: customerId.value,
          sortingDirection: 'ASC',
          sortingField: 'createdat',
          ...JSON.parse(jsonString),
        })
      } else {
        queryParams.value = ({
          ...queryParams.value,
          ...JSON.parse(jsonString),
        })
      }

      // Construct updated query parameters string
      const updatedSearchParams = new URLSearchParams()
      Object.entries(queryParams.value).forEach(([key, value]) => {
        updatedSearchParams.set(key, value)
      })

      // Construct the updated query URL by combining base URL with updated query parameters
      queryUrl.value = `/wishlists/full?${updatedSearchParams.toString()}`
    }

    const activeFilters = computed<IOptions[]>(() => {
      const selectedCategoriesLabels = mappedFilteredCategories.value
        .filter(category => category.selected)
        .map(category => ({ label: category.label, value: 'categoryId' }))

      const selectedSubCategoriesLabels = mappedFilteredSubcategories.value
        .filter(subCategory => subCategory.selected)
        .map(subCategory => ({ label: subCategory.label, value: 'subcategoryId' }))

      const selectedWineListsLabels = mappedWineListsFilters.value
        .filter(wineList => wineList.selected)
        .map(wineList => ({ label: wineList.label, value: 'wineListId' }))

      return [...selectedCategoriesLabels, ...selectedSubCategoriesLabels, ...selectedWineListsLabels]
    })

    const sorting = ref(false)
    const handleUpdateSortValue = (val: string) => {
      queryParams.value = ({
        ...queryParams.value,
        ...JSON.parse(val),
      })
      sorting.value = false

      // Construct updated query parameters string
      const updatedSearchParams = new URLSearchParams()
      Object.entries(queryParams.value).forEach(([key, value]) => {
        updatedSearchParams.set(key, value)
      })

      // Construct the updated query URL by combining base URL with updated query parameters
      queryUrl.value = `/wishlists/full?${updatedSearchParams.toString()}`
    }

    const handleUpdateSortTrigger = () => {
      sorting.value = !sorting.value
    }

    return {
      activeFilters,
      availableLayouts,
      closeIcon,
      customer,
      customerProducts,
      elements,
      filteredCategories,
      filteredSubcategories,
      filteredWineLists,
      filteredWishlistArr,
      filters,
      finalProducts,
      findRelatedVintage,
      handleUpdateQuery,
      handleUpdateSortTrigger,
      handleUpdateSortValue,
      handleUpdateTrigger,
      lazyLoadChunkOfProducts,
      mappedFilteredCategories,
      mappedFilteredSubcategories,
      mappedWineListsFilters,
      queryParams,
      removeFilterFromQuery,
      resetFilter,
      selectedCategory,
      selectedLayout,
      selectedSubcategory,
      selectedWineList,
      showMore,
      sorting,
      trigger,
      wishListChunks,
      wishlistArr,
      wishlistOtherProducts,
      wishlistShopifyProducts,
    }
  },
  methods: { generateKey },
}
</script>

<template>
  <div>
    <div class="flex flex-wrap min-h-[42px] border-y border-gray-light py-1 m-4">
      <CmwDropdown
        v-if="!!mappedFilteredCategories.length"
        key="categories"
        size="sm"
        :active="selectedCategory === 'categories'"
        @update-trigger="handleUpdateTrigger"
      >
        <template #default>
          <span>{{ $t('common.filters.category') }}</span>
        </template>
        <template #children>
          <CmwSelect :options="mappedFilteredCategories" @update-value="handleUpdateQuery" />
        </template>
      </CmwDropdown>
      <CmwDropdown
        v-if="!!mappedFilteredSubcategories.length"
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
          <CmwSelect :options="mappedFilteredSubcategories" @update-value="handleUpdateQuery" />
        </template>
      </CmwDropdown>
      <CmwDropdown
        v-if="!!mappedWineListsFilters.length"
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
          <CmwSelect :options="mappedWineListsFilters" @update-value="handleUpdateQuery" />
        </template>
      </CmwDropdown>
    </div>
    <div class="flex justify-between items-center mx-4">
      <div v-if="activeFilters.length" class="flex gap-2">
        <CmwChip
          v-for="({ label, value }) in activeFilters" :key="generateKey(`${label}`)" size="xs"
          :label="label" :on-delete="() => removeFilterFromQuery(value)"
        />
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
    <div class="flex gap-2 items-center justify-between mb-8 mx-4">
      <div v-if="$fetchState.pending">
        {{ $t("calculating") }}
      </div>
      <div v-else>
        <strong>{{ filteredWishlistArr.length }}</strong>
        <span>{{ $tc('search.results', filteredWishlistArr.length) }}</span>
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
      <div>
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
            <!-- Todo: Can we align the object keys? sometimes is field and others sortingField, ecc -->
            <CmwSelect
              position="right"
              :options="[{
                           label: $t('common.filters.sort.nameAsc'),
                           value: JSON.stringify({ sortingField: 'name', sortingDirection: 'ASC' }),
                         },
                         {
                           label: $t('common.filters.sort.nameDesc'),
                           value: JSON.stringify({ sortingField: 'name', sortingDirection: 'DESC' }),
                         },
                         {
                           label: $t('common.filters.sort.recent.most'),
                           value: JSON.stringify({ sortingField: 'createdat', sortingDirection: 'ASC' }),
                         },
                         {
                           label: $t('common.filters.sort.recent.least'),
                           value: JSON.stringify({ sortingField: 'createdat', sortingDirection: 'DESC' }),
                         },
                         {
                           label: $t('common.filters.sort.novelty'),
                           value: JSON.stringify({ sortingField: 'new', sortingDirection: 'DESC' }),
                         },
              ]"
              @update-value="handleUpdateSortValue"
            />
          </template>
        </CmwDropdown>
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
        <template v-if="selectedLayout === 'list'">
          <div
            v-for="product in finalProducts"
            :key="product.id"
            class="mb-4"
          >
            <ProductBoxHorizontal :product="product" :related-vintage="findRelatedVintage(product.id.toString())" />
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
              :related-vintage="findRelatedVintage(product.id.toString())"
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

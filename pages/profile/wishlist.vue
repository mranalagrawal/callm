<script lang="ts">
import { computed, onMounted, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useFilters } from '~/store/filters'
import { useCustomer } from '~/store/customer'
import { useCustomerWishlist } from '~/store/customerWishlist'
import { chunkArray } from '~/utilities/arrays'
import type { IProductMapped } from '~/types/product'

export default {
  props: {
    isDesktop: Boolean,
  },
  setup() {
    const customerStore = useCustomer()
    const customerWishlist = useCustomerWishlist()
    const { wishlistArr } = storeToRefs(customerStore)
    const { wishlistProducts } = storeToRefs(customerWishlist)
    const { $cmwGtmUtils, $productMapping, $cmwRepo } = useContext()

    const wishlistOtherProducts = ref<IProductMapped[]>([])

    const filtersStore = useFilters()
    const { selectedLayout, availableLayouts } = storeToRefs(filtersStore)

    const chunkSize = 12
    const wishListChunks = chunkArray(wishlistArr.value, chunkSize)

    const nextChunkId = ref(1)

    // first visible chunk
    useFetch(async () => {
      if (wishListChunks.length > 0) {
        await customerWishlist.getWishlistProducts({
          query: `tag:active AND (${wishListChunks[0].join(' OR ')})`,
          first: wishListChunks[0].length,
        })
      }
    })

    const customerProducts = computed(() => {
      // Note: there's an annoying warning but the page renders perfectly, https://github.com/nuxt-community/composition-api/issues/19
      if (!wishlistProducts.value || !wishlistProducts.value.length) { return [] }

      return $productMapping.fromShopify(wishlistProducts.value)
    })

    const finalProducts = computed(() => [...customerProducts.value, ...wishlistOtherProducts.value].slice(0, nextChunkId.value * chunkSize))

    const trigger = ref(null) // used to get the ref of div that manage the intersection

    const lazyLoadChunkOfProducts = async () => {
      if (nextChunkId.value < wishListChunks.length && nextChunkId.value in wishListChunks) {
        console.log(`start fetching ${nextChunkId.value} chunk of product...`)
        const nextChunk = wishListChunks[nextChunkId.value]
        const nextProducts = await $cmwRepo.products.getAll({
          query: `tag:active AND (${nextChunk.join(' OR ')})`,
          first: chunkSize,
        })
        const mappedProducts = $productMapping.fromShopify(nextProducts.products.nodes)
        wishlistOtherProducts.value = [...wishlistOtherProducts.value, ...mappedProducts]
        nextChunkId.value++
      }
    }

    const loadAllOthersProducts = async () => {
      // the promise all version
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
        loadAllOthersProducts()
      }
    })

    return {
      wishlistProducts,
      wishlistArr,
      customerProducts,
      availableLayouts,
      selectedLayout,
      wishlistOtherProducts,
      finalProducts,
      trigger,
    }
  },
}
</script>

<template>
  <div>
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
            <ProductBoxHorizontal :product="product" :is-desktop="isDesktop" />
          </div>
        </template>
        <template v-else>
          <div
            class="products-grid"
          >
            <div
              v-for="product in finalProducts"
              :key="product.id"
            >
              <ProductBoxVertical
                :product="product"
                :is-desktop="isDesktop"
              />
            </div>
          </div>
        </template>
      </div>
      <div v-else>
        <p class="lead px-4">
          {{ $t("profile.noFavourite") }}
        </p>
      </div>
    </div>
    <div ref="trigger" class="w-full h-4 text-trasparent">
      <!-- Note: lazy load trigger, can't hide this because it loses the observer, v-if="limit < data.length" -->
      lazy-loading-trigger
    </div>
  </div>
</template>

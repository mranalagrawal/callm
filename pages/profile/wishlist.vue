<script lang="ts">
import { computed, onMounted, useContext, useFetch, watch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useFilters } from '~/store/filters'
import { useCustomer } from '~/store/customer'
import { useCustomerWishlist } from '~/store/customerWishlist'

export default {
  props: {
    isDesktop: Boolean,
  },
  setup() {
    const customerStore = useCustomer()
    const customerWishlist = useCustomerWishlist()
    const { wishlistArr } = storeToRefs(customerStore)
    const { wishlistProducts } = storeToRefs(customerWishlist)
    const { $cmwGtmUtils, $productMapping } = useContext()

    const filtersStore = useFilters()
    const { selectedLayout, availableLayouts } = storeToRefs(filtersStore)

    const query = computed(() => wishlistArr.value.join(' OR '))

    const { fetch } = useFetch(async () => {
      if (query.value) {
        await customerWishlist.getWishlistProducts({
          query: `tag:active AND (${query.value})`,
          first: Number(wishlistArr.value.length) > 200 ? 200 : Number(wishlistArr.value.length),
        })
      }
    })

    watch(() => query.value, () => fetch())

    const customerProducts = computed(() => {
      // Note: there's an annoying warning but the page renders perfectly, https://github.com/nuxt-community/composition-api/issues/19
      if (!wishlistProducts.value || !wishlistProducts.value.length) { return [] }

      return $productMapping.fromShopify(wishlistProducts.value)
    })

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    return {
      wishlistProducts,
      wishlistArr,
      customerProducts,
      availableLayouts,
      selectedLayout,
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
            v-for="product in customerProducts"
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
            <ProductBoxVertical
              v-for="product in customerProducts"
              :key="product.shopify_product_id"
              :product="product"
              :is-desktop="isDesktop"
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
  </div>
</template>

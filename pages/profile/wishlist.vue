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
      if (query.value)
        await customerWishlist.getWishlistProducts({ query: `tag:${query.value}`, first: Number(wishlistArr.value.length) })
    })

    watch(() => query.value, () => fetch())

    const customerProducts = computed(() => {
      // Note: there's an annoying warning but the page renders perfectly, https://github.com/nuxt-community/composition-api/issues/19
      if (!wishlistProducts.value || !wishlistProducts.value.length)
        return []

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
    <div class="c-filterBar cmw-flex cmw-items-center cmw-justify-between cmw-px-4">
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
              :key="product.shopify_product_id"
              :product="product"
              :is-desktop="isDesktop"
            />
          </div>
        </template>
      </div>
      <div v-else>
        <p class="lead cmw-px-4">
          {{ $t("profile.noFavourite") }}
        </p>
      </div>
    </div>
  </div>
</template>

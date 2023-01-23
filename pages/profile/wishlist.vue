<script>
import { computed, useFetch, watch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
// import getProducts from '~/graphql/queries/getProducts'
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

    const filtersStore = useFilters()
    const { selectedLayout, availableLayouts } = storeToRefs(filtersStore)

    const query = computed(() => wishlistArr.value.join(' OR '))

    const { fetch } = useFetch(async () => {
      await customerWishlist.getWishlistProducts(`tag:${query.value}`)
    })

    watch(() => query.value, () => fetch())

    const customerProducts = computed(() => {
      // Note: there's an annoying warning but the page renders perfectly, https://github.com/nuxt-community/composition-api/issues/19
      // on Nuxt 3 we will get nodes directly
      if (!wishlistProducts.value || !wishlistProducts.value.edges)
        return []

      return wishlistProducts.value.edges
        .map((el) => {
          const { __typename, ...rest } = el.node.variants.edges[0].node
          return (rest)
        }) || []
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
          <div class="cmw-grid cmw-grid-cols-1 cmw-gap-6 phone-md:cmw-grid-cols-2 sm:cmw-grid-cols-3 lg:cmw-grid-cols-4 ">
            <ProductBoxVertical
              v-for="product in customerProducts"
              :key="product.id"
              :product="product"
              :is-desktop="isDesktop"
            />
          </div>
        </template>
      </div>
      <div v-else>
        <p class="lead">
          {{ $t("profile.noFavourite") }}
        </p>
      </div>
    </div>
  </div>
</template>

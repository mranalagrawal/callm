<script lang="ts">
import { computed, defineComponent, ref, toRefs, useContext, useFetch, watch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'
import { useRecentProductsStore } from '~/store/recent'

import getProductRecommendations from '@/graphql/queries/getProductRecommendations.graphql'
import type { IProductMapped, IShopifyProduct } from '~/types/product'

export default defineComponent({
  props: ['id'],
  setup(props: any) {
    const { i18n, $graphql } = useContext()
    const { getCustomerType } = storeToRefs(useCustomer())
    const { cart, shippingThresholdHasBeenReached } = storeToRefs(useCart())
    const { recentProducts } = storeToRefs(useRecentProductsStore())
    const productsRef = ref<IProductMapped[]>([])
    const { id: idRef } = toRefs(props)

    const query = computed(() => `tag:active AND ${recentProducts.value.join(' OR ')}`)

    const { fetch } = useFetch(async ({ $cmwRepo, $productMapping }) => {
      if (!idRef.value) { return }

      const promises = [
        $cmwRepo.products.getAllV2({
          first: recentProducts.value?.length || 1,
          query: query.value,
        }),
        $graphql.default.request(getProductRecommendations, {
          lang: i18n.locale.toUpperCase(),
          productId: idRef.value,
          intent: 'RELATED',
        }),
      ]

      await Promise.all(promises)
        .then(([recentProductsResult, productRecommendationsResult]) => {
          let shopifyProducts: IShopifyProduct[] = []

          if (recentProductsResult.length) {
            shopifyProducts = [
              ...shopifyProducts,
              ...recentProductsResult,
            ]
          }

          if (productRecommendationsResult.productRecommendations.length) {
            shopifyProducts = [
              ...shopifyProducts,
              ...productRecommendationsResult.productRecommendations,
            ]
          }

          productsRef.value = $productMapping.fromShopify(shopifyProducts)
          productsRef.value = productsRef.value.filter(p => !!p.availableForSale)

          // Remove items from productsRef that are already in the cart
          const cartIds = cart.value.lines.map(l => l.merchandise.id)
          productsRef.value = productsRef.value.filter(p => !cartIds.includes(p.shopify_product_variant_id))
        })
    })

    watch(() => idRef.value, () => fetch())

    return {
      cart,
      getCustomerType,
      idRef,
      productsRef,
      recentProducts,
      shippingThresholdHasBeenReached,
    }
  },
})
</script>

<template>
  <div>
    <p v-if="$fetchState.pending" class="px-4">
      {{ $t("loading") }}
    </p>
    <template v-else>
      <CarouselProducts
        v-if="!!productsRef.length" :products="productsRef"
        :title="shippingThresholdHasBeenReached(getCustomerType)
          ? $t('common.carousel.thresholdReached')
          : $t('common.carousel.thresholdNotReached')"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, ref, useContext, useFetch, watch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useRecentProductsStore } from '@/store/recent'

export default {
  setup() {
    const recentProductsStore = useRecentProductsStore()
    const { recentProducts } = storeToRefs(recentProductsStore)
    const { $cmwRepo } = useContext()
    const productsRef = ref<Record<string, any>[]>([])
    const query = computed(() => `tag:${recentProducts.value.join(' OR ')}`)

    const { fetch } = useFetch(async ({ $productMapping, $handleApiErrors }) => {
      if (!recentProducts.value)
        return

      await $cmwRepo.products.getAll({
        first: recentProducts.value?.length,
        query: query.value,
      })
        .then(async ({ products = { nodes: [] } }) => {
          if (products.nodes.length)
            productsRef.value = $productMapping.fromShopify(products.nodes)
        })
        .catch((err: Error) => {
          $handleApiErrors(`Catch getting products getAll from shopify on Recent Products on Vendor Products: ${err}`)
        })
    })

    watch(() => query.value, () => fetch())

    return { productsRef }
  },
}
</script>

<template>
  <div>
    <p v-if="$fetchState.pending" class="px-4">
      {{ $t("loading") }}
    </p>
    <template v-else>
      <CarouselProducts v-if="!!productsRef.length" :products="productsRef" :title="$t('recentlySeen')" />
    </template>
  </div>
</template>

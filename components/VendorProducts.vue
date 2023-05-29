<script lang="ts">
import { computed, ref, toRefs, useFetch, watch } from '@nuxtjs/composition-api'

export default {
  props: ['vendor'],
  setup(props: any) {
    const productsRef = ref<Record<string, any>>([])
    const { vendor: vendorRef } = toRefs(props)
    const query = computed(() => `vendor:'${vendorRef.value}'`)

    const { fetch } = useFetch(async ({ $cmwRepo, $productMapping, $handleApiErrors }) => {
      if (!vendorRef.value)
        return

      await $cmwRepo.products.getAll({
        first: 12,
        query: query.value,
      })
        .then(async ({ products = { nodes: [] } }) => {
          if (products.nodes.length)
            productsRef.value = $productMapping.fromShopify(products.nodes)
        })
        .catch((err: Error) => {
          $handleApiErrors(`Catch getting products getAll from shopify: ${err}`)
        })
    })

    watch(() => query.value, () => fetch())

    return { vendorRef, productsRef }
  },
}
</script>

<template>
  <div>
    <p v-if="$fetchState.pending" class="px-4">
      {{ $t("loading") }}
    </p>
    <template v-else>
      <CarouselProducts v-if="!!productsRef.length" :products="productsRef" :title="$t('sameProducer')" />
    </template>
  </div>
</template>

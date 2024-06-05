<script lang="ts">
import { computed, ref, toRefs, useFetch, watch } from '@nuxtjs/composition-api'

import type { IProductMapped } from '~/types/product'

export default {
  props: ['vendor', 'tag', 'vendorFeId'],
  setup(props: any) {
    const productsRef = ref<IProductMapped[]>([])
    const { vendor: vendorRef, tag } = toRefs(props)
    const query = computed(() => {
      const vendorPart = `tag:active AND tag:brand_${props.vendorFeId}`
      const tagPart = tag.value ? ` AND tag_not:'${tag.value}'` : ''
      return `${vendorPart}${tagPart}`
    })

    const { fetch } = useFetch(async ({ $cmwRepo, $productMapping, $handleApiErrors }) => {
      if (!vendorRef.value) { return }

      await $cmwRepo.products.getAll({
        first: 12,
        query: query.value,
      })
        .then(async ({ products = { nodes: [] } }) => {
          if (products.nodes.length) {
            productsRef.value = $productMapping.fromShopify(products.nodes)
            productsRef.value = productsRef.value.filter(p => !!p.availableForSale)
          }
        })
        .catch((err: Error | string) => {
          if (err !== 'TypeError: Network request failed') {
            $handleApiErrors(`Catch getting products getAll from shopify: ${err}`)
          }
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
      <CarouselProducts v-if="!!productsRef.length" :products="productsRef" :title="$t('sameProducer', { name: vendor })" />
    </template>
  </div>
</template>

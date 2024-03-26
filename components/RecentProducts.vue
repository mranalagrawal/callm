<script lang="ts">
import { computed, defineComponent, ref, useContext, useFetch, watch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useRecentProductsStore } from '~/store/recent'
import type { IProductMapped } from '~/types/product'

export default defineComponent({
  props: ['currentProduct'],
  setup(props) {
    const recentProductsStore = useRecentProductsStore()
    const { recentProducts } = storeToRefs(recentProductsStore)
    const { $cmwRepo } = useContext()
    const productsRef = ref<IProductMapped[]>([])
    const filterRecentProducts = computed(() => recentProducts.value?.filter((product: any) => product !== props.currentProduct))
    const query = computed(() => `tag:active AND ${filterRecentProducts.value.join(' OR ')}`)

    const { fetch } = useFetch(async ({ $productMapping, $handleApiErrors }) => {
      if (!recentProducts.value || !filterRecentProducts.value?.length) { return }

      await $cmwRepo.products.getAll({
        first: recentProducts.value?.length,
        query: query.value,
      })
        .then(async ({ products = { nodes: [] } }) => {
          if (products.nodes.length) {
            productsRef.value = $productMapping.fromShopify(products.nodes)
            productsRef.value = productsRef.value.filter(p => !!p.availableForSale)
          }
        })
        .catch((err: Error) => {
          $handleApiErrors(`Catch getting products getAll from shopify on Recent Products on Vendor Products: ${query.value} ${err}`)
        })
    })

    watch(() => query.value, () => fetch())

    return { productsRef }
  },
})
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

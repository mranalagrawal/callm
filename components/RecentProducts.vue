<script>
import { computed, ref, useContext, useFetch, watch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useRecentProductsStore } from '@/store/recent'
import { getMappedProducts } from '@/utilities/mappedProduct'

export default {
  setup() {
    const recentProductsStore = useRecentProductsStore()
    const { recentProducts } = storeToRefs(recentProductsStore)
    const { $cmwRepo } = useContext()
    const productsRef = ref([])
    const query = computed(() => `tag:${recentProducts.value.join(' OR ')}`)

    const { fetch } = useFetch(async () => {
      if (!recentProducts.value)
        return

      await $cmwRepo.products.getAll({
        first: recentProducts.value?.length,
        query: query.value,
      })
        .then(async ({ products = { nodes: [] } }) => {
          if (products.nodes.length)
            productsRef.value = getMappedProducts(products.nodes)
        }).catch(err => console.log(err))
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

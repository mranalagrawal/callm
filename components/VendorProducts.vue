<script>
import { computed, ref, toRefs, useContext, useFetch, watch } from '@nuxtjs/composition-api'
import { getMappedProducts } from '@/utilities/mappedProduct'

export default {
  props: ['vendor'],
  setup(props) {
    const { $cmwRepo } = useContext()
    const productsRef = ref([])
    const { vendor: vendorRef } = toRefs(props)
    const query = computed(() => `vendor:'${vendorRef.value}'`)

    const { fetch } = useFetch(async () => {
      if (!vendorRef.value)
        return

      await $cmwRepo.products.getAll({
        first: 12,
        query: query.value,
      })
        .then(async ({ products = { nodes: [] } }) => {
          if (products.nodes.length)
            productsRef.value = getMappedProducts(products.nodes)
        }).catch(err => console.log(err))
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

<script lang="ts">
import { computed, ref, toRefs, useFetch, watch } from '@nuxtjs/composition-api'
import type { TISO639, TStores } from '~/config/themeConfig'
import { getMappedProducts } from '~/utilities/mappedProduct'

export default {
  props: ['vendor'],
  setup(props: any) {
    const productsRef = ref<Record<string, any>>([])
    const { vendor: vendorRef } = toRefs(props)
    const query = computed(() => `vendor:'${vendorRef.value}'`)

    const { fetch } = useFetch(async ({ $config, $i18n, $cmwRepo, handleApiErrors }) => {
      if (!vendorRef.value)
        return

      await $cmwRepo.products.getAll({
        first: 12,
        query: query.value,
      })
        .then(async ({ products = { nodes: [] } }) => {
          if (products.nodes.length) {
            productsRef.value = getMappedProducts({
              arr: products.nodes,
              lang: $i18n.locale as TISO639,
              store: $config.STORE as TStores,
            })
          }
        })
        .catch((err: Error) => {
          handleApiErrors(`Catch getting products getAll from shopify: ${err}`)
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

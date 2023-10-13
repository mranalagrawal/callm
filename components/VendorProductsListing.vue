<script lang="ts">
import { computed, inject, ref, toRefs, useFetch, watch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useFilters } from '~/store/filters'
import type { IProductMapped } from '~/types/product'
import { sortArrayByNumber } from '~/utilities/arrays'
import { escapeJsonSingleQuotes } from '~/utilities/strings'

export default {
  props: ['vendor', 'tag'],
  setup(props: any) {
    const { selectedLayout, availableLayouts } = storeToRefs(useFilters())
    const productsRef = ref<IProductMapped[]>([])
    const isDesktop = inject('isDesktop')
    const { vendor: vendorRef, tag } = toRefs(props)
    const query = computed(() => {
      const vendorPart = `tag:active AND vendor:'${escapeJsonSingleQuotes(vendorRef.value)}'`
      const tagPart = tag.value ? ` AND tag_not:'${tag.value}'` : ''
      return `${vendorPart}${tagPart}`
    })

    const { fetch } = useFetch(async ({ $cmwRepo, $productMapping, $handleApiErrors }) => {
      if (!vendorRef.value) { return }

      await $cmwRepo.products.getAll({
        first: 250,
        query: query.value,
      })
        .then(async ({ products = { nodes: [] } }) => {
          if (products.nodes.length) {
            productsRef.value = $productMapping.fromShopify(products.nodes)
            productsRef.value = sortArrayByNumber(productsRef.value, 'availableForSale', 'desc')
          }
        })
        .catch((err: Error) => {
          $handleApiErrors(`Catch getting products getAll from shopify: ${err}`)
        })
    })

    watch(() => query.value, () => fetch())

    return {
      availableLayouts,
      isDesktop,
      productsRef,
      selectedLayout,
      vendorRef,
    }
  },
}
</script>

<template>
  <div>
    <p v-if="$fetchState.pending" class="px-4">
      {{ $t("loading") }}
    </p>
    <div v-else class="px-4">
      <div class="h2 text-center py-4" v-text="$t('sameProducer')" />
      <div v-if="selectedLayout === 'list' && isDesktop">
        <div
          v-for="(result, idx) in productsRef"
          :key="result.shopify_product_id"
          class="mb-4"
        >
          <ProductBoxHorizontal :product="result" :position="idx + 1" />
        </div>
      </div>
      <div
        v-else class="grid grid-cols-1 gap-4 phone-md:(grid-cols-2 gap-2)
         sm:(grid-cols-2 gap-3) lg:(grid-cols-3 gap-4) desktop-wide:grid-cols-4"
      >
        <div
          v-for="(result, idx) in productsRef"
          :key="`desktop${result.shopify_product_id}`"
        >
          <ProductBoxVertical :product="result" :position="idx + 1" />
        </div>
      </div>
    </div>
  </div>
</template>

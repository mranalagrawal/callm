<script lang="ts">
import {
  computed,
  defineComponent,
  inject, onMounted,
  ref,
  toRefs,
  useContext,
  useFetch, useRoute,
  watch,
} from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useFilters } from '~/store/filters'

import type { IProductMapped } from '~/types/product'
import { sortArrayByNumber } from '~/utilities/arrays'

export default defineComponent({
  props: ['vendor', 'tag', 'vendorFeId'],
  setup(props: any) {
    const { $cmwStore, $cmwGtmUtils } = useContext()
    const route = useRoute()
    const { selectedLayout } = storeToRefs(useFilters())
    const productRef = ref<Maybe<IProductMapped[]>>([])
    const isDesktop = inject('isDesktop')
    const { vendor: vendorRef, tag } = toRefs(props)
    const query = computed(() => {
      const vendorPart = `tag:active AND tag:brand_${props.vendorFeId}`
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
            productRef.value = $productMapping.fromShopify(products.nodes)
            productRef.value = sortArrayByNumber(productRef.value, 'availableForSale', 'desc')
          }
        })
        .catch((err: Error) => {
          $handleApiErrors(`Catch getting products getAll from shopify: ${err}`)
        })
    })

    // TODO: Make this a helper utility and reuse on ProductResultsList
    const pushProductListView = (product: Maybe<IProductMapped[]>) => {
      if (!process.browser || !product?.length) { return }

      const impressions = product.map((product, i) => {
        // eslint-disable-next-line unused-imports/no-unused-vars
        const { quantity, ...rest } = product.gtmProductData
        return {
          ...rest,
          position: i + 1,
        }
      })

      $cmwGtmUtils.pushPage($cmwGtmUtils.getActionField(route.value), {
        event: 'productListView',
        ecommerce: {
          currencyCode: $cmwStore.isUk ? 'GBP' : 'EUR',
          actionField: { list: $cmwGtmUtils.getActionField(route.value) },
          impressions,
        },
      })
    }

    onMounted(() => {
      pushProductListView(productRef.value)
    })

    watch(() => query.value, () => {
      fetch()
    })

    watch(() => productRef.value, () => {
      pushProductListView(productRef.value)
    }, {
      immediate: true,
      deep: true,
    })

    return {
      isDesktop,
      productRef,
      pushProductListView,
      selectedLayout,
      vendorRef,
    }
  },
})
</script>

<template>
  <div>
    <p v-if="$fetchState.pending" class="px-4">
      {{ $t("loading") }}
    </p>
    <div v-else class="max-w-screen-xl mx-auto py-4 px-4 mt-4">
      <div class="h2 text-center py-4" v-text="$t('sameProducer')" />
      <div v-if="selectedLayout === 'list'">
        <div
          v-for="(result, idx) in productRef"
          :key="result.shopify_product_id"
          class="mb-4"
        >
          <ProductBoxHorizontal :product="result" :position="idx + 1" />
        </div>
      </div>
      <div
        v-else class="products-grid"
      >
        <div
          v-for="(result, idx) in productRef"
          :key="`desktop${result.shopify_product_id}`"
        >
          <ProductBoxVertical :product="result" :position="idx + 1" />
        </div>
      </div>
    </div>
  </div>
</template>

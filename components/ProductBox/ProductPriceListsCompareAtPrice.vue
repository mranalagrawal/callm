<script lang="ts">
import {
  defineComponent,
  type PropType,
} from '@nuxtjs/composition-api'
import type { IMoneyV2 } from '~/types/common-objects'

import { getLocaleFromCurrencyCode } from '~/utilities/currency'

export default defineComponent({
  name: 'ProductPriceListsCompareAtPrice',
  props: {
    compareAtPrice: {
      type: Object as PropType<IMoneyV2>,
      required: true,
    },
  },
  setup() {
    return { }
  },
  methods: {
    getLocaleFromCurrencyCode,
  },
})
</script>

<template>
  <span
    v-if="compareAtPrice?.amount && compareAtPrice?.currencyCode"
    class="line-through text-gray text-sm"
  >
    {{ $n(Number(compareAtPrice?.amount), 'currency', getLocaleFromCurrencyCode(compareAtPrice?.currencyCode)) }}
  </span>
</template>

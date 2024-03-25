<script lang="ts">
import {
  defineComponent,
  type PropType,
} from '@nuxtjs/composition-api'
import type { IMoneyV2 } from '~/types/common-objects'

import { getLocaleFromCurrencyCode } from '~/utilities/currency'

export default defineComponent({
  name: 'ProductPriceListsFinalPrice',
  props: {
    finalPrice: {
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
  <i18n-n
    v-if="finalPrice?.amount && finalPrice?.currencyCode"
    class="inline-block" :value="finalPrice.amount" :format="{ key: 'currency' }"
    :locale="getLocaleFromCurrencyCode(finalPrice.currencyCode)"
  >
    <template #currency="slotProps">
      <span class="text-sm md:text-base">{{ slotProps.currency }}</span>
    </template>
    <template #integer="slotProps">
      <span class="inline-block text-3xl leading-none cmw-font-bold m-0 md:text-5xl">{{ slotProps.integer }}</span>
    </template>
    <template #group="slotProps">
      <span class="h1 cmw-font-bold">{{ slotProps.group }}</span>
    </template>
    <template #fraction="slotProps">
      <span class="text-sm md:text-base">{{ slotProps.fraction }}</span>
    </template>
  </i18n-n>
</template>

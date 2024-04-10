<script lang="ts">
import {
  type PropType,
  defineComponent,
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
    class="c-finalPrice inline-block" :value="finalPrice.amount" :format="{ key: 'currency' }"
    :locale="getLocaleFromCurrencyCode(finalPrice.currencyCode)"
  >
    <template #currency="slotProps">
      <span class="text-sm md:text-base">{{ slotProps.currency }}</span>
    </template>
    <template #integer="slotProps">
      <span class="c-finalPrice__integer inline-block leading-none cmw-font-bold m-0">{{ slotProps.integer }}</span>
    </template>
    <template #group="slotProps">
      <span class="c-finalPrice__group cmw-font-bold">{{ slotProps.group }}</span>
    </template>
    <template #fraction="slotProps">
      <span class="text-sm md:text-base">{{ slotProps.fraction }}</span>
    </template>
  </i18n-n>
</template>

<style scoped>
.c-finalPrice__integer, .c-finalPrice__group {
  @apply text-xl;
}

@container product-box (min-width: 180px) {
  .c-finalPrice__integer, .c-finalPrice__group {
    @apply text-2xl;
  }
}

@container product-box (min-width: 250px) {
  .c-finalPrice__integer, .c-finalPrice__group {
    @apply text-5xl;
  }
}
</style>

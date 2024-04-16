<script lang="ts">
import {
  type PropType, computed, defineComponent,
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
    useFontSizeReducer: {
      type: Boolean,
    },
  },
  setup(props) {
    const priceLength = computed(() => Number(props.finalPrice.amount).toFixed(2).length)

    const priceFontSize = computed(() => ({
      '-short': (priceLength.value < 7 && props.useFontSizeReducer),
      '-long': (priceLength.value >= 7 && props.useFontSizeReducer),
      '-regular': !props.useFontSizeReducer,
    }))

    return {
      priceFontSize,
      priceLength,
    }
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
      <span
        class="c-finalPrice__integer inline-block leading-none cmw-font-bold m-0"
        :class="[priceFontSize]"
      >{{ slotProps.integer }}</span>
    </template>
    <template #group="slotProps">
      <span
        class="c-finalPrice__group cmw-font-bold"
        :class="[priceFontSize]"
      >{{ slotProps.group }}</span>
    </template>
    <template #fraction="slotProps">
      <span
        class="c-finalPrice__fraction"
        :class="[priceFontSize]"
      >{{ slotProps.fraction }}</span>
    </template>
  </i18n-n>
</template>

<style scoped>
.c-finalPrice__integer.-short, .c-finalPrice__group.-short {
  @apply text-3xl;
}

.c-finalPrice__integer.-long, .c-finalPrice__group.-long {
  @apply text-xl;
}

.c-finalPrice__integer.-regular, .c-finalPrice__group.-regular {
  @apply text-5xl;
}

.c-finalPrice__fraction.-short {
  @apply text-xs;
}

.c-finalPrice__fraction.-long {
  @apply text-xs;
}

.c-finalPrice__fraction.-regular, .c-finalPrice__fraction.-regular {
  @apply text-sm md:text-base;
}

@container product-box (min-width: 180px) {
  .c-finalPrice__integer.-short, .c-finalPrice__group.-short {
    @apply text-2xl;
  }

  .c-finalPrice__integer.-long, .c-finalPrice__group.-long {
    @apply text-2xl;
  }

  .c-finalPrice__fraction.-short {
    @apply text-base;
  }

  .c-finalPrice__fraction.-long {
    @apply text-base;
  }
}

@container product-box (min-width: 250px) {
  .c-finalPrice__integer.-short, .c-finalPrice__group.-short {
    @apply text-5xl;
  }

  .c-finalPrice__integer.-long, .c-finalPrice__group.-long {
    @apply text-5xl;
  }

  .c-finalPrice__fraction.-short {
    @apply text-lg;
  }

  .c-finalPrice__fraction.-long {
    @apply text-lg;
  }
}
</style>

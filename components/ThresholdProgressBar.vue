<script lang="ts">
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'

import { getLocaleFromCurrencyCode } from '~/utilities/currency'

export default defineComponent({
  name: 'ThresholdProgressBar',

  setup() {
    const { $cmwStore, i18n } = useContext()
    const { getCustomerType } = storeToRefs(useCustomer())
    const {
      barProgressWidth,
      shippingThresholdHasBeenReached,
      shippingThresholdRemaining,
    } = storeToRefs(useCart())

    const barProgressStyle = computed(() => `background: none repeat scroll 0 0 #2C8982; width: ${barProgressWidth.value(getCustomerType.value)}%`)

    const shippingThresholdNotReachedLabel
        = computed(() => i18n.n(
          shippingThresholdRemaining.value(getCustomerType.value),
          'currency',
          getLocaleFromCurrencyCode($cmwStore.isUk ? 'GBP' : 'EUR'),
        ).replace(/\u00A0/g, ''))

    return {
      barProgressStyle,
      getCustomerType,
      shippingThresholdHasBeenReached,
      shippingThresholdNotReachedLabel,
      shippingThresholdRemaining,
    }
  },
})
</script>

<template>
  <div>
    <div v-if="shippingThresholdHasBeenReached(getCustomerType)" class="text-sm text-secondary-400">
      {{ $t('shipping.threshold.progressBarReached') }}
    </div>
    <div v-else class="text-sm text-gray-darkest">
      <i18n
        path="shipping.threshold.remaining"
      >
        <template #amount>
          <strong class="text-base">{{ shippingThresholdNotReachedLabel }}</strong>
        </template>
      </i18n>
    </div>
    <div class="h-2 bg-gray-lightest rounded-pill overflow-hidden my-4">
      <div class="h-2 transition-progress-bar" :style="barProgressStyle" />
    </div>
  </div>
</template>

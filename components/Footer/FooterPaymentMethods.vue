<script lang="ts">
import walletIcon from 'assets/svg/wallet.svg'
import { generateKey } from '~/utilities/strings'

export default {
  props: {
    paymentMethods: {
      type: Array,
      required: true,
    },
  },
  setup() {
    return {
      walletIcon,
      generateKey,
    }
  },
}
</script>

<template>
  <div class="md:flex text-center justify-center">
    <div class="flex gap-2 items-center justify-center">
      <VueSvgIcon :data="walletIcon" color="white" width="30" height="30" />
      <span>{{ $t('footer.paymentMethods') }}</span>
    </div>
    <div
      class="grid grid-cols-3 md:grid-cols-8 justify-items-center items-center content-center px-8 py-4"
    >
      <PrismicImage
        v-for="payment in paymentMethods"
        :key="generateKey(payment.image?.url)"
        :field="payment.image"
        class="max-w-12"
      />
    </div>
  </div>
</template>

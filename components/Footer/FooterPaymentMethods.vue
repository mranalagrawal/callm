<script lang="ts">
import walletIcon from 'assets/svg/wallet.svg'
import { computed, useStore } from '@nuxtjs/composition-api'
import { generateKey } from '~/utilities/strings'

export default {
  setup() {
    const store: any = useStore()
    const paymentMethods = computed(() => store.state.footerData.paymentMethods)

    return {
      paymentMethods,
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

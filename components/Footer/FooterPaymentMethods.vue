<script lang="ts">
import { toRefs } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import walletIcon from '~/assets/svg/wallet.svg'
import { useLayout } from '~/store/layout'
import { generateKey } from '~/utilities/strings'

export default {
  name: 'FooterPaymentMethods',
  setup() {
    const { footer } = storeToRefs(useLayout())
    const { paymentMethods } = toRefs(footer.value)

    return {
      generateKey,
      paymentMethods,
      walletIcon,
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
      class="
      grid justify-items-center items-center justify-center px-8 py-4 gap-2
      grid-cols-[repeat(3,minmax(0,_48px))]
      sm:grid-cols-[repeat(4,minmax(0,_48px))]
      md:grid-cols-[repeat(8,minmax(0,_48px))]
"
    >
      <img v-for="({ url, id, altText }) in paymentMethods" :key="generateKey(id)" :src="url" :alt="altText">
    </div>
  </div>
</template>

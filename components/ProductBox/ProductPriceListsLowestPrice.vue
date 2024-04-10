<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'

import { useSplash } from '~/store/splash'

import infoIcon from '~/assets/svg/info.svg'

import type { IMoneyV2 } from '~/types/common-objects'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'

export default defineComponent({
  name: 'ProductPriceListsLowestPrice',
  props: {
    lowestPrice: {
      type: Object as PropType<IMoneyV2>,
      required: true,
    },
  },
  setup() {
    const splash = useSplash()
    const { i18n } = useContext()

    const handleClick = () => {
      splash.$patch({
        currentSplash: 'ProductLowestPriceTooltip',
        size: 'lg',
        title: i18n.t('product.lowestPriceSplashTitle'),
      })
    }

    return {
      handleClick,
      infoIcon,
    }
  },
  methods: { getLocaleFromCurrencyCode },
})
</script>

<template>
  <span v-if="lowestPrice.amount && lowestPrice.currencyCode" class="font-sans text-gray relative">
    <button class="flex items-center gap-1" @click="handleClick">
      <span class="text-xxs sm:text-xs text-left text-gray-dark">
        {{ $t('product.lowestPrice', { price: $n(Number(lowestPrice.amount), 'currency', getLocaleFromCurrencyCode(lowestPrice.currencyCode)) }) }}
      </span>
      <VueSvgIcon
        :data="infoIcon"
        width="18"
        height="18"
      />
    </button>
  </span>
</template>

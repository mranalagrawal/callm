<script lang="ts">
import { defineComponent, useRoute, watch } from '@nuxtjs/composition-api'
import { useSplash } from '~/store/splash'

export default defineComponent({
  name: 'ProductLowestPriceTooltip',
  setup() {
    const splash = useSplash()
    const route = useRoute()

    watch(
      () => route.value,
      () => { splash.$reset() },
    )

    return { splash }
  },
})
</script>

<template>
  <div class="text-sm my-4">
    <p v-html="$t('product.lowestPriceSplashText')" />
    <i18n path="product.lowestPriceSplashExtraText" tag="p">
      <template #tosUrl>
        <NuxtLink :to="localePath('/terms-of-sales')" class="text-primary-400 hover:(underline)">
          {{ $t('product.tosUrl') }}
        </NuxtLink>
      </template>
    </i18n>
  </div>
</template>

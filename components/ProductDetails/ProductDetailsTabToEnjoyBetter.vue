<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent } from '@nuxtjs/composition-api'
import type { IProductMapped } from '~/types/product'

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<IProductMapped>,
      required: false,
    },
    productDetails: {
      type: Object,
      required: false,
    },
  },
  setup() {
    return { }
  },
})
</script>

<template>
  <div class="cmw-mt-6">
    <div>
      <h2 class="" v-text="$t('product.toEnjoyBetter')" />

      <h3 class="cmw-mb-4" v-text="$t('product.temperature')" />
      <p>{{ productDetails.servingTemperature }}</p>

      <h3 class="cmw-mb-4" v-text="$t('product.whenDrink')" />
      <div class="cmw-mb-4">
        <p v-text="productDetails.drinkNotesDrinkingTitle[$i18n.locale]" />
        <p v-text="productDetails.drinkNotesServingDescription[$i18n.locale]" />
        <p v-text="productDetails.drinkNotesDrinkingLongevity[$i18n.locale]" />
      </div>

      <h3 class="cmw-mb-4" v-text=" productDetails.glassTitle[$i18n.locale]" />
      <p v-html="productDetails.glassDescription[$i18n.locale]" />
    </div>
  </div>
</template>

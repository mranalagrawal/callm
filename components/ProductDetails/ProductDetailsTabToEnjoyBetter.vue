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
      required: true,
    },
  },
  setup() {
    return { }
  },
})
</script>

<template>
  <div class="mt-6">
    <div>
      <h2 class="mb-4" v-text="$t('product.toEnjoyBetter')" />

      <div class="mb-6">
        <div v-if="productDetails.servingTemperature" class="h3" v-text="$t('product.temperature')" />
        <div>{{ productDetails.servingTemperature }}</div>
      </div>

      <div v-if="productDetails.drinkNotesServingDescription[$i18n.locale]" class="mb-6">
        <div class="h3" v-text="$t('product.whenOpen')" />
        <div v-text="productDetails.drinkNotesServingDescription[$i18n.locale]" />
      </div>

      <div v-if="productDetails.drinkNotesDrinkingTitle[$i18n.locale]" class="mb-6">
        <div class="h3" v-text="$t('product.whenDrink')" />
        <div v-text="productDetails.drinkNotesDrinkingTitle[$i18n.locale]" />
      </div>

      <div v-if="productDetails.glassTitle[$i18n.locale] || productDetails.glassDescription[$i18n.locale]" class="mb-6">
        <div class="h3" v-text="$t('product.glass')" />
        <div class="h4" v-text=" productDetails.glassTitle[$i18n.locale]" />
        <div v-html="productDetails.glassDescription[$i18n.locale]" />
      </div>

      <div v-if="productDetails.drinkNotesDrinkingLongevity[$i18n.locale]" class="mb-6">
        <div class="h3" v-text="$t('product.longevity')" />
        <div v-text="productDetails.drinkNotesDrinkingLongevity[$i18n.locale]" />
      </div>
    </div>
  </div>
</template>

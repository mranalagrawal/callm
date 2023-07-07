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
  },
})
</script>

<template>
  <div class="mt-6">
    <div class="h2">
      {{ $t('productDescriptionTab', { productTitle: product?.title }) }}
    </div>
    <div v-html="product?.descriptionHtml" />
  </div>
</template>

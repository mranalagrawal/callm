<script lang="ts">
import { defineComponent, provide } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'
import type { IProductCharacteristics } from '~/types/product'

export default defineComponent({
  props: {
    productCharacteristic: {
      type: Object as PropType<IProductCharacteristics>,
      required: true,
    },
  },
  setup(props) {
    provide('productCharacteristics', props.productCharacteristic)
    const { rarewine } = props.productCharacteristic
    return {
      rarewine,
    }
  },
})
</script>

<template>
  <div class="bg-gray-lightest rounded px-6 py-3 mx-auto">
    <h2 class="mb-5" v-text="$t('product.features')" />
    <div>
      <ProductCharacteristic characteristic="denomination" />
      <ProductCharacteristic characteristic="grapes" />
      <ProductCharacteristic characteristic="subCategory" />
      <ProductCharacteristicRegionCountry />
      <ProductCharacteristic characteristic="alcoholContent" />
      <ProductCharacteristic characteristic="size" />
      <ProductCharacteristic characteristic="vineyards" />
      <ProductCharacteristic characteristic="winemaking" />
      <ProductCharacteristic characteristic="agingDescription" />
      <ProductCharacteristic characteristic="productionPhilosophies" />
      <ProductCharacteristicNotes />
      <div v-if="rarewine">
        <div class="mb-4" v-html="$t('product.collectionBottle')" />
      </div>
    </div>
  </div>
</template>

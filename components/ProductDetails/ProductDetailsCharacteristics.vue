<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const productCharacteristic = inject('productCharacteristics') as any
    const { rarewine, alcoholContent } = productCharacteristic

    return {
      rarewine,
      alcoholContent,
    }
  },
})
</script>

<template>
  <div class="bg-gray-lightest rounded p-4">
    <h2 class="mb-5" v-text="$t('product.features')" />
    <ProductCharacteristic characteristic="denomination" />
    <ProductCharacteristic characteristic="grapes" />
    <ProductCharacteristic characteristic="subCategory" />
    <ProductCharacteristicRegionCountry />
    <ProductCharacteristic characteristic="alcoholContent" :value="alcoholContent ? `${alcoholContent} %` : undefined " />
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
</template>

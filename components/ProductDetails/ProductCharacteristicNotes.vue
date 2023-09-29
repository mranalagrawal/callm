<script lang="ts">
import { defineComponent, inject, useContext } from '@nuxtjs/composition-api'
import type { TISO639 } from '~/config/themeConfig'
import type { IProductCharacteristics } from '~/types/product'
import bioorbiodinamico from '~/assets/images/bioorbiodinamico.webp'

export default defineComponent({
  setup() {
    const { i18n } = useContext()
    const lang: TISO639 = i18n.locale as TISO639
    const { productInformations, organic, bioOperator } = inject('productCharacteristics') as IProductCharacteristics

    let characteristicText = ''

    characteristicText = productInformations?.map((obj) => {
      return obj.name[lang]
    }).join(', ') || ''

    return {
      characteristicText,
      organic,
      bioOperator,
      bioorbiodinamico,
    }
  },
})
</script>

<template>
  <div v-if="characteristicText">
    <h3 class="font-bold mb-0" v-text="$t(`product.productInformations`)" />
    <p class="mb-4">
      <span v-html="characteristicText" />
      <span v-if="organic">
        , <img :src="bioorbiodinamico" width="28" class="inline"> {{ $t(`product.bioInfo`) }}
      </span>
      <span v-if="bioOperator">, {{ $t(`product.bioOperator`) }} {{ bioOperator }}</span>
    </p>
  </div>
</template>

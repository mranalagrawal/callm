<script lang="ts">
import { defineComponent, inject, useContext } from '@nuxtjs/composition-api'
import type { TISO639 } from '~/config/themeConfig'
import bioOrBiodinamico from '~/assets/images/bio-or-biodinamico.webp'
import { getUniqueListBy } from '~/utilities/arrays'

export default defineComponent({
  setup() {
    const { i18n } = useContext()
    const lang: TISO639 = i18n.locale as TISO639
    const { productInformations, organic, bioOperator } = inject('productCharacteristics') as any

    let characteristicText = ''

    characteristicText = getUniqueListBy(productInformations, 'id')?.map((obj) => {
      return obj.name[lang]
    }).join(', ') || ''

    return {
      characteristicText,
      organic,
      bioOperator,
      bioOrBiodinamico,
    }
  },
})
</script>

<template>
  <div v-if="characteristicText" class="text-sm">
    <h3 class="text-sm mb-0" v-text="$t(`product.productInformations`)" />
    <div class="text-sm mb-4">
      <div v-html="characteristicText" />
      <span v-if="organic">
        , <img :src="bioOrBiodinamico" alt="bio" width="28" class="inline"> {{ $t(`product.bioInfo`) }}
      </span>
      <span v-if="bioOperator" class="text-sm">, {{ $t(`product.bioOperator`) }} {{ bioOperator }}</span>
    </div>
  </div>
</template>

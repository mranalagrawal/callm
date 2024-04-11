<script lang="ts">
import { defineComponent, inject, useContext } from '@nuxtjs/composition-api'

import bioOrBiodinamico from '~/assets/images/bio-or-biodinamico.webp'

import { getUniqueListBy } from '~/utilities/arrays'

export default defineComponent({
  setup() {
    const { i18n } = useContext()
    const { productInformations, organic, bioOperator } = inject('productCharacteristics') as any

    let characteristicText = ''

    characteristicText = getUniqueListBy(productInformations, 'id')?.map((obj) => {
      return obj.name[i18n.locale]
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
      <div>
        <span>{{ characteristicText }}</span>
        <span v-if="organic">
          , <img :src="bioOrBiodinamico" alt="bio" width="28" class="inline"> {{ $t(`product.bioInfo`) }}
        </span>
        <span v-if="bioOperator" class="text-sm">, {{ $t(`product.bioOperator`) }} {{ bioOperator }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, useContext } from '@nuxtjs/composition-api'
import type { TISO639 } from '~/config/themeConfig'
import type { IProductCharacteristics } from '~/types/product'

export default defineComponent({
  setup() {
    const { i18n } = useContext()
    const lang: TISO639 = i18n.locale as TISO639
    const { region, country } = inject('productCharacteristics') as IProductCharacteristics

    let characteristicText = ''
    if (region && region.name[lang]) {
      characteristicText = (region.slug && region.slug[lang]) ? `<a href="${region.slug[lang]}">${region.name[lang]}</a>` : region.name[lang]
    }
    if (country) {
      const countryText = (country.slug && country.slug[lang]) ? `<a href="${country.slug[lang]}">${country.name[lang]}</a>` : country.name[lang]
      characteristicText += (characteristicText !== '') ? ` (${countryText})` : `${countryText}`
    }

    return {
      characteristicText,
    }
  },
})
</script>

<template>
  <div v-if="characteristicText">
    <h3 class="font-bold mb-0" v-text="$t(`product.regionCountry`)" />
    <p class="mb-4" v-html="characteristicText" />
  </div>
</template>

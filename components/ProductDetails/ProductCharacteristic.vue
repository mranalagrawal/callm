<script lang="ts">
import { defineComponent, inject, useContext } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'
import type { TISO639 } from '~/config/themeConfig'
import type { ITranslations } from '~/types/common-objects'
import type { IProductCharacteristics } from '~/types/product'

export default defineComponent({
  props: {
    characteristic: {
      type: String as PropType<keyof IProductCharacteristics>,
      required: true,
    },
  },
  setup(props) {
    const productCharacteristic = inject('productCharacteristics') as IProductCharacteristics
    let characteristicText = ''

    const currentCharacteristic = productCharacteristic[props.characteristic]

    if (currentCharacteristic) {
      const { i18n } = useContext()
      const lang: TISO639 = i18n.locale as TISO639

      if (typeof currentCharacteristic === 'string') {
        characteristicText = currentCharacteristic as string
      } else if (Array.isArray(currentCharacteristic)) {
        characteristicText = currentCharacteristic
          .map((obj) => {
            const word = obj.name[lang]
            return (obj.slug && obj.slug[lang]) ? `<a href="${obj.slug[lang]}">${word}</a>` : word
          })
          .join(', ')
      // } else if (Object.getOwnPropertyNames(currentCharacteristic).every(item => ['it', 'en', 'de', 'fr'].includes(item))) {
      } else if (typeof currentCharacteristic === 'object' && 'id' in currentCharacteristic) {
        const word = currentCharacteristic.name[lang]
        characteristicText = (currentCharacteristic.slug && currentCharacteristic.slug[lang]) ? `<a href="${currentCharacteristic.slug[lang]}">${word}</a>` : word
      } else {
        // ITranslations
        const translations = currentCharacteristic as ITranslations
        characteristicText = translations[lang]
      }
    }

    return {
      characteristicText,
    }
  },
})
</script>

<template>
  <div v-if="characteristicText">
    <h3 class="font-bold mb-0" v-text="$t(`product.${characteristic}`)" />
    <div class="mb-4" v-html="characteristicText" />
  </div>
</template>

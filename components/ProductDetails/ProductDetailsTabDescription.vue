<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import type { IProductMapped } from '~/types/product'
import { pick } from '~/utilities/arrays'
import { generateKey } from '~/utilities/strings'

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
  setup(props) {
    const { i18n } = useContext()

    // const characteristics = [
    //   { title: 'Color', description: 'Giallo' },
    //   { title: 'Color', description: 'Giallo' },
    // ]

    const characteristicsInDescription = computed(() => {
      const result = []
      const characteristicsObj: Record<string, any> = pick(props.productDetails, ['color', 'taste', 'aroma'])
      for (const [key, obj] of Object.entries(characteristicsObj)) {
        result.push({ title: i18n.t(`product.${key}`), description: obj[i18n.locale] })
      }
      return result
    })

    const visible = computed(() => props.product?.descriptionHtml || characteristicsInDescription)

    return {
      characteristicsInDescription,
      visible,
      generateKey,
    }
  },
})
</script>

<template>
  <div v-if="visible" class="mt-6">
    <h2 class="h2" v-text="$t('productDescriptionTab', { productTitle: product?.title.toUpperCase() })" />
    <div class="prose" v-html="product?.descriptionHtml" />
    <div v-if="characteristicsInDescription" class="grid grid-cols-3">
      <div v-for="({ title, description }) in characteristicsInDescription" :key="generateKey(`${title}`)">
        <div class="h4">
          {{ title }}
        </div>
        <p>
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

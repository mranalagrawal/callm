<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent, onMounted, ref, useContext } from '@nuxtjs/composition-api'
import type { IProductMapped } from '~/types/product'

export default defineComponent({
  props: {
    sku: {
      type: String as PropType<IProductMapped['sku']>,
      required: true,
    },
  },
  setup(props) {
    const { $config } = useContext()

    const vintages = ref([])
    onMounted(async () => {
      if (process.browser) {
        const qry = await fetch(`${$config.ELASTIC_URL}product-related-vintages/${props.sku}`) // 13V91338
        const { data = [] } = await qry.json()

        if (data.length > 1)
          vintages.value = data
      }
    })

    return { vintages }
  },
})
</script>

<template>
  <div v-if="vintages.length" class="flex gap-2 items-center">
    <strong>{{ $t('product.otherVintages') }}</strong>
    <NuxtLink
      v-for="({ feId, handle_t, vintageyear }) in vintages"
      :key="feId" :to="`/${handle_t[$i18n.locale]}-P${feId}.htm`"
      class="bg-primary border-2 border-primary py-2 px-4 rounded-pill text-white
       hover:(border-primary-400 bg-white text-primary-400)"
    >
      {{ vintageyear }}
    </nuxtlink>
  </div>
</template>

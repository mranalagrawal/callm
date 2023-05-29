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
  <div v-if="vintages.length" class="cmw-flex cmw-gap-2 cmw-items-center">
    <strong>{{ $t('product.otherVintages') }}</strong>
    <NuxtLink
      v-for="({ feId, handle_t, vintageyear }) in vintages"
      :key="feId" :to="`/${handle_t[$i18n.locale]}-P${feId}.htm`"
      class="cmw-bg-primary cmw-border-2 cmw-border-primary cmw-py-2 cmw-px-4 cmw-rounded-pill cmw-text-white
       hover:(cmw-border-primary-400 cmw-bg-white cmw-text-primary-400 cmw-no-underline)"
    >
      {{ vintageyear }}
    </nuxtlink>
  </div>
</template>

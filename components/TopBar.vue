<script lang="ts">
import { defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { kv } from '@vercel/kv'
import type { TISO639 } from '~/config/themeConfig'

export default defineComponent({
  setup() {
    const { i18n } = useContext()
    const headline = ref('')
    const headlineSm = ref('')

    useFetch(async ({ $cmwStore }) => {
      const locale = i18n.locale as TISO639
      const prismicLocale = $cmwStore.prismicSettings.isoCode[locale]
      const data: any = await kv.get(`prismic/topbar/topbar-${prismicLocale}`)

      headline.value = data?.text ?? undefined
      headlineSm.value = data?.text_sm ?? undefined
    })

    return { headline, headlineSm }
  },
})
</script>

<template>
  <div
    class="print:hidden w-screen px-4 h-$cmw-top-banner-height text-center
     bg-secondary fixed top-0 left-0 z-1050 text-white uppercase py-1 line-clamp-2 leading-4 overline-2"
  >
    <PrismicText v-if="headlineSm" class="md:hidden" :field="headlineSm" />
    <PrismicText v-if="headline" class="<md:hidden" :field="headline" />
  </div>
</template>

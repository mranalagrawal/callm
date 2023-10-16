<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const headline = ref('')
    const headlineSm = ref('')

    useFetch(async ({ $cmwRepo }) => {
      await $cmwRepo.prismic.getSingle('topbar')
        .then((data) => {
          if (!data.text?.length) { return }

          headline.value = data.text ?? undefined
          headlineSm.value = data.text_sm ?? undefined
        })
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

<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const headline = ref('')

    useFetch(async ({ $cmwRepo }) => {
      await $cmwRepo.prismic.getSingle('topbar')
        .then((data) => {
          if (!data.text?.length) { return }

          headline.value = data.text[0].text
        })
    })

    return { headline }
  },
})
</script>

<template>
  <div
    class="print:hidden w-screen px-4 flex items-center justify-center h-$cmw-top-banner-height text-center
     bg-secondary fixed top-0 left-0 z-1050 text-white uppercase py-1
     overline-1 md:overline-2"
  >
    <span
      v-html="headline"
    />
  </div>
</template>

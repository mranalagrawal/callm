<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const footerCopyright = ref('')

    useFetch(async ({ $cmwRepo }) => {
      await $cmwRepo.prismic.getSingle('footer-test')
        .then((data) => {
          footerCopyright.value = data?.copyright || null
        })
    })

    return {
      footerCopyright,
    }
  },
})
</script>

<template>
  <PrismicRichText
    v-if="footerCopyright"
    class="sm:w-[min(100%,_80%)] m-inline-auto prose dark text-secondary-100 text-center text-xs"
    :field="footerCopyright"
  />
</template>

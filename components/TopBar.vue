<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
import prismicConfig from '~/config/prismicConfig'
import type { TStores } from '~/config/themeConfig'

export default defineComponent({
  setup() {
    const headline = ref('')

    useFetch(async ({ $config, $cmwRepo, $handleApiErrors }) => {
      await $cmwRepo.prismic.getSingle({ page: prismicConfig[$config.STORE as TStores]?.components.topbar })
        .then(({ data }) => {
          headline.value = data.text[0].text
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting TopBar data from prismic: ${err}`))
    })

    return { headline }
  },
})
</script>

<template>
  <div
    class="cmw-w-screen cmw-px-4 cmw-flex cmw-items-center cmw-justify-center cmw-h-$cmw-top-banner-height cmw-text-center
     cmw-bg-secondary cmw-fixed cmw-top-0 cmw-left-0 cmw-z-1050 cmw-text-white cmw-uppercase cmw-py-1
     cmw-overline-1 md:cmw-overline-2"
  >
    <span
      v-html="headline"
    />
  </div>
</template>

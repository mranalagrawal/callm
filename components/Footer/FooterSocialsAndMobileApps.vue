<script lang="ts">
import { defineComponent, toRefs } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useLayout } from '~/store/layout'

export default defineComponent({
  name: 'FooterSocialsAndMobileApps',

  setup() {
    const { footer } = storeToRefs(useLayout())
    const { mobileApps, socialLinks } = toRefs(footer.value)

    return { mobileApps, socialLinks }
  },
})
</script>

<template>
  <div class="mt-8 gap-4 grid items-center justify-items-center md:( grid-cols-2 justify-between justify-items-stretch)">
    <div class="flex gap-2">
      <a
        v-for="({ altText, url, link, id }) in socialLinks" :key="id" :href="link"
        :aria-label="$t(`enums.accessibility.labels.GO_TO_PAGE`, { url: altText }).toString()"
      >
        <img :src="url" :alt="altText" class="w-8">
      </a>
    </div>
    <div class="grid max-w-300px grid-cols-2 gap-4 items-center justify-end md:ml-auto">
      <a
        v-for="({ altText, url, link, id }) in mobileApps" :key="id" :href="link"
        :aria-label="$t(`enums.accessibility.labels.GET_THE_APP`).toString()"
      >
        <img :src="url" :alt="altText" class="w-26">
      </a>
    </div>
  </div>
</template>

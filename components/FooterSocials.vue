<script>
import { inject } from '@nuxtjs/composition-api'

export default {
  setup() {
    const socialLinks = inject('socialLinks')
    const mobileApps = inject('mobileApps')
    return {
      mobileApps,
      socialLinks,
    }
  },
}
</script>

<template>
  <div class="mt-8 gap-4 grid items-center justify-items-center md:( grid-cols-2 justify-between justify-items-stretch)">
    <div class="flex gap-2">
      <a
        v-for="({ alt_text, image, link }) in socialLinks" :key="image.url" :href="link.url"
        :aria-label="$t(`enums.accessibility.labels.GO_TO_PAGE`, { url: alt_text.text })"
      >
        <PrismicImage
          :field="image"
          class="w-8"
        />
      </a>
    </div>
    <div v-if="$config.STORE === 'CMW'" class="grid max-w-300px grid-cols-2 gap-4 items-center justify-end md:ml-auto">
      <a
        v-for="({ image, link }) in mobileApps" :key="image.url" :href="link.url"
        :aria-label="$t(`enums.accessibility.labels.GET_THE_APP`)"
      >
        <PrismicImage
          :field="image"
          class="w-26"
        />
      </a>
    </div>
  </div>
</template>

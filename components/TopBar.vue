<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useLayout } from '~/store/layout'

export default defineComponent({
  setup() {
    const { topbar } = storeToRefs(useLayout())

    return { topbar }
  },
})
</script>

<template>
  <div
    class="print:hidden w-screen px-4 h-$cmw-top-banner-height text-center
     bg-secondary fixed top-0 left-0 z-1050 text-white uppercase py-1 line-clamp-2 leading-4 overline-2"
  >
    <div v-if="topbar.mobileText" class="md:hidden">
      {{ topbar.mobileText }}
    </div>
    <div v-if="topbar.desktopText" class="<md:hidden">
      {{ topbar.desktopText }}
    </div>
  </div>
</template>

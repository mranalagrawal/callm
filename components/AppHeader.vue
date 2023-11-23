<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import logo from '~/assets/svg/logo-call-me-wine.svg'

export default defineComponent({
  setup() {
    return {
      logo,
    }
  },
})
</script>

<template>
  <div
    class="fixed w-screen min-h-[50px] px-4 py-2 top-0 bg-white z-tooltip print:hidden md:pb-0"
  >
    <div class="pt-$cmw-top-banner-height text-center">
      <NuxtLink
        class="flex max-w-120px md:max-w-250px m-inline-auto"
        :aria-label="$t('enums.accessibility.labels.GO_TO_HOME_PAGE')"
        :to="localePath('/')"
      >
        <VueSvgIcon
          :data="logo"
          width="100%"
          height="auto"
          original
        />
      </nuxtlink>
    </div>
  </div>
</template>

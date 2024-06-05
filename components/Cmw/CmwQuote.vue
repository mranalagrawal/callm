<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import quoteClosedIcon from '~/assets/svg/quote-closed.svg'
import quoteOpenIcon from '~/assets/svg/quote-open.svg'

export default defineComponent({
  name: 'CmwQuote',
  props: {
    quote: String,
  },
  setup() {
    return {
      quoteClosedIcon,
      quoteOpenIcon,
    }
  },
})
</script>

<template>
  <div v-if="quote" class="relative">
    <VueSvgIcon :data="quoteOpenIcon" width="80" height="80" class="absolute top-0 left-0" color="#F8F8F8" />
    <VueSvgIcon :data="quoteClosedIcon" width="80" height="80" class="absolute bottom-0 right-0" color="#F8F8F8" />
    <div
      class="relative z-base px-12 py-8 font-cmw-light text-gray-dark children:text-gray-dark"
      v-html="quote"
    />
  </div>
</template>

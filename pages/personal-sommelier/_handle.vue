<script lang="ts">
import { defineComponent, useRoute } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const route = useRoute()
    return { route }
  },
})
</script>

<template>
  <div>
    <h1>Personal Sommelier</h1>
    <pre class="text-xs">{{ route.params }}</pre>
  </div>
</template>

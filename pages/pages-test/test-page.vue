<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const msg = 'hey'

    return { msg }
  },
})
</script>

<template>
  <div>Empty page {{ msg }}</div>
</template>

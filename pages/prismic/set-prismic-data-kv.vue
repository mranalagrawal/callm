<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'empty',
  middleware: ['vercel'],
})
</script>

<template>
  <div class="ml-8">
    <NuxtLink to="/">
      Home
    </NuxtLink>
  </div>
</template>

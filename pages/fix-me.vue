<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  layout() {
    return 'empty'
  },
  computed: {
    vuex() {
      if (process.client && typeof window !== 'undefined')
        return JSON.parse(window.localStorage.getItem('vuex') || '')

      return 'EMPTY'
    },
    userCart() {
      return this.$store.state.userCart.userCart
    },
  },
})
</script>

<template>
  <div>
    <pre>{{ vuex }}</pre>
  </div>
</template>

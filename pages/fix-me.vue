<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  layout() {
    return 'empty'
  },
  computed: {
    vuex() {
      if (typeof window !== 'undefined')
        return window.localStorage.getItem('vuex')

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
    <pre>{{ JSON.parse(vuex) }}</pre>
    <pre>{{ userCart }}</pre>
  </div>
</template>

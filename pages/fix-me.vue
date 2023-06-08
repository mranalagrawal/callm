<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  computed: {
    userCart() {
      return this.$store.state.userCart.userCart
    },
  },
})
</script>

<template>
  <pre>{{ userCart }}</pre>
</template>

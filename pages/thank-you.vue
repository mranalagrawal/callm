<script>
export default {
  layout(context) {
    return context.$config.STORE
  },
  async mounted() {
    this.$store.commit('userCart/resetCart')
  },
}
</script>

<template>
  <div />
</template>

<script>
export default {
  layout(context) {
    return context.$config.STORE
  },
  mounted() {
    this.$prismic.preview()
  },
}
</script>

<template>
  <p>Loading Prismic preview...</p>
</template>

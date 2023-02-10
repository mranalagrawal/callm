<script>
export default {
  layout(context) {
    return context.$config.STORE
  },
  scrollToTop: true,
}
</script>

<template>
  <div>
    <search-filter :input-parameters="$route.query" />
  </div>
</template>

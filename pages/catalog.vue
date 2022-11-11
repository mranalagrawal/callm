<template>
  <div>
    <search-filter :inputParameters="$route.query" />
  </div>
</template>

<script>
export default {
  scrollToTop: true,
  layout(context) {
    return context.$config.STORE;
  },
};
</script>

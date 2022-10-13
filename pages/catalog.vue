<template>
  <div>
    <search-filter :inputParameters="$route.query" />
  </div>
</template>

<script>
export default {
  scrollToTop: true,
};
</script>

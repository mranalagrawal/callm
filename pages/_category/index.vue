<template>
  <div class="container-fluid px-md-5 mt-5">
    <div class="row">
      <div class="col-12">
        <nuxt-link
          to="/"
          class="text-dark-red"
          style="text-transform: capitalize"
          >Home</nuxt-link
        >
        /
        <span style="text-transform: capitalize">{{ category }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  /* variables */
  data() {
    return {
      category: null,
    };
  },

  created() {
    this.category = this.$route.params.category;
  },
};
</script>

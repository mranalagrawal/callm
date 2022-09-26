<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h1>Wishlist</h1>
      </div>
    </div>
    <div class="row">
      {{ wishlist }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wishlist: null,
    };
  },
  async mounted() {
    this.wishlist = this.$store.state.user.user.customer.wishlist;
  },
};
</script>

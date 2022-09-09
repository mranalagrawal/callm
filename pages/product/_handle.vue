<template>
  <div class="mt-5">
    <product v-if="product" :product="product" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: null,
    };
  },
  created() {
    console.log(this.$route.path.split("product/")[1], "route");
    this.product = this.$route.path.split("product/")[1];
  },
};
</script>

<style scoped></style>

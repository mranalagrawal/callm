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
    console.log(this.$route.path);

    let path = this.$route.path;
    let isProduct = /[-P][0-9]+/;

    console.log(isProduct.test(path));

    /* console.log(this.$route.path.split("-P")[0].split("/").at(-1), ">>>"); */
    if (isProduct.test(path)) {
      this.product = this.$route.path.split("-P")[0].split("/").at(-1);
    }
    //this.product = this.$route.path.split("-P")[0].substring(1);
  },
};
</script>

<style scoped></style>

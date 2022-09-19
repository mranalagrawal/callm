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
    let isProduct = /[P][0-9]+/;

    console.clear();

    if (isProduct.test(path)) {
      /* this.product = this.$route.path.split("-P")[0].split("/").at(-1); */
      this.product = "P" + this.$route.path.split("-P")[1];

      /* console.log(this.$route.path.split("-P")[1], "SSS"); */
    }
  },
};
</script>

<style scoped></style>

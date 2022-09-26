<template>
  <div class="mt-5">
    <brand :brandId="brandId" />
  </div>
</template>

<script>
import Brand from "../../components/Brand.vue";
export default {
  components: { Brand },
  data() {
    return {
      brandId: null,
    };
  },
  created() {
    /* console.clear(); */
    console.log(this.$route.path.split("product/")[1], "route");

    this.brandId = this.$route.path.split("-").at(-1);
  },
};
</script>

<style scoped></style>

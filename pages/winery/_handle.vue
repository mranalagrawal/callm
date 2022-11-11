<template>
  <div class="mt-5">
    <brand :brandId="brandId" />
  </div>
</template>

<script>
import Brand from "../../components/Brand.vue";
export default {
  components: { Brand },
  layout(context) {
    return context.$config.STORE;
  },
  data() {
    return {
      brandId: null,
    };
  },
  created() {
    this.brandId = this.$route.path.split("-").at(-1);
  },
};
</script>

<style scoped></style>

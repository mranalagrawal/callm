<template>
  <div v-if="data" class="container">
    <div class="row">
      <div class="col-12 col-md-4">
        <img :src="data.image.url" alt="" />
      </div>
      <div class="col-12 col-md-8">
        <h1>{{ data.title }}</h1>
        <div v-html="data.contentHtml"></div>
      </div>
    </div>
    <div>
      {{ data }}
    </div>
  </div>
</template>

<script>
/* import { queryProductByHandle } from "../../utilities/productQueries"; */

import { getBrandForProduct } from "../utilities/brandForProduct";
export default {
  props: ["brandId"],
  data() {
    return {
      data: null,
    };
  },
  async fetch() {
    const domain = this.$config.DOMAIN;
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

    const data = await getBrandForProduct(domain, access_token, this.brandId);

    console.log(data);
    this.data = data;
  },
};
</script>

<style scoped></style>

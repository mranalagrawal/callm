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

import { queryProductByHandle } from "../utilities/productQueries";
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

    /* , query: "blog_title: Rosso Giovanni") */
    const brandQuery = `query {
      articles(first: 200, query:"tag:${this.brandId}")  {
          nodes {
              title
              handle
              id   
              contentHtml    
              image {
                url
              }
          }
      }
    }`;

    const GRAPHQL_BODY = {
      async: true,
      crossDomain: true,
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": access_token,
        "Content-Type": "application/graphql",
      },
      body: brandQuery,
    };
    const data = await fetch(domain, GRAPHQL_BODY).then((res) => res.json());

    console.log(data.data.articles.nodes[0]);
    this.data = data.data.articles.nodes[0];
  },
};
</script>

<style scoped></style>

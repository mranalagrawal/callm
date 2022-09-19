<template>
  <div class="container-fluid px-md-5 mt-5">
    <div class="row" v-if="data">
      <!-- {{ data }} -->
      <div
        class="col-12 col-md-6 col-lg-4 mb-3"
        v-for="brand in data"
        :key="brand.id"
      >
        <nuxt-link
          :to="localePath('/winery' + '/' + brand.handle + '-' + brand.tags[0])"
          class="card shadow h-100 p-3 text-decoration-none text-dark"
        >
          <!-- {{ brand }} -->

          <img
            v-if="brand.image && brand.image.url"
            :src="brand.image.url"
            alt=""
            width="40%"
            class="mx-auto d-block"
          />
          <p class="mt-5 text-center font-weight-bold">{{ brand.title }}</p>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: null,
    };
  },
  async fetch() {
    const domain = this.$config.DOMAIN;
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

    const brandQuery = `query {
      articles(first: 200)  {
          nodes {
              title
              handle
              id   
              contentHtml   
              tags 
              image {
                url
              }
          }
          pageInfo {
              hasNextPage
              hasPreviousPage
              endCursor
              startCursor
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

    console.log(data);
    this.data = data.data.articles.nodes;
  },
};
</script>

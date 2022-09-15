<template>
  <div>
    <div v-if="data">
      {{ data.nodes.length }}
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
    this.data = data.data.articles;
  },
};
</script>

<script>
import { queryAllCollections } from '../../utilities/productQueries'

export default {
  layout(context) {
    return context.$config.STORE
  },
  data: () => ({
    data: null,
  }),
  async fetch() {
    const GRAPHQL_URL = this.$config.DOMAIN

    const productQuery = queryAllCollections(this.$i18n.locale.toUpperCase())

    const GRAPHQL_BODY = () => {
      return {
        async: true,
        crossDomain: true,
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token':
            this.$config.STOREFRONT_ACCESS_TOKEN,
          'Content-Type': 'application/graphql',
        },
        body: productQuery,
      }
    }
    const response = await fetch(GRAPHQL_URL, GRAPHQL_BODY()).then(res =>
      res.json(),
    )

    const responseFiltered = response.data.collections.edges.filter(
      el => el.node.title != 'home shelf 1' && el.node.title != 'home shelf 2',
    )

    this.data = responseFiltered
  },
  watch: {
    '$i18n.locale': '$fetch',
  },
}
</script>

<template>
  <div class="container-fluid container-large px-md-3 my-5">
    <div class="row mt-5 mb-3">
      <div class="col-12">
        <h1>Tutte le Collections</h1>
      </div>
    </div>
    <div class="row">
      <div
        v-for="(collection, i) in data"
        :key="i"
        class="col-12 col-md-6 col-lg-3 mb-4"
      >
        <div
          class="card collection d-flex justify-content-center align-items-center"
          :style="{
            backgroundImage:
              `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(${
                collection.node.image.url
              })`,
          }"
        >
          <span
            class="badge badge-pill badge-light-secondary mx-1 collection-badge px-3 py-1 font-weight-normal"
          >
            SELEZIONE
          </span>
          <nuxt-link
            :to="`selections/${collection.node.handle}`"
            class="text-center text-decoration-none"
          >
            <p class="text-white h4">
              {{ collection.node.title }}
            </p>
            <p class="text-white">
              {{ collection.node.description }}
            </p>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.collection {
  height: 300px;
  background-position: center;
  background-size: cover;
  width: 90%;
  margin: 0px auto;
  border-radius: 20px;
}

.collection-badge {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>

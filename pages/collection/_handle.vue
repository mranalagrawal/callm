<template>
  <div class="container-fluid px-md-5 mt-5">
    <div class="row my-3">
      <div class="col-6">
        <span class="font-weight-bold">{{ products.length }} risultati</span>
        <button class="btn" :class="isGrid && 'shadow'" @click="isGrid = true">
          <i class="fas fa-th text-dark-red"></i>
        </button>
        <button
          class="btn"
          :class="!isGrid && 'shadow'"
          @click="isGrid = false"
        >
          <i class="fas fa-list text-dark-red"></i>
        </button>
      </div>
      <div class="col-6 text-right">
        <button class="btn" @click="sort('price', 'asc')">
          Prezzo più basso
        </button>
        <button class="btn" @click="sort('price', 'desc')">
          Prezzo più alto
        </button>
      </div>
    </div>
    <div class="row" v-if="isGrid">
      <div
        class="col-12 col-md-4 col-lg-3"
        v-for="product in sortedProducts"
        :key="product.id"
      >
        <ProductCardVertical :product="product" />
      </div>
    </div>
    <div class="row" v-else>
      <div
        class="col-12 col-lg-6 mb-5"
        v-for="product in sortedProducts"
        :key="product.id"
      >
        <ProductCardHorizontal :product="product" />
      </div>
    </div>
    <div class="row justify-content-center w-50 mx-auto">
      <!-- <p>
        <button @click="prevPage">Previous</button>
        <button @click="nextPage">Next</button>
      </p> -->

      <button
        class="btn text-light-red mx-1 border-0"
        :class="n === currentPage && 'active-page'"
        @click="currentPage = n"
        v-for="n in Math.ceil(products.length / pageSize)"
        :key="n"
      >
        {{ n }}
      </button>
    </div>
  </div>
</template>

<script>
import { queryByCollection } from "../../utilities/productQueries";
import ProductCardVertical from "../../components/ProductCardVertical.vue";
import ProductCardHorizontal from "../../components/ProductCardHorizontal.vue";

export default {
  data() {
    return {
      isGrid: true,
      currentSort: "title",
      currentSortDir: "asc",
      pageSize: 2,
      currentPage: 1,
    };
  },
  methods: {
    sort: function (field, direction) {
      this.currentSort = field;
      this.currentSortDir = direction;
    },
    nextPage: function () {
      if (this.currentPage * this.pageSize < this.products.length)
        this.currentPage++;
    },
    prevPage: function () {
      if (this.currentPage > 1) this.currentPage--;
    },
  },
  computed: {
    sortedProducts: function () {
      return this.products
        .sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === "desc") modifier = -1;
          if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        })
        .filter((row, index) => {
          let start = (this.currentPage - 1) * this.pageSize;
          let end = this.currentPage * this.pageSize;
          if (index >= start && index < end) return true;
        });
    },
  },
  async asyncData({ params, $config }) {
    const handle = params.handle;

    const productQuery = queryByCollection(params.handle);

    const GRAPHQL_BODY = {
      async: true,
      crossDomain: true,
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": "279d676bc21f056aea81490d952f5ec0",
        "Content-Type": "application/graphql",
      },
      body: productQuery,
    };
    const products = await fetch($config.DOMAIN, GRAPHQL_BODY)
      .then((res) => res.json())
      .then((res) => {
        let results = res.data.collectionByHandle.products.nodes.map((el) => {
          return { ...el, price: el.variants.nodes[0].price };
        });

        return results;
        /* return res.data.collectionByHandle.products.nodes; */
      });

    return { products };
  },
};
</script>

<style scoped>
.active-page {
  border: none;
  border-radius: 0px;
  border-bottom: 2px solid var(--light-red) !important;
}
</style>

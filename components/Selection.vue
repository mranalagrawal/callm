<script>
import VueSlickCarousel from 'vue-slick-carousel'
import { queryByCollection } from '../utilities/productQueries'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

import ProductCardVertical from '../components/ProductCardVertical.vue'
export default {
  components: { ProductCardVertical, VueSlickCarousel },
  props: {
    selection: {
      type: String,
    },
  },
  data: () => ({
    data: null,
    currentSort: 'title',
    currentSortDir: 'asc',
  }),
  async fetch() {
    const GRAPHQL_URL = this.$config.DOMAIN

    const productQuery = queryByCollection(
      this.selection,
      this.$i18n.locale.toUpperCase(),
    )

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
    this.data = await fetch(GRAPHQL_URL, GRAPHQL_BODY())
      .then(res => res.json())
      .then((res) => {
        return {
          products: res.data.collectionByHandle.products.nodes,
          description: res.data.collectionByHandle.description,
          title: res.data.collectionByHandle.title,
        }
      })
  },
  computed: {
    sorted() {
      if (!this.data)
        return
      if (this.currentSort == 'title') {
        return this.data.products.sort((a, b) => {
          let modifier = 1
          if (this.currentSortDir === 'desc')
            modifier = -1
          if (a[this.currentSort] < b[this.currentSort])
            return -1 * modifier
          if (a[this.currentSort] > b[this.currentSort])
            return 1 * modifier
          return 0
        })
      } else {
        return this.data.products.sort((a, b) => {
          let modifier = 1
          if (this.currentSortDir === 'desc')
            modifier = -1
          if (+a.variants.nodes[0].price < +b.variants.nodes[0].price)
            return -1 * modifier
          if (+a.variants.nodes[0].price > +b.variants.nodes[0].price)
            return 1 * modifier
          return 0
        })
      }
    },
  },
  watch: {
    '$i18n.locale': '$fetch',
  },
  methods: {
    sort(s) {
      // if s == current sort, reverse
      if (s === this.currentSort)
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'

      this.currentSort = s
    },
  },
}
</script>

<template class="mt-5 pt-5">
  <div class="container-fluid container-large px-md-3 my-5">
    <div v-if="data" class="row mb-3">
      <div class="col-12">
        <nuxt-link class="text-light-secondary" :to="localePath(`/`)">
          Home
        </nuxt-link>
        <i class="fal fa-chevron-right small px-1" />
        <nuxt-link class="text-light-secondary" :to="localePath(`/selections`)">
          Tutte le Selezioni
        </nuxt-link>
        <i class="fal fa-chevron-right small px-1" />
        <span class="text-muted">{{ data.title }}</span>
      </div>
    </div>
    <div v-if="data && data.products.length > 0" class="row">
      <div class="col-12">
        <h1 class="font-weight-bold text-dark-primary mt-3">
          {{ data.title }}
        </h1>
      </div>
      <div v-if="data" class="col-12">
        <p class="">
          {{ data.description }}
        </p>
      </div>
    </div>

    <div v-if="data" class="row">
      <div class="col-12">
        <span v-text="$t('search.sortBy')" />
        <!-- FixMe: change these icon for the proper sortBy component from DS -->
        <button
          class="btn"
          :class="currentSort == 'title' ? 'button-active' : 'button'"
          @click="sort('title')"
        >
          {{ $t('search.sort.name') }}
          <i
            v-if="currentSortDir == 'desc' && currentSort == 'title'"
            class="fal fa-sort-alpha-down"
          />
          <i
            v-if="currentSortDir == 'asc' && currentSort == 'title'"
            class="fal fa-sort-alpha-down-alt"
          />
        </button>
        <button
          class="btn"
          :class="currentSort == 'price' ? 'button-active' : 'button'"
          @click="sort('price')"
        >
          {{ $t('search.sort.price') }}
          <i
            v-if="currentSortDir == 'desc' && currentSort == 'price'"
            class="fal fa-sort-numeric-down"
          />
          <i
            v-if="currentSortDir == 'asc' && currentSort == 'price'"
            class="fal fa-sort-numeric-down-alt"
          />
        </button>
      </div>
    </div>

    <div class="row">
      <div
        v-for="product in sorted"
        :key="product.id"
        class="col-12 col-md-6 col-lg-4 col-xl-3"
      >
        <ProductCardVertical :product="product" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.button {
  border: 2px solid var(--light-secondary);
  border-radius: 12px;
  color: var(--light-secondary);
}

.button-active {
  border: 2px solid var(--light-secondary);
  border-radius: 12px;
  background-color: var(--light-secondary);
  color: white;
}
</style>

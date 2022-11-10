<template>
  <div class="container-fluid container-large px-md-3 my-5">
    <div class="row">
      <div class="col-12 text-center" v-if="data">
        <h2 class="font-weight-bold text-dark-primary">
          {{ data.description }}
        </h2>
      </div>

      <div class="col-12 py-4" v-if="data">
        <VueSlickCarousel v-bind="settings">
          <div v-for="product in data.products" :key="product.id">
            <ProductCardVertical :product="product" />
          </div>
        </VueSlickCarousel>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-12 text-center">
        <nuxt-link
          :to="localePath('/catalog?favourite=true&page=1')"
          class="btn px-5 py-2 text-uppercase view-more font-weight-bold"
          >{{ $t("viewMore") }}</nuxt-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { queryByCollection } from "../utilities/productQueries";

import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import ProductCardVertical from "./ProductCardVertical.vue";

export default {
  watch: {
    "$i18n.locale": "$fetch",
  },
  components: { ProductCardVertical, VueSlickCarousel },
  data: () => ({
    data: null,
    settings: {
      dots: true,
      focusOnSelect: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      touchThreshold: 5,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            arrows: false,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          },
        },
      ],
    },
  }),
  async fetch() {
    const GRAPHQL_URL = this.$config.DOMAIN;

    const productQuery = queryByCollection(
      "featured",
      this.$i18n.locale.toUpperCase()
    );

    const GRAPHQL_BODY = () => {
      return {
        async: true,
        crossDomain: true,
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token":
            this.$config.STOREFRONT_ACCESS_TOKEN,
          "Content-Type": "application/graphql",
        },
        body: productQuery,
      };
    };
    this.data = await fetch(GRAPHQL_URL, GRAPHQL_BODY())
      .then((res) => res.json())
      .then((res) => {
        return {
          products: res.data.collectionByHandle.products.nodes,
          description: res.data.collectionByHandle.description,
          title: res.data.collectionByHandle.title,
        };
      });
  },
};
</script>

<style scoped>
/* :deep(.slick-list) {
  overflow: visible !important;
} */
/* :deep(.slick-slide) {
  opacity: 0;
  visibility: hidden;
}

:deep(.slick-slide.slick-active) {
  opacity: 1;
  visibility: visible;
} */

.view-more {
  border: 2px solid var(--light-secondary);
  border-radius: 12px;
  color: var(--light-secondary);
}
:deep(.slick-arrow.slick-prev) {
  width: 48px;
  height: 48px;
  background: white;
  box-shadow: 0 0.5rem 1rem rgba(102, 101, 101, 0.5) !important;
  background-image: url("../assets/images/chevron-left.svg") !important;
  background-size: 24px;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  left: -14px;
}
:deep(.slick-arrow.slick-next) {
  width: 48px;
  height: 48px;
  background: white;
  box-shadow: 0 0.5rem 1rem rgba(102, 101, 101, 0.5) !important;
  background-image: url("../assets/images/chevron-right.svg") !important;
  background-size: 24px;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  right: -14px;
  z-index: 99;
}
:deep(.slick-prev::before) {
  color: red;
  /* content: "\2039"; */
  content: "";
  font-size: 60px;
  line-height: unset;
}
:deep(.slick-next::before) {
  color: red;
  /* content: "\203A"; */
  content: "";
  font-size: 60px;
  line-height: unset;
}

:deep(.slick-dots li button:before) {
  font-size: 10px;
  opacity: 0.6;
  color: var(--light-secondary);
}

:deep(.slick-dots li.slick-active button:before) {
  opacity: 1;
  font-size: 16px;
  color: var(--dark-secondary);
}
:deep(.slick-dots) {
  bottom: -48px;
}
</style>

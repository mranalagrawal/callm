<template>
  <div class="container-fluid px-md-5 my-5">
    <!-- <div v-for="product in products" :key="product.id">{{ product.title }}</div> -->
    <div class="row">
      <div class="col-12 text-center" v-if="data">
        <h3>{{ data.title }}</h3>
        <p>{{ data.description }}</p>
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
        <button class="btn pox-5 btn-outline-light-red">Vedi tutti</button>
      </div>
    </div>
  </div>
</template>

<script>
import { queryByCollection } from "../../utilities/productQueries";

import VueSlickCarousel from "vue-slick-carousel";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import ProductCardVertical from "../ProductCardVertical.vue";

export default {
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
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    },
  }),
  async fetch() {
    const GRAPHQL_URL = this.$config.DOMAIN;

    const productQuery = queryByCollection("last");

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
:deep(.slick-arrow.slick-prev) {
  width: 48px;
  height: 48px;
  background: white;
  box-shadow: 0 0.5rem 1rem rgba(102, 101, 101, 0.5) !important;
  background-image: url("../../assets/images/chevron-left.svg") !important;
  background-size: 75%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}
:deep(.slick-arrow.slick-next) {
  width: 48px;
  height: 48px;
  background: white;
  box-shadow: 0 0.5rem 1rem rgba(102, 101, 101, 0.5) !important;
  background-image: url("../../assets/images/chevron-right.svg") !important;
  background-size: 75%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
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
  font-size: 16px;

  opacity: 0.25;
  color: var(--dark-red);
}

:deep(.slick-dots li.slick-active button:before) {
  opacity: 1;
}
:deep(.slick-dots) {
  bottom: -48px;
}
</style>

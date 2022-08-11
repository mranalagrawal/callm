<template>
  <div class="container-fluid my-5 bg-light py-5">
    <!-- <div v-for="product in products" :key="product.id">{{ product.title }}</div> -->
    <div class="row py-5 px-0">
      <div class="col-12 text-center">
        <h2>Le nostre selezioni</h2>
      </div>
      <div class="col-12 px-0 py-4">
        <VueSlickCarousel v-bind="settings" ref="carousel">
          <div v-for="n in 12" :key="n" class="px-2">
            <div class="selection-card px-3">
              <i class="fal fa-leaf fa-2x mr-2"></i> Vini {{ n }}
            </div>
          </div>
        </VueSlickCarousel>
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
      arrows: false,
      dots: true,
      infinite: true,
      slidesToShow: 5.5,
      slidesToScroll: 4,
      autoplay: true,
      speed: 8000,
      autoplaySpeed: 0,
      cssEase: "linear",
      pauseOnFocus: false,
      pauseOnHover: false,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 3.5,
          },
        },
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 2.5,
          },
        },
        {
          breakpoint: 420,
          settings: {
            slidesToShow: 1.5,
          },
        },
      ],
    },
  }),
  /* async fetch() {
    const GRAPHQL_URL = this.$config.DOMAIN;

    const productQuery = queryByCollection("test");

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
        console.log(res, "RES");
        console.log(res.data.collectionByHandle.products.nodes, "prods");
        return {
          products: res.data.collectionByHandle.products.nodes,
          description: res.data.collectionByHandle.description,
        };
      });
  }, */
};
</script>

<style scoped>
.selection-card {
  background: linear-gradient(76deg, #751f3d 1%, #ad2b48 95%);
  border-radius: 12px;
  height: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

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

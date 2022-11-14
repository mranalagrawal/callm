<template>
  <div class="container-fluid container-large px-md-3 my-5">
    <div class="row">
      <!-- <div class="col-12 text-center" v-if="data">
        <h3 class="font-weight-bold text-dark-primary">Collections</h3>
      </div> -->

      <div class="col-12 py-4" v-if="data">
        <VueSlickCarousel v-bind="settings">
          <div v-for="(collection, i) in data" :key="i">
            <div
              class="card collection d-flex justify-content-center align-items-center"
              :style="{
                backgroundImage:
                  'linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(' +
                  collection.node.image.url +
                  ')',
              }"
            >
              <span
                class="badge badge-pill badge-light-secondary mx-1 collection-badge px-3 py-1 font-weight-normal"
              >
                SELEZIONE
              </span>
              <div class="text-center">
                <p class="text-white h4">{{ collection.node.title }}</p>
                <p class="text-white">{{ collection.node.description }}</p>
              </div>
            </div>
          </div>
        </VueSlickCarousel>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-12 text-center">
        <nuxt-link
          :to="localePath('/selections')"
          class="btn px-5 py-2 text-uppercase view-more font-weight-bold"
          >{{ $t("viewMore") }}</nuxt-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { queryAllCollections } from "../../utilities/productQueries";

import VueSlickCarousel from "vue-slick-carousel";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import ProductCardVertical from "../ProductCardVertical.vue";

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

    const productQuery = queryAllCollections(this.$i18n.locale.toUpperCase());

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
    const response = await fetch(GRAPHQL_URL, GRAPHQL_BODY()).then((res) =>
      res.json()
    );

    const responseFiltered = response.data.collections.edges.filter(
      (el) => el.node.title != "last" && el.node.title != "featured"
    );

    this.data = responseFiltered;
    console.log(responseFiltered, "All Collections");
  },
};
</script>

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
  background-image: url("../../assets/images/chevron-left.svg") !important;
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
  background-image: url("../../assets/images/chevron-right.svg") !important;
  background-size: 24px;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  right: -14px;
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
  color: var(--dark-secondary);
}

:deep(.slick-dots li.slick-active button:before) {
  opacity: 1;
}
:deep(.slick-dots) {
  bottom: -48px;
}
</style>

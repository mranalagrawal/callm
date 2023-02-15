<script>
import VueSlickCarousel from 'vue-slick-carousel'
import { productRecommendations } from '../utilities/productQueries'

import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import ProductCardVertical from './ProductCardVertical.vue'

export default {
  components: { ProductCardVertical, VueSlickCarousel },
  props: ['product'],
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
    const GRAPHQL_URL = this.$config.DOMAIN
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN

    const recommendationsQuery = productRecommendations(this.product)

    const GRAPHQL_BODY_RECCOMENDATIONS = {
      async: true,
      crossDomain: true,
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': access_token,
        'Content-Type': 'application/graphql',
      },
      body: recommendationsQuery,
    }
    const dataReccomendations = await fetch(
      GRAPHQL_URL,
      GRAPHQL_BODY_RECCOMENDATIONS,
    ).then(res => res.json())

    this.data = dataReccomendations.data.productRecommendations
  },
  watch: {
    '$i18n.locale': '$fetch',
  },
}
</script>

<template>
  <div class="container-fluid container-large px-md-0 my-5">
    <div class="row">
      <div v-if="data && data.length > 0" class="col-12 text-center">
        <h2 class="font-weight-bold text-dark-primary" v-text="$t('common.carousel.recommendedProducts')" />
      </div>

      <div v-if="data && data.length > 0" class="col-12 py-4">
        <VueSlickCarousel v-bind="settings">
          <div v-for="product in data" :key="product.id">
            <ProductCardVertical :product="product" />
          </div>
          <template #prevArrow>
            <div class="custom-arrow">
              <VueSvgIcon :data="require(`@/assets/svg/chevron-left.svg`)" width="20" height="20" />
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-arrow">
              <VueSvgIcon :data="require(`@/assets/svg/chevron-right.svg`)" width="20" height="20" />
            </div>
          </template>
        </VueSlickCarousel>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

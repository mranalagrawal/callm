<script>
import VueSlickCarousel from 'vue-slick-carousel'
import { queryProductByIdAsTag } from '../utilities/productQueries'

import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import ProductCardVertical from './ProductCardVertical.vue'

export default {
  components: { ProductCardVertical, VueSlickCarousel },
  props: ['vendor'],
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
    const allTags = this.$store.state.recent.recent.join(' OR ')

    const GRAPHQL_URL = this.$config.DOMAIN
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN

    const productQuery = queryProductByIdAsTag(allTags)

    const GRAPHQL_BODY = {
      async: true,
      crossDomain: true,
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': access_token,
        'Content-Type': 'application/graphql',
      },
      body: productQuery,
    }
    const data = await fetch(GRAPHQL_URL, GRAPHQL_BODY).then(res =>
      res.json(),
    )

    this.data = data.data.products.edges.map(el => el.node)
    /* this.data = data.data.products.edges[0].node; */
  },
  watch: {
    '$i18n.locale': '$fetch',
  },
}
</script>

<template>
  <div class="container-fluid container-large px-md-0 my-5">
    <div class="row">
      <div v-if="data" class="col-12 text-center">
        <h2 class="font-weight-bold text-dark-primary">
          {{ $t("recentlySeen") }}
        </h2>
      </div>

      <div v-if="data" class="col-12 py-4">
        <VueSlickCarousel v-bind="settings">
          <div v-for="product in data" :key="product.id" class="mb-5">
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

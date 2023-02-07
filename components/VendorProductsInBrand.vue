<script>
import { queryProductsByVendor } from '../utilities/productQueries'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
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
    const GRAPHQL_URL = this.$config.DOMAIN
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN

    const recommendationsQuery = queryProductsByVendor(this.vendor)

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
    const dataVendor = await fetch(
      GRAPHQL_URL,
      GRAPHQL_BODY_RECCOMENDATIONS,
    ).then(res => res.json())

    this.data = dataVendor.data.products.nodes
  },
  watch: {
    '$i18n.locale': '$fetch',
  },
}
</script>

<template>
  <div class="container-fluid container-large px-0 my-5">
    <div class="row">
      <div v-if="data && data.length > 0" class="col-12 text-center">
        <h2 class="font-weight-bold text-dark-primary">
          {{ $t("sameProducer") }}
        </h2>
      </div>

      <div v-if="data && data.length > 0" class="col-12 py-4">
        <VueSlickCarousel v-bind="settings">
          <div v-for="product in data" :key="product.id" class="mb-5">
            <ProductCardVertical :product="product" />
          </div>
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
:deep(.slick-arrow.slick-prev) {
  width: 48px;
  height: 48px;
  background: white;
  box-shadow: 0 0.5rem 1rem rgba(102, 101, 101, 0.5) !important;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iZGFya3JlZCIgY2xhc3M9ImJpIGJpLWNoZXZyb24tbGVmdCIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS4zNTQgMS42NDZhLjUuNSAwIDAgMSAwIC43MDhMNS43MDcgOGw1LjY0NyA1LjY0NmEuNS41IDAgMCAxLS43MDguNzA4bC02LTZhLjUuNSAwIDAgMSAwLS43MDhsNi02YS41LjUgMCAwIDEgLjcwOCAweiIvPgo8L3N2Zz4=") !important;
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
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iZGFya3JlZCIgY2xhc3M9ImJpIGJpLWNoZXZyb24tcmlnaHQiIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNNC42NDYgMS42NDZhLjUuNSAwIDAgMSAuNzA4IDBsNiA2YS41LjUgMCAwIDEgMCAuNzA4bC02IDZhLjUuNSAwIDAgMS0uNzA4LS43MDhMMTAuMjkzIDggNC42NDYgMi4zNTRhLjUuNSAwIDAgMSAwLS43MDh6Ii8+Cjwvc3ZnPg==") !important;
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

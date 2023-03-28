<script>
import { computed, ref } from '@nuxtjs/composition-api'
import VueSlickCarousel from 'vue-slick-carousel'
import { inRange } from '@/utilities/math'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  components: { VueSlickCarousel },
  props: {
    products: { type: Array },
    settings: {
      type: Object,
      default: () => ({
        focusOnSelect: true,
        infinite: true,
        speed: 500,
        touchThreshold: 5,
        slidesToShow: 4,
        slidesToScroll: 4,
        dots: false,
        arrows: true,
        responsive: [
          {
            breakpoint: 411,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: true,
              arrows: false,
            },
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              dots: true,
              arrows: false,
            },
          },
          {
            breakpoint: 1023,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              dots: true,
              arrows: false,
            },
          },
          {
            breakpoint: 1280,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4,
              dots: true,
              arrows: false,
            },
          },
        ],
      }),
    },
    title: { type: String },
  },
  setup() {
    const c1 = ref(null)
    const currentSlide = computed(() => c1.value && c1.value.$refs.innerSlider.currentSlide)

    return { c1, currentSlide, inRange }
  },
}
</script>

<template>
  <div class="cmw-max-w-screen-xl cmw-mx-auto cmw-py-4 cmw-px-4">
    <div class="cmw-h2 cmw-text-center cmw-py-4" v-text="title" />
    <ClientOnly>
      <VueSlickCarousel ref="c1" v-bind="settings" dots-class="c-carouselDots">
        <div v-for="product in products" :key="product.id">
          <ProductBoxVertical :product="product" />
        </div>
        <template #customPaging="page">
          <button
            :data-test="page"
            class="c-carouselDots__dot"
            :class="{ '-sm': !inRange((page - currentSlide), -2, 2) }"
          />
        </template>
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
    </ClientOnly>
  </div>
</template>

<style scoped>
::v-deep(.slick-slide) {
  padding-left: 8px;
  padding-right: 8px;
}

::v-deep(.slick-track) {
  margin-bottom: 15px;
}

::v-deep(.custom-arrow.slick-prev) {
  left: -30px;
}

::v-deep(.custom-arrow.slick-next) {
  right: -30px;
}

::v-deep(.c-carouselDots) {
  display: flex !important;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
}

::v-deep(.c-carouselDots li) {
  display: flex !important;
}

::v-deep(.c-carouselDots__dot) {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: theme('colors.primary.100');
  transform: scale(0.5);
  transition: transform 300ms ease-in-out;
}

::v-deep(.slick-active .c-carouselDots__dot) {
  transform: scale(1);
  background-color: theme('colors.primary.DEFAULT');
}

::v-deep(li:not(.slick-active) .c-carouselDots__dot.-sm) {
  transform: scale(0.3);
}
</style>

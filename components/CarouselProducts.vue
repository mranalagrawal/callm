<script>
import { ref } from '@nuxtjs/composition-api'
import useScreenSize from '@/components/composables/useScreenSize'
import { inRange } from '@/utilities/math'
import { generateKey } from '~/utilities/strings'

export default {
  props: {
    products: { type: Array },
    responsive: {
      type: Array,
      default: () => ([
        {
          minWidth: 0,
          slidesPerPage: 2,
        },
        {
          minWidth: 411,
          slidesPerPage: 1,
        },
        {
          minWidth: 767,
          slidesPerPage: 2,
        },
        {
          minWidth: 1023,
          slidesPerPage: 3,
        },
        {
          minWidth: 1280,
          slidesPerPage: 4,
        },
      ]),
    },
    title: { type: [String, Object] },
  },
  setup() {
    const { isTablet } = useScreenSize()
    const carousel = ref(null)

    return {
      carousel,
      isTablet,
      inRange,
    }
  },
  methods: { generateKey },
}
</script>

<template>
  <div class="cmw-max-w-screen-xl cmw-mx-auto cmw-py-4 cmw-px-4">
    <div class="cmw-h2 cmw-text-center cmw-py-4" v-text="title" />
    <SsrCarousel
      ref="carousel" :key="products.length" :responsive="responsive" :show-arrows="isTablet"
      :show-dots="isTablet" class="cmw-relative"
    >
      <div v-for="(product, idx) in products" :key="generateKey(`${title}-${product.id}`)" class="cmw-my-8">
        <ProductBoxVertical :product="product" :position="idx + 1" />
      </div>
      <!--
      <template #customPaging="page">
          <button
            class="c-carouselDots__dot"
            :class="{ '-sm': !inRange((page - currentSlide), -2, 2) }"
          />
        </template>
        -->
      <template #back-arrow>
        <span class="cmw-w-12 cmw-h-12 cmw-bg-white cmw-rounded-sm">
          <VueSvgIcon
            :data="require(`@/assets/svg/chevron-left.svg`)" color="#992545" width="20" height="20"
            class="cmw-m-auto"
          />
        </span>
      </template>
      <template #next-arrow>
        <span class="cmw-w-12 cmw-h-12 cmw-bg-white cmw-rounded-sm">
          <VueSvgIcon
            :data="require(`@/assets/svg/chevron-right.svg`)" color="#992545" width="20" height="20"
            class="cmw-m-auto"
          />
        </span>
      </template>
    </SsrCarousel>
  </div>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent, inject, onMounted, useContext, useRoute } from '@nuxtjs/composition-api'
import chevronLeftIcon from 'assets/svg/chevron-left.svg'
import chevronRightIcon from 'assets/svg/chevron-right.svg'
import { inRange } from '@/utilities/math'
import type { IProductMapped } from '~/types/product'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  props: {
    products: {
      type: Array as PropType<IProductMapped[]>,
      required: true,
    },
    responsive: {
      type: Array,
      default: () => ([
        {
          minWidth: 0,
          slidesPerPage: 1,
        },
        {
          minWidth: 412,
          slidesPerPage: 2,
        },
        {
          minWidth: 992,
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
  setup(props) {
    const { $config, $cmwGtmUtils } = useContext()
    const isTablet = inject('isTablet')
    const route = useRoute()

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage($cmwGtmUtils.getActionField(route.value), {
        event: 'productListView',
        ecommerce: {
          currencyCode: $config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          actionField: { list: $cmwGtmUtils.getActionField(route.value) },
          impressions: props.products.map(product => product.gtmProductData),
        },
      })
    })

    return {
      isTablet,
      chevronLeftIcon,
      chevronRightIcon,
      inRange,
    }
  },
  methods: { generateKey },
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto py-4 px-4">
    <div class="h2 text-center py-4" v-text="title" />
    <SsrCarousel
      :key="products.length" :responsive="responsive" :show-arrows="isTablet"
      :show-dots="true" class="relative"
    >
      <div v-for="(product, idx) in products" :key="generateKey(`${title}-${product.id}`)" class="my-8">
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
        <span class="w-12 h-12 bg-white rounded-sm">
          <VueSvgIcon
            :data="chevronLeftIcon" color="#992545" width="20" height="20"
            class="m-auto"
          />
        </span>
      </template>
      <template #next-arrow>
        <span class="w-12 h-12 bg-white rounded-sm">
          <VueSvgIcon
            :data="chevronRightIcon" color="#992545" width="20" height="20"
            class="m-auto"
          />
        </span>
      </template>
    </SsrCarousel>
  </div>
</template>

<style scoped>
@screen desktop-wide {
  ::v-deep(.ssr-carousel-back-button) {
    left: -2%;
  }

  ::v-deep(.ssr-carousel-next-button) {
    right: -2%;
  }
}
</style>

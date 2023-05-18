<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent, inject, onMounted, useContext } from '@nuxtjs/composition-api'
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
  setup(props) {
    const { $config, $cmwGtmUtils } = useContext()
    const isTablet = inject('isTablet')

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage($cmwGtmUtils.getActionField(), {
        event: 'productListView',
        ecommerce: {
          currencyCode: $config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          actionField: { list: $cmwGtmUtils.getActionField() },
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
  <div class="cmw-max-w-screen-xl cmw-mx-auto cmw-py-4 cmw-px-4">
    <div class="cmw-h2 cmw-text-center cmw-py-4" v-text="title" />
    <SsrCarousel
      :key="products.length" :responsive="responsive" :show-arrows="isTablet"
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
            :data="chevronLeftIcon" color="#992545" width="20" height="20"
            class="cmw-m-auto"
          />
        </span>
      </template>
      <template #next-arrow>
        <span class="cmw-w-12 cmw-h-12 cmw-bg-white cmw-rounded-sm">
          <VueSvgIcon
            :data="chevronRightIcon" color="#992545" width="20" height="20"
            class="cmw-m-auto"
          />
        </span>
      </template>
    </SsrCarousel>
  </div>
</template>

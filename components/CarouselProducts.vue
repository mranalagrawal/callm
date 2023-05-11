<script>
import { onMounted, ref, useContext, useRoute } from '@nuxtjs/composition-api'
import useScreenSize from '@/components/composables/useScreenSize'
import { inRange } from '@/utilities/math'
import useGtm from '~/components/composables/useGtm'
import { cleanRoutesLocales, generateKey } from '~/utilities/strings'

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
  setup(props) {
    const { $config } = useContext()
    const route = useRoute()
    const { isTablet } = useScreenSize()
    const { gtmPushPage } = useGtm()
    const carousel = ref(null)

    const getActionField = () => {
      if (route.value.path === '/')
        return 'home'
      else if (Object.keys(route.value.query).includes('search'))
        return 'search_results'
      else return route.value.meta?.actionField || cleanRoutesLocales(route.value.name)
    }

    onMounted(() => {
      process.browser && gtmPushPage(getActionField(), {
        event: 'productListView',
        ecommerce: {
          currencyCode: $config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          actionField: getActionField(),
          impressions: props.products.map(product => product.gtmProductData),
        },
      })
    })

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

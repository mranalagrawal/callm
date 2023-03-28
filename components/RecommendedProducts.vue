<script>
import { ref, toRefs, useContext, useFetch, watch } from '@nuxtjs/composition-api'
import { getMappedProducts } from '@/utilities/mappedProduct'
import getProductRecommendations from '@/graphql/queries/getProductRecommendations'

export default {
  props: ['id'],
  setup(props) {
    const { i18n, $graphql } = useContext()
    const productsRef = ref([])
    const { id: idRef } = toRefs(props)

    const { fetch } = useFetch(async () => {
      if (!idRef.value)
        return

      await $graphql.default.request(getProductRecommendations, {
        lang: i18n.locale.toUpperCase(),
        productId: idRef.value,
      })
        .then(async ({ productRecommendations = [] }) => {
          if (productRecommendations.length)
            productsRef.value = getMappedProducts(productRecommendations)
        }).catch(err => console.log(err))
    })

    watch(() => idRef.value, () => fetch())

    return { idRef, productsRef }
  },
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
}
</script>

<template>
  <div>
    <p v-if="$fetchState.pending" class="px-4">
      {{ $t("loading") }}
    </p>
    <template v-else>
      <CarouselProducts v-if="!!productsRef.length" :products="productsRef" :title="$t('common.carousel.recommendedProducts')" />
    </template>
  </div>
</template>

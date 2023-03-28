<script>
import { ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { getMappedProducts } from '@/utilities/mappedProduct'
import getCollection from '@/graphql/queries/getCollection'

export default {
  setup() {
    const { $graphql, i18n } = useContext()
    const collectionRef = ref({
      description: '',
      descriptionHtml: '',
      image: {
        altText: '',
        height: '',
        id: '',
        url: '',
        width: '',
      },
      title: '',
      products: [],
    })
    const { fetch } = useFetch(async () => {
      const { collection } = await $graphql.default.request(getCollection, {
        lang: i18n.locale.toUpperCase(),
        handle: 'home-shelf-1',
      })

      collectionRef.value = {
        ...collection,
        products: collection.products.nodes.length && getMappedProducts(collection.products.nodes),
      }
    })
    return { fetch, collectionRef }
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
}
</script>

<template>
  <div class="container my-5">
    <CarouselProducts v-if="!!collectionRef.products.length" :products="collectionRef.products" :title="collectionRef.description" />
    <div class="cmw-mt-5">
      <Button
        class="cmw-w-[min(100%,_10rem)] cmw-m-inline-auto"
        variant="ghost"
        :to="localePath('/catalog?favourite=true&page=1')"
      >
        {{ $t("viewMore") }}
      </Button>
    </div>
  </div>
</template>

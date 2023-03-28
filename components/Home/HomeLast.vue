<script>
import { ref, useContext, useFetch } from '@nuxtjs/composition-api'
import getCollection from '@/graphql/queries/getCollection'
import { getMappedProducts } from '@/utilities/mappedProduct'

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
        handle: 'home-shelf-2',
      })

      collectionRef.value = {
        ...collection,
        products: collection.products.nodes.length && getMappedProducts(collection.products.nodes),
      }
    })
    return { fetch, collectionRef }
  },
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

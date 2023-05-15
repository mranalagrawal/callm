<script lang="ts">
import { ref, useFetch } from '@nuxtjs/composition-api'
import getCollection from '@/graphql/queries/getCollection.graphql'

export default {
  setup() {
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
    useFetch(async ({ $i18n, $graphql, $productMapping, $handleApiErrors }) => {
      await $graphql.default.request(getCollection, {
        lang: $i18n.locale.toUpperCase(),
        handle: 'home-shelf-1',
      })
        .then(({ collection }) => {
          collectionRef.value = {
            ...collection,
            products: collection.products.nodes.length && $productMapping.fromElastic(collection.products.nodes),
          }
        })
        .catch((err: Error) => {
          $handleApiErrors(`Catch getting Feature Products from Shopify: ${err}`)
        })
    })
    return { collectionRef }
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

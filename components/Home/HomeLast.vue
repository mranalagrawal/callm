<script lang="ts">
import { ref, useFetch } from '@nuxtjs/composition-api'
import getCollection from '@/graphql/queries/getCollection.graphql'
import type { ICollection } from '~/types/collection'
import { initialCollectionData } from '~/types/collection'

export default {
  setup() {
    const collectionRef = ref<ICollection>(initialCollectionData)
    const { fetch } = useFetch(async ({ $i18n, $graphql, $productMapping, $handleApiErrors }) => {
      await $graphql.default.request(getCollection, {
        lang: $i18n.locale.toUpperCase(),
        handle: 'home-shelf-2',
      })
        .then(({ collection }) => {
          collectionRef.value = {
            ...collection,
            products: collection.products.nodes.length && $productMapping.fromShopify(collection.products.nodes),
          }
        })
        .catch((err: Error) => {
          $handleApiErrors(`Catch getting Home Last Products from Shopify: ${err}`)
        })
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
        :to="localePath(collectionRef.link.value || '/catalog?favourite=true&page=1')"
      >
        {{ $t("viewMore") }}
      </Button>
    </div>
  </div>
</template>

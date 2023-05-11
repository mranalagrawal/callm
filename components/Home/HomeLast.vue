<script lang="ts">
import { ref, useFetch } from '@nuxtjs/composition-api'
import getCollection from '@/graphql/queries/getCollection.graphql'
import type { TISO639, TStores } from '~/config/themeConfig'
import { getMappedProducts } from '~/utilities/mappedProduct'

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
    const { fetch } = useFetch(async ({ $config, $i18n, $graphql, $handleApiErrors }) => {
      await $graphql.default.request(getCollection, {
        lang: $i18n.locale.toUpperCase(),
        handle: 'home-shelf-2',
      })
        .then(({ collection }) => {
          collectionRef.value = {
            ...collection,
            products: collection.products.nodes.length && getMappedProducts({
              arr: collection.products.nodes,
              lang: $i18n.locale as TISO639,
              store: $config.STORE as TStores,
            }),
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
        :to="localePath('/catalog?favourite=true&page=1')"
      >
        {{ $t("viewMore") }}
      </Button>
    </div>
  </div>
</template>

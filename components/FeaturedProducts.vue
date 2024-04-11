<script lang="ts">
import { ref, useFetch } from '@nuxtjs/composition-api'

import type { ICollection } from '~/types/collection'
import { initialCollectionData } from '~/types/collection'

export default {
  setup() {
    const collectionRef = ref<ICollection>(initialCollectionData)
    useFetch(async ({ $cmwRepo }) => {
      collectionRef.value = await $cmwRepo.products.getCollectionsByHandle({ handle: 'home-shelf-1' })
    })
    return { collectionRef }
  },
}
</script>

<template>
  <div class="my-5">
    <CarouselProducts v-if="!!collectionRef.products?.length" :products="collectionRef.products" :title="collectionRef.description" />
    <div class="mt-5">
      <CmwButton
        class="w-[min(100%,_80%)] sm:w-[min(100%,_14rem)] m-inline-auto"
        variant="ghost"
        :to="localePath(collectionRef.link?.value || '/catalog?favourite=true&page=1')"
      >
        {{ $t("viewMore") }}
      </CmwButton>
    </div>
  </div>
</template>

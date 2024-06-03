<script lang="ts">
import { ref, useContext, useFetch, watch } from '@nuxtjs/composition-api'


import type { ICollection } from '~/types/collection'
import { initialCollectionData } from '~/types/collection'

export default {
  props: {
    data: {
      type: String,
      required: true
    }
  },
  setup(props:any) {
    const collectionRef = ref<ICollection>(initialCollectionData)


    useFetch(async ({ $cmwRepo }) => {
      collectionRef.value = await $cmwRepo.products.getCollectionsByHandle({ handle: '', id: props.data })
    })
    return { collectionRef }
  },
}
</script>

<template>
  <div class="my-5">
    <template v-if="!!collectionRef.products?.length">
      <CarouselProducts :products="collectionRef.products" :title="collectionRef.title" />
      <div class="mt-5">
        <CmwButton class="w-[min(100%,_80%)] sm:w-[min(100%,_14rem)] m-inline-auto" variant="ghost"
          :to="localePath(collectionRef.link?.value || '/catalog?favourite=true&page=1')">
          {{ $t("viewMore") }}
        </CmwButton>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, onBeforeMount, onMounted, reactive, ref, useContext, useFetch, watch, watchEffect } from '@nuxtjs/composition-api'

import getHomeCollection from '~/graphql/queries/getHomeCollection.graphql'
import { useHomeStore } from '~/store/homeStore';
import { useLayout } from '~/store/layout';

import type { ICollection } from '~/types/collection'
import { initialCollectionData } from '~/types/collection'

export default {
  setup() {
  
      const {
      $graphql,
      i18n,

    } = useContext()
    const homeStore = useHomeStore()
  // Define a reactive object to hold the collection data
  const collectionData = reactive({
      metaobject: null
    });
   
    const getHome = async () => {
      try {
        const classicCollectionOne = ref(homeStore.metaobject);
        const classicCollectionValue = Array.isArray(classicCollectionOne?.value)
          ? classicCollectionOne.value.find(field => field.key === 'collection_1_classic')?.value
          : null;

        const { metaobject } = await $graphql.default.request(getHomeCollection, {
          lang: i18n.locale.toUpperCase(),
          id: classicCollectionValue,
          filters: [{ available: true }],
          first: 25,
          sortKey: "COLLECTION_DEFAULT"
        });
        
         collectionData.metaobject = metaobject;
      } catch (error) {
        console.error('Error in fetch():', error);
      }
    };
    // getHome();

    onMounted(getHome)
   
     const first25Products = computed(() => {
      return  collectionData?.metaobject.collection.reference.products.nodes.slice(0, 25);
    });
    return {  collectionData ,first25Products}
  },
}
</script>

<template>
  <div class="my-5">
    <template v-if="collectionData.metaobject">
      <CarouselProducts :products="first25Products" :title="collectionData.metaobject.name.value" />
      <div class="mt-5">
        <CmwButton class="w-[min(100%,_80%)] sm:w-[min(100%,_14rem)] m-inline-auto" variant="ghost"
          :to="localePath(collectionData.metaobject.link?.value || '/catalog?favourite=true&page=1')">
          {{ $t("viewMore") }}
        </CmwButton>
      </div>
    </template>
    <template v-else>
      <p>Loading...</p>
    </template>
  </div>
</template>

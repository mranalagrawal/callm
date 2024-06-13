<script lang="ts">
import { ref, useContext, watchEffect } from '@nuxtjs/composition-api'
import { useHomeStore } from '~/store/homeStore';
import getHomeCollection from "~/graphql/queries/getHomeCollection.graphql";


export default {
  setup() {
  const { $graphql, i18n, $handleApiErrors, $productMapping } = useContext();
    const homeStore = useHomeStore();
    const collectionData = ref();
    const metaObjectData = ref({})

    const getHome = async () => {
      try {
        const classicCollectionThree = ref(homeStore.metaobject);
        const classicCollectionValue = Array.isArray(classicCollectionThree?.value)
          ? classicCollectionThree.value.find(field => field.key === 'collection_3_classic')?.value
          : null;
        const response = await $graphql.default.request(getHomeCollection, {
          lang: i18n.locale.toUpperCase(),
          id: classicCollectionValue,
          filters: [{ available: true }],
          first: 25,
          sortKey: "COLLECTION_DEFAULT",
        });

        const { metaobject } = response;

        if (metaobject.collection) {
          const products = metaobject.collection.reference.products.nodes.length
            ? $productMapping.fromShopify(
                metaobject.collection.reference.products.nodes
              )
            : [];
          collectionData.value = products
          metaObjectData.value=metaobject
        } else {
          collectionData.value = [];
        }
      } catch (error) {
        $handleApiErrors(`Catch getting ${""} from Shopify: ${error}`);
        collectionData.value = [];
      }
    };
    watchEffect(()=>getHome())
    // onMounted(getHome);

    return { collectionData,metaObjectData};
  },
}
</script>

<template>
  <div class="my-5">
    <template v-if="!!collectionData?.length">
      <CarouselProducts v-if="!!collectionData?.length" :products="collectionData"
        :title="metaObjectData.name.value" />
      <div class="mt-5">
        <CmwButton class="w-[min(100%,_80%)] sm:w-[min(100%,_14rem)] m-inline-auto" variant="ghost"
          :to="localePath(metaObjectData.link?.value || '/catalog?favourite=true&page=1')">
          {{ $t("viewMore") }}
        </CmwButton>
      </div>
    </template>
  </div>
</template>

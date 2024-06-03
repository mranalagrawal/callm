<script lang="ts">
import { defineComponent, inject, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import type { Ref } from '@nuxtjs/composition-api'
import LazyHydrate from 'vue-lazy-hydration'
import classicCollection from '~/graphql/queries/getClassicCollection.graphql'
import { useHomeStore } from '~/store/homeStore';
import { useLayout } from '~/store/layout'

import { generateHeadHreflang } from '~/utilities/arrays'

export default defineComponent({
  name: 'IndexPage',
  components: {
    LazyHydrate,
    FeaturedProducts: () => import('../components/FeaturedProducts.vue'),
    // eslint-disable-next-line vue/no-unused-components
    HomeLast: () => import('../components/Home/HomeLast.vue'), // Fixme: doesn't recognises Nuxt's Lazy prefix
    HomeCta: () => import('../components/Home/HomeCta.vue'),
    HomeSelections: () => import('../components/Home/HomeSelections.vue'),
    HomeSlider: () => import('../components/Home/HomeSlider.vue'),
  },

  setup() {
    const {
      $graphql,
      i18n,

    } = useContext()
    const { getCurrentHome } = useLayout()
    const homeStore = useHomeStore()
    const { $cmwStore } = useContext()
    const isTablet = inject('isTablet') as Ref<boolean>
    const hrefLang = {
      'en-gb': 'https://www.callmewine.co.uk',
      'it': 'https://www.callmewine.com',
      'en': 'https://www.callmewine.com/en',
      'fr': 'https://www.callmewine.fr',
      'de': 'https://www.callmewine.de',
    }
    const classicCollectionId = ref(null)
    const classicCollection3Id = ref(null)
    const collectionValue = async () => {
      try {
        const classicCollectionOne = ref(homeStore.metaobject);
        const classicCollectionValue = Array.isArray(classicCollectionOne?.value)
          ? classicCollectionOne.value.find(field => field.key === 'collection_1_classic')?.value
          : null;

        if (classicCollectionValue) {
          const { metaobject } = await $graphql.default.request(
            classicCollection,
            {
              lang: i18n.locale.toUpperCase(),
              id: classicCollectionValue,
            }
          );

          const collectionField = metaobject.fields.find((field: any) => field.key === 'collection');
          const collectionValue = collectionField ? collectionField.value : null;

          classicCollectionId.value = collectionValue

        } else {
          console.error('Classic collection value is null or undefined');
        }
      } catch (error) {
        console.error('Error collectionValue fetching data:', error);
      }
    };


    const collection3Value = async () => {
      try {
        const classicCollectionThree = ref(homeStore.metaobject);
        const classicCollectionValue = Array.isArray(classicCollectionThree?.value)
          ? classicCollectionThree.value.find(field => field.key === 'collection_3_classic')?.value
          : null;

        if (classicCollectionValue) {
          const { metaobject } = await $graphql.default.request(
            classicCollection,
            {
              lang: i18n.locale.toUpperCase(),
              id: classicCollectionValue,
            }
          );

          const collectionField = metaobject.fields.find((field: any) => field.key === 'collection');
          const collectionValue = collectionField ? collectionField.value : null;

          classicCollection3Id.value = collectionValue

        } else {
          console.error('Classic collection value is null or undefined');
        }
      } catch (error) {
        console.error('Error collectionValue fetching data:', error);
      }
    };

    onMounted(() => {
      collectionValue();
      collection3Value()
    });

    useFetch(async () => {
      const promises = [
        getCurrentHome(),
      ]

      await Promise.all(promises)
    })


    useMeta(() => ({
      link: generateHeadHreflang(hrefLang),
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'url': $cmwStore.settings?.website || 'https://www.callmewine.com',
          'logo': 'https://cdn.shopify.com/s/files/1/0650/4356/2708/files/logo-callmewine.png?v=1696941270',
          'contactPoint': [{
            '@type': 'ContactPoint',
            'telephone': $cmwStore.settings?.telephone || '+39 02 81480430',
            'contactType': 'customer service',
          }],
          'sameAs': [
            'https://www.facebook.com/callmewine',
          ],
        }),
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'http://schema.org',
          '@type': 'WebSite',
          'url': $cmwStore.settings?.website || 'https://www.callmewine.com',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': $cmwStore.settings?.website ? `${$cmwStore.settings?.website}/catalog?search={query}` : 'https://www.callmewine.com/catalog?search={query}',
            'query-input': 'required name=query',
          },
        }),
      }],
      __dangerouslyDisableSanitizers: ['script'],
    }))

    return { isTablet, classicCollectionId, classicCollection3Id }
  },
  head: {},
})
</script>

<template>
  <div>
    <ClientOnly>
      <HomeBanner />
      <template #placeholder>
        <div class="bg-primary-50 w-full h-[505px]" />
      </template>
    </ClientOnly>
    <HomeBoxes />
    <!-- Note: LazyHydrate is not working as expected on carousels -->
    <ClientOnly>
      <FeaturedProducts v-if="classicCollectionId" class="px-3" :data="classicCollectionId" />
    </ClientOnly>
    <LazyHydrate :when-visible="{ rootMargin: '100px' }">
      <HomeSelections />
    </LazyHydrate>

    <div class="<md:hidden">
      <HomeSlider />
    </div>

    <HomePartners />

    <ClientOnly>
      <LazyHomeLast v-if="classicCollection3Id" class="px-3" :data="classicCollection3Id" />
    </ClientOnly>

    <HomeProducers />

    <LazyHydrate :when-visible="{ rootMargin: '100px' }">
      <HomeCta />
    </LazyHydrate>
  </div>
</template>

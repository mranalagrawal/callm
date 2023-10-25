<script lang="ts">
import type { Ref } from '@nuxtjs/composition-api'
import { defineComponent, inject } from '@nuxtjs/composition-api'
import LazyHydrate from 'vue-lazy-hydration'

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
    const isTablet = inject('isTablet') as Ref<boolean>

    return { isTablet }
  },
  data() {
    return {
      // homeBanner: 'HomeBanner',
      links: {
        'en-gb': 'https://www.callmewine.co.uk',
        'it': 'https://www.callmewine.com',
        'en': 'https://www.callmewine.com/en',
        'fr': 'https://www.callmewine.fr',
        'de': 'https://www.callmewine.de',
      },
    }
  },
  head() {
    return {
      description: 'Online wine for sale on Callmewine, your online wine shop: the best way to buy wines and champagne on offer at exceptional prices!',
      link: Object.entries(this.links).map((el) => {
        return {
          hid: `alternate-${el[0]}`,
          rel: 'alternate',
          href: el[1],
          hreflang: el[0],
        }
      }),
    }
  },
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
      <FeaturedProducts class="px-3" />
    </ClientOnly>

    <LazyHydrate :when-visible="{ rootMargin: '100px' }">
      <HomeSelections />
    </LazyHydrate>

    <div class="<md:hidden">
      <HomeSlider />
    </div>

    <HomePartners />

    <ClientOnly>
      <LazyHomeLast class="px-3" />
    </ClientOnly>

    <HomeProducers />

    <LazyHydrate :when-visible="{ rootMargin: '100px' }">
      <HomeCta />
    </LazyHydrate>
  </div>
</template>

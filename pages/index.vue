<script>
import LazyHydrate from 'vue-lazy-hydration'
import prismicConfig from '~/config/prismicConfig'

export default {
  name: 'IndexPage',
  components: {
    LazyHydrate,
    FeaturedProducts: () => import('../components/FeaturedProducts.vue'),
    HomeLast: () => import('../components/Home/HomeLast.vue'),
    HomeCta: () => import('../components/Home/HomeCta.vue'),
    HomeSelections: () => import('../components/Home/HomeSelections.vue'),
    HomeSlider: () => import('../components/Home/HomeSlider.vue'),
  },
  layout({ $config }) {
    return $config.STORE
  },
  data() {
    return {
      homeBanner: prismicConfig[this.$config.STORE].components.homeBanner,
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
}
</script>

<template>
  <div>
    <component :is="homeBanner" />
    <HomeBoxes />
    <!-- Note: LazyHydrate is not working as expected on carousels -->
    <FeaturedProducts />

    <LazyHydrate :when-visible="{ rootMargin: '100px' }">
      <HomeSelections />
    </LazyHydrate>

    <div class="<md:hidden">
      <HomeSlider />
    </div>

    <HomePartners />

    <LazyHomeLast />

    <HomeProducers />

    <LazyHydrate :when-visible="{ rootMargin: '100px' }">
      <HomeCta />
    </LazyHydrate>
  </div>
</template>

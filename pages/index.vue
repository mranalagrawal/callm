<script>
import FeaturedProducts from '../components/FeaturedProducts.vue'
import HomeBanner from '../components/Home/HomeBanner.vue'
import HomeBoxes from '../components/Home/HomeBoxes.vue'
import HomeCta from '../components/Home/HomeCta.vue'
import HomeDescription from '../components/Home/HomeDescription.vue'
import HomeLast from '../components/Home/HomeLast.vue'
import HomeSlider from '../components/Home/HomeSlider.vue'
import ProductCardVertical from '../components/ProductCardVertical.vue'
import HomeSelection from '../components/Home/HomeSelections.vue'
import HomePartners from '../components/Home/HomePartners.vue'
import HomeProductors from '../components/Home/HomeProductors.vue'
import HomeBannerWV from '../components/Home/HomeBannerWV.vue'

import HomeCollections from '../components/Home/HomeCollections.vue'
import components from './../components-mapper'

export default {
  name: 'IndexPage',
  components: {
    HomeBanner,
    HomeBannerWV,
    HomeBoxes,
    ProductCardVertical,
    HomeLast,
    HomeCta,
    HomeSlider,
    HomeDescription,
    FeaturedProducts,
    HomeSelection,
    HomePartners,
    HomeProductors,
    HomeCollections,
  },
  layout(context) {
    return context.$config.STORE
  },
  data() {
    return {
      homebanner: components[this.$config.STORE].HomeBanner,
      links: {
        'en-gb': 'https://www.callmewine.co.uk',
        'it': 'https://www.callmewine.com',
        'en': 'https://www.callmewine.com/en',
        'fr': 'https://www.callmewine.com.fr',
        'de': 'https://www.callmewine.com.de',
      },
    }
  },
  head() {
    return {
      /* title: "CallMeWine", */
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
    <!-- <HomeBanner v-if="$config.THEME == 'default'" />
    <HomeBannerWV v-if="$config.THEME == 'wildvigneron'" /> -->

    <component :is="homebanner" />

    <client-only>
      <HomeBoxes />
    </client-only>

    <client-only>
      <FeaturedProducts />
    </client-only>

    <div v-if="$config.STORE !== 'WILDVIGNERON'">
      <client-only>
        <home-selections />
      </client-only>
    </div>

    <div v-if="$config.STORE !== 'WILDVIGNERON'">
      <div class="d-none d-md-block">
        <HomeSlider />
      </div>

      <client-only>
        <HomePartners />
      </client-only>
    </div>

    <div v-if="$config.STORE === 'WILDVIGNERON'">
      <HomeCollections />
    </div>

    <client-only>
      <HomeLast />
    </client-only>

    <client-only>
      <HomeProductors />
    </client-only>

    <div v-if="$config.STORE !== 'WILDVIGNERON'">
      <HomeCta />
      <HomeDescription />
    </div>
  </div>
</template>

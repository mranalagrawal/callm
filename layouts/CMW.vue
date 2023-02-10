<script>
import TopBar from '../components/TopBar.vue'
import Navbar from '../components/Navbar.vue'

import Footer from '../components/Footer.vue'

export default {
  name: 'IndexPage',
  components: {
    TopBar,
    Navbar,

    Footer,
  },
}
</script>

<template>
  <div>
    <TopBar />
    <client-only>
      <div class="">
        <Navbar />
      </div>
    </client-only>

    <nuxt class="pt-5" style="position: relative; top: 120px" />

    <Footer style="position: relative; top: 120px" />
    <client-only>
      <FlashMessage position="right top" />
    </client-only>
  </div>
</template>

<script>
import TopBar from '../components/TopBar.vue'

import NavbarWV from '../components/NavbarWV.vue'

export default {
  name: 'IndexPage',
  components: {
    TopBar,
    NavbarWV,
  },
}
</script>

<template>
  <div>
    <TopBar />
    <Navbar class="cmw-navbar" />

    <nuxt class="cmw-main" />

    <LazyTheFooterWV style="position: relative; top: 110px" />
    <client-only>
      <FlashMessage position="right top" />
    </client-only>
  </div>
</template>

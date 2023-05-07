<script>
import TopBar from '../components/TopBar.vue'
import Navbar from '../components/Navbar.vue'

export default {
  name: 'IndexPage',
  components: {
    TopBar,
    Navbar,
  },
}
</script>

<template>
  <div>
    <TopBar />
    <Navbar class="cmw-navbar" />

    <nuxt class="cmw-main" />

    <LazyTheFooter style="position: relative; top: 120px" />
    <client-only>
      <FlashMessage position="right top" />
    </client-only>
  </div>
</template>

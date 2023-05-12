<script>
import TopBar from '../components/TopBar.vue'

export default {
  name: 'IndexPage',
  components: {
    TopBar,
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

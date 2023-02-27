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
    <client-only>
      <div class="">
        <Navbar />
      </div>
    </client-only>

    <nuxt class="pt-5" style="position: relative; top: 120px" />

    <LazyTheFooter style="position: relative; top: 120px" />
    <client-only>
      <FlashMessage position="right top" />
    </client-only>
  </div>
</template>

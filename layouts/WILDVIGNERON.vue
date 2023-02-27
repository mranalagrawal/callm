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
    <client-only>
      <div class="">
        <NavbarWV />
      </div>
    </client-only>

    <nuxt class="pt-5" style="position: relative; top: 110px" />

    <LazyTheFooterWV style="position: relative; top: 110px" />
    <client-only>
      <FlashMessage position="right top" />
    </client-only>
  </div>
</template>

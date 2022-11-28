<template>
  <div>
    <TopBar />
    <client-only>
      <div class="">
        <navbar />
      </div>
    </client-only>

    <nuxt class="pt-5" style="position: relative; top: 120px"></nuxt>

    <Footer style="position: relative; top: 120px" />
    <client-only>
      <FlashMessage :position="'right top'"></FlashMessage>
    </client-only>
  </div>
</template>

<script>
import TopBar from "../components/TopBar.vue";
import Navbar from "../components/Navbar.vue";

import Footer from "../components/Footer.vue";

export default {
  components: {
    TopBar,
    Navbar,

    Footer,
  },
  name: "IndexPage",
};
</script>

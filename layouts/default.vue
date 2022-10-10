<template>
  <div>
    <client-only>
      <div class="">
        <navbar />
      </div>
    </client-only>

    <nuxt class=""></nuxt>

    <Footer />
    <client-only>
      <FlashMessage :position="'right top'"></FlashMessage>
    </client-only>
  </div>
</template>

<script>
import TopBar from "../components/TopBar.vue";
import Navbar from "../components/Navbar.vue";

import MegaTest from "../components/MegaTest.vue";
import MegaMenu from "../components/MegaMenu.vue";
import Footer from "../components/Footer.vue";

export default {
  components: {
    TopBar,
    Navbar,
    MegaTest,
    MegaMenu,
    Footer,
  },
  name: "IndexPage",
};
</script>

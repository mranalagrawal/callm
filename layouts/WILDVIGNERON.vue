<template>
  <div>
    <TopBar />
    <client-only>
      <div class="">
        <NavbarWV />
      </div>
    </client-only>

    <nuxt class="pt-5" style="position: relative; top: 110px"></nuxt>

    <FooterWV style="position: relative; top: 110px" />
    <client-only>
      <FlashMessage :position="'right top'"></FlashMessage>
    </client-only>
  </div>
</template>

<script>
import TopBar from "../components/TopBar.vue";
import Navbar from "../components/Navbar.vue";
import NavbarWV from "../components/NavbarWV.vue";

import MegaTest from "../components/MegaTest.vue";
import MegaMenu from "../components/MegaMenu.vue";
import FooterWV from "../components/FooterWV.vue";

export default {
  components: {
    TopBar,
    NavbarWV,
    MegaTest,
    MegaMenu,
    FooterWV,
  },
  name: "IndexPage",
};
</script>

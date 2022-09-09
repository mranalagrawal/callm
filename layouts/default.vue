<template>
  <div>
    <top-bar></top-bar>
    <navbar />
    <!-- <mega-menu /> -->
    <!-- <mega-test /> -->

    <nuxt></nuxt>

    <Footer />
    <FlashMessage></FlashMessage>
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

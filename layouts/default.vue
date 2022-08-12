<template>
  <div>
    <top-bar></top-bar>
    <navbar />
    <!-- <mega-menu /> -->
    <mega-test />

    <nuxt></nuxt>

    <Footer />
  </div>
</template>

<script>
import TopBar from "../components/TopBar.vue";
import Navbar from "../components/Navbar.vue";
import MegaMenu from "../components/MegaMenu.vue";
import MegaTest from "../components/MegaTest.vue";
import Footer from "../components/Footer.vue";

export default {
  components: {
    TopBar,
    Navbar,
    MegaMenu,
    MegaTest,
    Footer,
  },
  name: "IndexPage",
};
</script>

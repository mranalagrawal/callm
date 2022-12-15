<template>
  <div>
    <TopBar />
    <client-only>
      <navbar class="cmw-navbar" />
    </client-only>

    <nuxt class="cmw-main" />

    <Footer style="position: relative; top: 120px" />
    <client-only>
      <FlashMessage :position="'right top'"></FlashMessage>
    </client-only>
  </div>
</template>

<script>
import {localeChanged, localize} from "vee-validate";
import {lookUpLocale} from "~/plugins/vee-validate";
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
  mounted() {
    localize(this.$i18n.locale, lookUpLocale(this.$i18n.locale))
    localeChanged()
  }
};
</script>

<style scoped>
.cmw-main {
  padding-top: var(--cmw-header-height);
}

.cmw-navbar {
  padding-top: var(--cmw-top-banner-height);
}
</style>

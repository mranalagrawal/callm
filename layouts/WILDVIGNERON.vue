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

import NavbarWV from "../components/NavbarWV.vue";

import FooterWV from "../components/FooterWV.vue";

export default {
  components: {
    TopBar,
    NavbarWV,

    FooterWV,
  },
  name: "IndexPage",
};
</script>

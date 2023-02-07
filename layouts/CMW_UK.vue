<script>
import { localeChanged, localize } from 'vee-validate'
import TopBar from '../components/TopBar.vue'
import Navbar from '../components/Navbar.vue'

import Footer from '../components/Footer.vue'
import { lookUpLocale } from '~/plugins/vee-validate'
import { useCustomer } from '~/store/customer'

export default {
  name: 'IndexPage',
  components: {
    TopBar,
    Navbar,
    Footer,
  },
  async fetch() {
    const customerStore = useCustomer()
    localize(this.$i18n.locale, lookUpLocale(this.$i18n.locale))
    localeChanged()
    const accessToken = this.$nuxt.$cookieHelpers.getToken()
    if (accessToken)
      await customerStore.getCustomer()
  },
}
</script>

<template>
  <div>
    <TopBar />
    <client-only>
      <Navbar class="cmw-navbar" />
    </client-only>

    <nuxt class="cmw-main" />

    <Footer style="position: relative; top: 120px" />
    <client-only>
      <FlashMessage position="right top" />
    </client-only>
    <CmwSplash />
  </div>
</template>

<style scoped>
.cmw-main {
  width: 100vw;
  padding-top: var(--cmw-header-height);
  overflow-x: hidden;
}

.cmw-navbar {
  padding-top: var(--cmw-top-banner-height);
}
</style>

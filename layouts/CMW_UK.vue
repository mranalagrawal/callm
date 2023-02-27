<script>
import { localeChanged, localize } from 'vee-validate'
import LazyHydrate from 'vue-lazy-hydration'
import TopBar from '../components/TopBar.vue'
import Navbar from '../components/Navbar.vue'

import { lookUpLocale } from '~/plugins/vee-validate'
import { useCustomer } from '~/store/customer'

export default {
  name: 'IndexPage',
  components: {
    LazyHydrate,
    TheFooter: () => import('../components/TheFooter.vue'),
    TopBar,
    Navbar,
  },
  data() {
    return {
      show: false,
    }
  },
  async fetch() {
    const customerStore = useCustomer()
    localize(this.$i18n.locale, lookUpLocale(this.$i18n.locale))
    localeChanged()
    const accessToken = this.$nuxt.$cookieHelpers.getToken()
    if (accessToken)
      await customerStore.getCustomer()
  },
  head() {
    return {
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$i18n.t('head.description'),
        },
      ],
    }
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

    <LazyHydrate :when-visible="{ rootMargin: '100px' }">
      <LazyTheFooter style="position: relative; top: 120px" />
    </LazyHydrate>

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
}

.cmw-navbar {
  padding-top: var(--cmw-top-banner-height);
}
</style>

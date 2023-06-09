<script lang="ts">
import { localeChanged, localize } from 'vee-validate'
import { onMounted, provide, readonly, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import TopBar from '../components/TopBar.vue'
import Navbar from '../components/Navbar.vue'
import useScreenSize from '~/components/composables/useScreenSize'
import useNewsletterSplash from '~/components/composables/useNewsletterSplash'

import { lookUpLocale } from '~/plugins/vee-validate'
import { useCustomer } from '~/store/customer'

export default {
  components: {
    // LazyHydrate,
    // TheFooter: () => import('../components/TheFooter.vue'),
    TopBar,
    Navbar,
  },
  setup() {
    const { i18n } = useContext()
    const customerStore = useCustomer()
    const { handleNewsletterSplash } = useNewsletterSplash()
    const {
      isTablet,
      isDesktop,
      isDesktopWide,
      hasBeenSet,
    } = useScreenSize()

    provide('isTablet', readonly(isTablet))
    provide('isDesktop', readonly(isDesktop))
    provide('isDesktopWide', readonly(isDesktopWide))
    provide('hasBeenSet', readonly(hasBeenSet))

    useFetch(async ({ $cookieHelpers }) => {
      localize(i18n.locale, lookUpLocale(i18n.locale))
      localeChanged()

      const accessToken = $cookieHelpers.getToken()
      accessToken && await customerStore.getCustomer()
    })

    onMounted(() => {
      handleNewsletterSplash()
    })

    useMeta(() => ({
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: i18n.t('head.description') as string,
        },
      ],
    }))

    return { isTablet, isDesktop, isDesktopWide, hasBeenSet, handleNewsletterSplash }
  },
  head: {},
}
</script>

<template>
  <div>
    <TopBar />
    <Navbar class="cmw-navbar" />

    <nuxt class="cmw-main" />

    <!--    <LazyHydrate :when-visible="{ rootMargin: '100px' }">
      <TheFooter style="position: relative; top: 120px" />
    </LazyHydrate>

    <client-only>
      <FlashMessage position="right top" />
    </client-only>
    &lt;!&ndash; Todo: lazy load this component &ndash;&gt;
    <CmwSplash /> -->
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

<script lang="ts">
import { localeChanged, localize } from 'vee-validate'
import {
  defineComponent,
  onMounted,
  provide,
  readonly,
  useContext,
  useFetch,
  useMeta,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'
// import LazyHydrate from 'vue-lazy-hydration'

import useScreenSize from '~/components/composables/useScreenSize'
import useNewsletterSplash from '~/components/composables/useNewsletterSplash'
import Navbar from '~/components/Navbar.vue'
import TopBar from '~/components/TopBar.vue'

import { lookUpLocale } from '~/plugins/vee-validate'
import { useCustomer } from '~/store/customer'
import { useShopifyCart } from '~/store/shopifyCart'

export default defineComponent({
  components: {
    // LazyHydrate,
    TheFooter: () => import('../components/TheFooter.vue'),
    TopBar,
    Navbar,
  },
  setup() {
    const { i18n, $cookies } = useContext()
    const route = useRoute()
    const { getCustomer } = useCustomer()
    const { getShopifyCart } = useShopifyCart()
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
      accessToken && await getCustomer()

      const cartId = $cookies.get('cartId')
      cartId && await getShopifyCart(cartId)
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

    watch(() => route.value, () => {
      if (process.client && !isTablet.value) {
        // FixMe: temporary workaround for mobile
        setTimeout(() => window.scrollTo({ left: 0, top: 0, behavior: 'smooth' }), 300)
      }
    })
    return { isTablet, isDesktop, isDesktopWide, hasBeenSet, handleNewsletterSplash }
  },
  head: {},
})
</script>

<template>
  <div>
    <TopBar />
    <Navbar class="cmw-navbar" />

    <nuxt class="cmw-main" />

    <!--    <LazyHydrate :when-visible="{ rootMargin: '100px' }"> -->
    <TheFooter />
    <!--    </LazyHydrate> -->

    <ClientOnly>
      <FlashMessage position="right top" />
    </ClientOnly>
    <!-- Todo: lazy load this component -->
    <CmwSplash />
  </div>
</template>

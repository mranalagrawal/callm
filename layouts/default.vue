<script lang="ts">
import {
  computed,
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
    const { i18n, $cookies, req, store } = useContext()
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
      const accessToken = $cookieHelpers.getToken()
      accessToken && await getCustomer()

      const cartId = $cookies.get('cartId')
      cartId && await getShopifyCart(cartId)

      const isFromApp = req.headers['from-app']

      if (isFromApp)
        store.commit('headers/SET_FROM_APP', { fromApp: true })
    })

    const isFromApp = computed(() => store.state.headers.fromApp)

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
    return {
      handleNewsletterSplash,
      hasBeenSet,
      isDesktop,
      isDesktopWide,
      isFromApp,
      isTablet,
    }
  },
  head: {},
})
</script>

<template>
  <div>
    <TopBar />
    <Navbar v-if="!isFromApp" class="cmw-navbar " />

    <nuxt :class="isFromApp ? 'cmw-app-main' : 'cmw-main'" />

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

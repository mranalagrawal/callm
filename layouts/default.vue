<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  provide,
  readonly,
  useContext,
  useFetch,
  useMeta,
  useRoute,
  useStore,
  watch,
  watchEffect,
} from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

// import LazyHydrate from 'vue-lazy-hydration'
import type { TISO639 } from '~/config/themeConfig'

import CustomerWishlist from '~/components/Header/CustomerWishlist.vue'
import Navbar from '~/components/Navbar.vue'
import TopBar from '~/components/TopBar.vue'
import useNewsletterSplash from '~/components/composables/useNewsletterSplash'
import useScreenSize from '~/components/composables/useScreenSize'

import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'
import { useVercelKv } from '~/store/vercelKv'

export default defineComponent({
  components: {
    CustomerWishlist,
    // LazyHydrate,
    TheFooter: () => import('../components/TheFooter.vue'),
    TopBar,
    Navbar,
  },
  setup() {
    const { i18n, $cookies, getRouteBaseName } = useContext()
    const store: any = useStore()
    const route = useRoute()
    const { loadMenu } = useVercelKv()
    const { getCustomer } = useCustomer()
    const { customer } = storeToRefs(useCustomer())
    const { getCartById, handleTemporaryCheckoutReplace, mergeCartCookieWithCheckoutId, getInitialCart } = useCart()
    const { cart } = storeToRefs(useCart())
    const { handleNewsletterSplash } = useNewsletterSplash()
    const {
      isMobile,
      isTablet,
      isDesktop,
      isDesktopWide,
      hasBeenSet,
    } = useScreenSize()

    provide('isMobile', readonly(isMobile))
    provide('isTablet', readonly(isTablet))
    provide('isDesktop', readonly(isDesktop))
    provide('isDesktopWide', readonly(isDesktopWide))
    provide('hasBeenSet', readonly(hasBeenSet))

    useFetch(async ({ $cmwStore, $cookieHelpers }) => {
      await loadMenu($cmwStore.prismicSettings.isoCode[i18n.locale as TISO639])
      const accessToken = $cookieHelpers.getToken()
      accessToken && await getCustomer()
    })

    const isFromApp = computed(() => store.state.headers.fromApp)
    const isHomePage = computed(() => getRouteBaseName(route.value) === 'index')
    const showTopBar = computed(() => (isFromApp.value && isHomePage.value) || !isFromApp.value)

    onMounted(async () => {
      const checkoutId = $cookies.get('checkoutId')
      const cartIdCookie = $cookies.get('cartId')

      if (checkoutId && !cartIdCookie) {
        await handleTemporaryCheckoutReplace(checkoutId)
      }

      nextTick(async () => {
        // Note: We handle logged-in users on getCustomer() so we can skip the else section
        // Handle non-logged-in users
        if (!customer.value?.id) {
          if (cartIdCookie && checkoutId) {
            await mergeCartCookieWithCheckoutId(checkoutId, cartIdCookie)
            $cookies.remove('checkoutId')
          } else if (cartIdCookie) {
            await getCartById(cartIdCookie)
          }
        } else {
          await getInitialCart()
        }
      })
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

    watchEffect(() => {
      if (!process.client) { return }
      const root = document.documentElement
      root.style.setProperty('--cmw-top-banner-height', showTopBar.value ? '26px' : '0px')

      if (isFromApp.value) {
        root.style.setProperty('--cmw-header-height', showTopBar.value ? '72px' : '0px')
      }
    })

    watch(() => route.value, () => {
      if (process.client && !isTablet.value) {
        // FixMe: temporary workaround for mobile
        setTimeout(() => window.scrollTo({ left: 0, top: 0, behavior: 'smooth' }), 300)
      }
    })
    return {
      cart,
      customer,
      getInitialCart,
      handleNewsletterSplash,
      hasBeenSet,
      isDesktop,
      isDesktopWide,
      isFromApp,
      isMobile,
      isTablet,
      showTopBar,
    }
  },
  head: {},
})
</script>

<template>
  <div>
    <TopBar v-if="showTopBar" />
    <Navbar v-if="!isFromApp" class="cmw-navbar" />
    <CustomerWishlist v-if="isFromApp && customer.id" />

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

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

import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'
import { useLayout } from '~/store/layout'
import { useVercelKv } from '~/store/vercelKv'

import useNewsletterSplash from '~/components/composables/useNewsletterSplash'
import useScreenSize from '~/components/composables/useScreenSize'
import CustomerWishlist from '~/components/Header/CustomerWishlist.vue'
import Navbar from '~/components/Navbar.vue'
import TopBar from '~/components/TopBar.vue'
import type { TISO639 } from '~/config/themeConfig'

export default defineComponent({
  components: {
    // LazyHydrate,
    CmwSplash: () => import('../components/Base/CmwSplash.vue'),
    CustomerWishlist,
    Navbar,
    TheFooter: () => import('../components/TheFooter.vue'),
    TopBar,
  },
  setup() {
    const { i18n, $cookies, getRouteBaseName } = useContext()
    const store: any = useStore()
    const route = useRoute()
    const { loadMenu } = useVercelKv()
    const { loadTopbar, loadFooter } = useLayout()
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

    const { fetch } = useFetch(async ({ $callLog, $cmwStore, $cookieHelpers }) => {
      $callLog({ msg: 'fetching layout data on DEFAULT LAYOUT' })

      const accessToken = $cookieHelpers.getToken()

      const promises = [
        loadMenu($cmwStore.prismicSettings.isoCode[i18n.locale as TISO639]),
        accessToken ? getCustomer() : Promise.resolve(),
        loadTopbar(),
        loadFooter(),
      ]

      await Promise.all(promises)
    })

    const isFromApp = computed(() => store.state.headers.fromApp)
    const isHomePage = computed(() => getRouteBaseName(route.value) === 'index')
    const isProductDetailsPage = computed(() => getRouteBaseName(route.value) === 'product')
    const showTopBar = computed(() => (isFromApp.value && isHomePage.value) || !isFromApp.value)

    provide('isProductDetailsPage', readonly(isProductDetailsPage))

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
        root.style.setProperty('--cmw-header-height', showTopBar.value ? '26px' : '0px')
      }
    })

    watch(() => route.value, () => {
      if (process.client && !isTablet.value) {
        // FixMe: temporary workaround for mobile
        setTimeout(() => window.scrollTo({ left: 0, top: 0, behavior: 'smooth' }), 300)
      }
    })

    watch(() => i18n.locale, () => fetch())

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

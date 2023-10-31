<script lang="ts">
import {
  computed,
  defineComponent, nextTick,
  onMounted,
  provide,
  readonly,
  useContext,
  useFetch,
  useMeta,
  useRoute, useStore,
  watch, watchEffect,
} from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
// import LazyHydrate from 'vue-lazy-hydration'

import useScreenSize from '~/components/composables/useScreenSize'
import useNewsletterSplash from '~/components/composables/useNewsletterSplash'
import Navbar from '~/components/Navbar.vue'
import TopBar from '~/components/TopBar.vue'
import { useCheckout } from '~/store/checkout'

import { useCustomer } from '~/store/customer'

export default defineComponent({
  components: {
    // LazyHydrate,
    TheFooter: () => import('../components/TheFooter.vue'),
    TopBar,
    Navbar,
  },
  setup() {
    const { i18n, $cookies, req, getRouteBaseName } = useContext()
    const store: any = useStore()
    const route = useRoute()
    const { getCustomer, customer } = useCustomer()
    const { getCheckoutById, mergeCheckoutStoreWithCheckout } = useCheckout()
    const { checkout } = storeToRefs(useCheckout())
    const { handleTemporaryCartReplace } = useCheckout()
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

      const isFromApp = req?.headers['user-agent']?.includes('CMW-App')

      if (isFromApp) { store.commit('headers/SET_FROM_APP', { fromApp: true }) }
    })

    const isFromApp = computed(() => store.state.headers.fromApp)
    const isHomePage = computed(() => getRouteBaseName(route.value) === 'index')
    const showTopBar = computed(() => (isFromApp.value && isHomePage.value) || !isFromApp.value)
    const showAppHeader = computed(() => (isFromApp.value && isHomePage.value))

    onMounted(async () => {
      await store.dispatch('user/setUser', null)
      const cartId = $cookies.get('cartId')
      if (cartId) {
        await handleTemporaryCartReplace(cartId)
      }

      nextTick(async () => {
        const checkoutId = $cookies.get('checkoutId')

        if (!customer.id && checkoutId) {
          await getCheckoutById(checkoutId)
        }

        if (customer.id && checkoutId) {
          await getCheckoutById(checkoutId)

          if (customer.lastIncompleteCheckout?.id && customer.lastIncompleteCheckout.id !== checkoutId) {
            await mergeCheckoutStoreWithCheckout(customer.lastIncompleteCheckout.id)
          }
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
    })

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
      showAppHeader,
      showTopBar,
      checkout,
    }
  },
  head: {},
})
</script>

<template>
  <div>
    <TopBar v-if="showTopBar" />
    <Navbar v-if="!isFromApp" class="cmw-navbar" />
    <AppHeader v-if="showAppHeader" />

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

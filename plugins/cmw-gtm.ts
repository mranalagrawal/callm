import { storeToRefs } from 'pinia'

import type { Plugin } from '@nuxt/types'
import type { TStores } from '~/config/themeConfig'

import themeConfig from '~/config/themeConfig'
import { useCustomer } from '~/store/customer'

interface ICmwGtmUtils {
  getActionField(route: any): string
  getCustomerGtmData: Function
  pushCustomLoginEvent(): void
  pushPage(pageType: string, data?: Record<string, any>): void
  resetDatalayerFields(): void
  resetDatalayerSpecificField(fieldName: string): void
}

declare module 'vue/types/vue' {
  // this.$cmwGtmUtils inside Vue components
  interface Vue {
    $cmwGtmUtils: ICmwGtmUtils
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$cmwGtmUtils inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $cmwGtmUtils: ICmwGtmUtils
  }
  // nuxtContext.$cmw
  interface Context {
    $cmwGtmUtils: ICmwGtmUtils
  }
}

declare module 'vuex/types/index' {
  // this.$cmwGtmUtils inside Vuex stores
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
  interface Store<S> {
    $cmwGtmUtils: ICmwGtmUtils
  }
}

const cmwGtm: Plugin = ({ $cmwStore, $config, $gtm, getRouteBaseName }, inject) => {
  const customerStore = useCustomer()
  const { customer } = storeToRefs(customerStore)

  const store: TStores = $config.STORE || 'CMW_UK'

  const $cmwGtmUtils: ICmwGtmUtils = {

    resetDatalayerSpecificField: (fieldName = 'ecommerce') => {
      if (typeof window !== 'undefined' && window.google_tag_manager
        && window.google_tag_manager[$config.gtm.id]) {
        window.google_tag_manager[$config.gtm.id].dataLayer.set(fieldName, undefined)
      }
    },

    resetDatalayerFields: () => {
      const fields = ['ecommerce', 'actionField', 'impressions', 'pageType', 'wishlistAddedProduct', 'event']

      if (typeof window !== 'undefined' && window.google_tag_manager && window.google_tag_manager[$config.gtm.id]) {
        fields.forEach(field => window.google_tag_manager[$config.gtm.id].dataLayer.set(field, undefined))
      }
    },

    getActionField: (route) => {
      if (route.path === '/') {
        return 'home'
      } else if (Object.keys(route.query).includes('search')) {
        return 'search_results'
      } else { return route.meta?.actionField || getRouteBaseName(route) }
    },

    pushPage: (pageType, data) => {
      // Note: temporary enable only on UK, FR, DE (PROD|STAGE) and and the rest just (STAGE)
      if ($cmwStore.isUk && $cmwStore.isProd) {
        // Run for UK in PROD environment
        $cmwGtmUtils.resetDatalayerFields()
      } else if (!$cmwStore.isDe && $cmwStore.isProd) {
        $cmwGtmUtils.resetDatalayerFields()
      } else if (!$cmwStore.isFr && $cmwStore.isProd) {
        $cmwGtmUtils.resetDatalayerFields()
      } else if (!$cmwStore.isProd) {
        // Run for the rest of the STORES in the STAGING environment
        $cmwGtmUtils.resetDatalayerFields()
      } else {
        // Do nothing for other scenarios
        return
      }

      $gtm.push({
        ...data,
        pageType,
        ...$cmwGtmUtils.getCustomerGtmData(),
      })
    },

    pushCustomLoginEvent: () => {
      $cmwGtmUtils.resetDatalayerFields()

      $gtm.push({
        event: 'login',
        ...$cmwGtmUtils.getCustomerGtmData(),
      })
    },

    getCustomerGtmData: () => {
      return {
        userLogStatus: customer.value.firstName ? 'logged' : 'not_logged',
        ...(customer.value.firstName && {
          userEmail: customer.value.email,
          userFirstName: customer.value.firstName,
          userId: customer.value.id,
          userLastName: customer.value.lastName,
          userPhone: customer.value.phone,
          userPurchasesCount: customer.value.numberOfOrders,
          userPurchasesTot: customer.value.amountSpent,
          userType: themeConfig[store]?.customerType, // getCustomerType.value,
        }),
      }
    },
  }

  inject('cmwGtmUtils', $cmwGtmUtils)
}

export default cmwGtm

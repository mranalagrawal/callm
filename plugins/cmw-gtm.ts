import { storeToRefs } from 'pinia'

import type { Plugin } from '@nuxt/types'
import type { TStores } from '~/config/themeConfig'

import themeConfig from '~/config/themeConfig'
import { useCustomer } from '~/store/customer'

interface ICmwGtmUtils {
  getActionField(route: any): string
  resetDatalayerSpecificField(fieldName: string): void
  resetDatalayerFields(): void
  pushPage(pageType: string, data?: Record<string, any>): void
  getCustomerGtmData: Function
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
    getActionField: (route) => {
      if (route.path === '/') {
        return 'home'
      } else if (Object.keys(route.query).includes('search')) {
        return 'search_results'
      } else { return route.meta?.actionField || getRouteBaseName(route) }
    },
    pushPage: () => {},
    getCustomerGtmData: () => {},

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
  }

  $cmwGtmUtils.getCustomerGtmData = () => {
    return {
      userLogStatus: customer.value.firstName ? 'logged' : 'not_logged',
      ...(customer.value.firstName && {
        userType: themeConfig[store]?.customerType, // getCustomerType.value,
        userId: customer.value.id,
        userFirstName: customer.value.firstName,
        userLastName: customer.value.lastName,
        userEmail: customer.value.email,
        userPhone: customer.value.phone,
        userPurchasesCount: customer.value.orders_count, // Note: We don't have this info on Store because we only get it at my-orders
        userPurchasesTot: customer.value.total_spent,
      }),
    }
  }

  $cmwGtmUtils.pushPage = async (pageType = '', data = {}) => {
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
  }

  inject('cmwGtmUtils', $cmwGtmUtils)
}

export default cmwGtm

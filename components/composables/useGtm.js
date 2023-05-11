import { storeToRefs } from 'pinia'
import { useCustomer } from '@/store/customer'
import themeConfig from '~/config/themeConfig'
import { cleanRoutesLocales } from '~/utilities/strings'

export default function () {
  const customerStore = useCustomer()
  const { customer } = storeToRefs(customerStore)

  const getCustomerGtmData = () => {
    return {
      userLogStatus: customer.value.firstName ? 'logged' : 'not_logged',
      ...(customer.value.firstName && {
        userType: themeConfig[$nuxt.$config.STORE].customerType, // getCustomerType.value,
        userId: customer.value.id,
        userFirstName: customer.value.firstName,
        userLastName: customer.value.lastName,
        userEmail: customer.value.email,
        userPhone: customer.value.phone,
      // userPurchasesCount: '', Note: We don't have this info on Store because we only get it at my-orders
      // userPurchasesTot: '',
      }),
    }
  }

  const getActionField = () => {
    if ($nuxt.$route.path === '/')
      return 'home'
    else if (Object.keys($nuxt.$route.query).includes('search'))
      return 'search_results'
    else return $nuxt.$route.meta?.actionField || cleanRoutesLocales($nuxt.$route.name)
  }

  const resetDatalayerFields = (fields = []) => {
    if (typeof window !== 'undefined' && window.google_tag_manager[$nuxt.$store.$config.gtm.id])
      fields.forEach(field => window.google_tag_manager[$nuxt.app.$config.gtm.id].dataLayer.set(field, undefined))
  }

  const gtmPushPage = (pageType = '', data = {}) => {
    $nuxt.$gtm.push({
      ...data,
      pageType,
      userLogStatus: customer.value.firstName ? 'logged' : 'not_logged',
      ...(getCustomerGtmData()),
    })

    resetDatalayerFields(['ecommerce', 'actionField', 'impressions', 'pageType'])
  }

  return { getActionField, getCustomerGtmData, gtmPushPage, resetDatalayerFields }
}

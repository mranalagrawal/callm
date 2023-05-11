import { useRoute } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useCustomer } from '@/store/customer'
import themeConfig from '~/config/themeConfig'
import { cleanRoutesLocales } from '~/utilities/strings'

export default function () {
  const customerStore = useCustomer()
  const { customer } = storeToRefs(customerStore)
  const route = useRoute()

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
    console.log(route.value)
    if (route.value.path === '/')
      return 'home'
    else if (Object.keys(route.value.query).includes('search'))
      return 'search_results'
    else return route.value.meta?.actionField || cleanRoutesLocales(route.value.name)
  }

  const gtmPushPage = (pageType = '', data = {}) => {
    $nuxt.$gtm.push({
      ...data,
      pageType,
      userLogStatus: customer.value.firstName ? 'logged' : 'not_logged',
      ...(getCustomerGtmData()),
    })
  }

  return { getActionField, getCustomerGtmData, gtmPushPage }
}

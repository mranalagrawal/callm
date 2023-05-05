import { storeToRefs } from 'pinia'
import { useCustomer } from '@/store/customer'

export default function () {
  const customerStore = useCustomer()
  const { customer, getCustomerType } = storeToRefs(customerStore)

  const getCustomerGtmData = () => ({
    userLogStatus: customer.value.firstName ? 'logged' : 'not_logged',
    ...(customer.value.firstName && {
      userType: getCustomerType.value,
      userId: customer.value.id,
      userFirstName: customer.value.firstName,
      userLastName: customer.value.lastName,
      userEmail: customer.value.email,
      userPhone: customer.value.phone,
      // userPurchasesCount: customer.value.lastName, Note: We don't have this info on Store because we only get it at my-orders
      // userPurchasesTot: customer.value.lastName,
    }),
  })

  const gtmPushPage = (pageType = '', data = {}) => {
    $nuxt.$gtm.push({
      ...data,
      pageType,
      userLogStatus: customer.value.firstName ? 'logged' : 'not_logged',
      ...(getCustomerGtmData()),
    })
  }

  return { getCustomerGtmData, gtmPushPage }
}

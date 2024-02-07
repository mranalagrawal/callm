import { storeToRefs } from 'pinia'
import { useContext } from '@nuxtjs/composition-api'

import { SweetAlertToast } from '~/utilities/Swal'
import { useCustomer } from '~/store/customer'
import { useProductAvailability } from '~/store/product-availability'
import { useSplash } from '~/store/splash'

export default function () {
  const { i18n, $cmw, $sentry } = useContext()
  const splash = useSplash()
  const customerStore = useCustomer()
  const productAvailability = useProductAvailability()

  const { customer } = storeToRefs(customerStore)
  // const { productId } = storeToRefs(productAvailability)

  const handleShowRequestModal = async (productId) => {
    if (customer.value.email) {
      await $cmw.$post('/products-availability-alerts', {
        email: customer.value.email,
        productFeId: productId,
        productId,
      })
        .then(({ data }) => {
          data && SweetAlertToast.fire({
            icon: 'success',
            text: i18n.t('product.notifyMeNote'),
          })
        })
        .catch((err) => {
          $sentry.captureException(new Error(`Catch products-availability-alerts error: ${err}`))
          SweetAlertToast.fire({
            icon: 'error',
            text: `error message: ${err}`,
          })
        })
    } else {
      splash.$patch({
        currentSplash: 'ProductRequestNotification',
        title: i18n.t('product.notifyMeTitle'),
        subtitle: i18n.t('product.notifyMeSubtitle'),
        size: 'lg',
      })

      productAvailability.$patch({ productId })
    }
  }
  return { handleShowRequestModal }
}

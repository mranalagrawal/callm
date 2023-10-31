import { storeToRefs } from 'pinia'
import { useCheckout } from '~/store/checkout'

export default (context) => {
  const checkoutStore = useCheckout()
  const { checkoutTotalQuantity: quantity } = storeToRefs(useCheckout())

  checkoutStore.$subscribe(() => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'cartQuantityUpdate',
        quantity,
      }))
    }
  }, { detached: true })

  window.redirectApp = (url) => {
    context.app.router.push(url)
  }
}

import { storeToRefs } from 'pinia'
import { useCart } from '~/store/cart'

export default (context) => {
  const cartStore = useCart()
  const { cartTotalQuantity: quantity } = storeToRefs(useCart())

  cartStore.$subscribe(() => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'cartQuantityUpdate',
        quantity: quantity.value,
      }))
    }
  }, { detached: true })

  window.redirectApp = (url) => {
    context.app.router.push(url)
  }
}

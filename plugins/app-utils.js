import { storeToRefs } from 'pinia'
import { useShopifyCart } from '~/store/shopifyCart'

export default (context) => {
  const store = useShopifyCart()
  const { shopifyCart } = storeToRefs(useShopifyCart())

  store.$subscribe(() => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'cartQuantityUpdate',
        quantity: shopifyCart.value.totalQuantity,
      }))
    }
  }, { detached: true })

  window.redirectApp = (url) => {
    context.app.router.push(url)
  }
}

import { storeToRefs } from 'pinia'
import { useShopifyCart } from '~/store/shopifyCart'

export default (context) => {
  const store = useShopifyCart()
  const { shopifyCart } = storeToRefs(useShopifyCart())

  store.$subscribe(() => {
    if (window.ReactNativeWebView) {
      let quantity = 0
      if (shopifyCart && shopifyCart.value) {
        quantity = shopifyCart.value.totalQuantity
      }
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

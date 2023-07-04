export const state = () => ({
  userCart: [],
  currencyCode: process.env.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
})

export const mutations = {
  addProduct(state, entry) {
    // find product
    const product = state.userCart.find(
      el => el.productVariantId === entry.id,
    )

    // se c'è già
    if (product) {
      product.quantity = product.quantity + 1
    } else {
      state.userCart.push({
        productVariantId: entry.id, // ma funziona?
        quantity: 1,
        singleAmount: entry.singleAmount,
        singleAmountFullPrice: entry.singleAmountFullPrice,
        tag: entry.tag,
        image: entry.image,
        title: entry.title,
        totalInventory: entry.totalInventory,
        gtmProductData: entry.gtmProductData,
        attributes: [
          {
            key: 'bundle',
            value: entry.tag.includes('BUNDLE').toString(),
          },
        ],
      })
    }

    this.app.$gtm.push({
      event: 'addToCart',
      ecommerce: {
        currencyCode: state.currencyCode,
        add: {
          products: [entry.gtmProductData],
        },
      },
    })

    if (typeof window !== 'undefined' && window.google_tag_manager && window.google_tag_manager[this.app.$config.gtm.id])
      window.google_tag_manager[this.app.$config.gtm.id].dataLayer.set('ecommerce', undefined)
  },
  removeProduct(state, entry) {
    // find product
    const product = state.userCart.find(
      el => el.productVariantId === entry.id,
    )

    if (!product)
      return

    if (product.quantity > 1)
      product.quantity = product.quantity - 1
    else
      state.userCart.splice(state.userCart.indexOf(product), 1)

    this.app.$gtm.push({
      event: 'removeFromCart',
      ecommerce: {
        currencyCode: state.currencyCode,
        remove: {
          products: [product.gtmProductData],
        },
      },
    })

    if (typeof window !== 'undefined' && window.google_tag_manager && window.google_tag_manager[this.app.$config.gtm.id])
      window.google_tag_manager[this.app.$config.gtm.id].dataLayer.set('ecommerce', undefined)
  },

  removeLine(state, entry) {
    const product = state.userCart.find(
      el => el.productVariantId === entry.id,
    )
    state.userCart.splice(state.userCart.indexOf(product), 1)

    this.app.$gtm.push({
      event: 'removeFromCart',
      ecommerce: {
        currencyCode: state.currencyCode,
        remove: {
          products: [entry.gtmProductData],
        },
      },
    })

    if (typeof window !== 'undefined' && window.google_tag_manager && window.google_tag_manager[this.app.$config.gtm.id])
      window.google_tag_manager[this.app.$config.gtm.id].dataLayer.set('ecommerce', undefined)
  },

  resetCart(state) {
    state.userCart = []
  },
}

export const getters = {
  cartItems(state) {
    return state.userCart && state.userCart
      .reduce((t, n) => t + n.quantity, 0)
  },

  getCartTotalAmount(state) {
    // FixMe: Frontend should never calculate prices, backend should send the cart amount within an object
    return state.userCart
      .reduce((t, n) => t + n.quantity * n.singleAmount, 0)
      .toFixed(2)
  },

  cartTotalAmountObj(state, getters) {
    const splitPriced = getters.getCartTotalAmount.split('.')

    return {
      value: Number(getters.getCartTotalAmount),
      formattedPrice: `${getters.getCartTotalAmount}€`, // Todo: is this always Euros or should be localized?
      integer: splitPriced[0],
      decimal: splitPriced[1],
      separator: ',',
    }
  },

  cartTotalQuantity(state) {
    return state.userCart
      .reduce((t, n) => t + n.quantity, 0)
  },
}

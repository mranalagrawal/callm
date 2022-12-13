export const state = () => ({
  userCart: [],
});

export const mutations = {
  addProduct(state, entry) {
    // find product
    const product = state.userCart.find(
      (el) => el.productVariantId == entry.productVariantId
    );

    // se c'è già
    if (product) {
      product.quantity = product.quantity + 1;
    } else {
      state.userCart.push({
        productVariantId: entry.productVariantId,
        quantity: 1,
        singleAmount: entry.singleAmount,
        singleAmountFullPrice: entry.singleAmountFullPrice,
        tag: entry.tag,
        image: entry.image,
        title: entry.title,
      });
    }
  },
  removeProduct(state, productVariantId) {
    // find product
    const product = state.userCart.find(
      (el) => el.productVariantId == productVariantId
    );

    if (product) {
      if (product.quantity > 1) {
        product.quantity = product.quantity - 1;
      } else {
        state.userCart.splice(state.userCart.indexOf(product), 1);
      }
    } else {
      return;
    }
  },

  removeLine(state, productVariantId) {
    const product = state.userCart.find(
      (el) => el.productVariantId == productVariantId
    );
    state.userCart.splice(state.userCart.indexOf(product), 1);
  },

  resetCart(state) {
    state.userCart = [];
  },
};

export const getters = {
  cartItems(state) {
    return state.userCart && state.userCart
      .reduce((t, n) => t + n.quantity, 0);
  },

  getCartTotalAmount(state) {
    // FixMe: Frontend should never calculate prices, backend should send the cart amount within an object
    return state.userCart
      .reduce((t, n) => t + n.quantity * n.singleAmount, 0)
      .toFixed(2);
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
      .reduce((t, n) => t + n.quantity, 0);
  }
}
